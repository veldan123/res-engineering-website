/* RES Engineering — 3D wireframe hero (progressive enhancement)
   A real 3D single-line diagram: 3-phase busbar, transformer, feeders,
   with current pulses flowing through it. Loads ONLY on desktop with
   motion allowed, after the page is idle. Falls back to the static SVG
   diagram on mobile, reduced-motion, no-JS, or any load failure — so
   the page stays fast and SEO is unaffected. */
(() => {
  const wrap = document.querySelector('.hero-diagram-wrap');
  if (!wrap) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (matchMedia('(max-width: 1024px)').matches) return;
  if (navigator.connection && navigator.connection.saveData) return;

  let booted = false;
  const boot = () => {
    if (booted) return;
    booted = true;
    import('https://esm.sh/three@0.160.1').then(init).catch(() => { booted = false; });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 2000 });
  setTimeout(boot, 2200); // guaranteed fallback if idle callback is throttled

  function init(THREE) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-3d-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    wrap.appendChild(canvas);
    wrap.classList.add('has-3d');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.4, 15);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    const WHITE = 0xe4ebf7, R = 0xE03C31, Y = 0xF2B705, B = 0x2E5BFF;
    const lineMat = new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity: 0.5 });

    const segMat = (color, opacity = 0.85) =>
      new THREE.LineBasicMaterial({ color, transparent: true, opacity });

    const addSegments = (pairs, mat) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pairs.flat(2), 3));
      group.add(new THREE.LineSegments(g, mat || lineMat));
    };

    /* ---- 3-phase busbar (R / Y / B, offset in depth) ---- */
    const phases = [{ z: -0.4, c: R }, { z: 0, c: Y }, { z: 0.4, c: B }];
    phases.forEach(p => addSegments([[[-5, 1.4, p.z], [5, 1.4, p.z]]], segMat(p.c, 0.9)));

    /* ---- incoming supply + arrowhead ---- */
    addSegments([
      [[0, 5.2, 0], [0, 1.4, 0]],
      [[-0.28, 4.6, 0], [0, 5.2, 0]],
      [[0.28, 4.6, 0], [0, 5.2, 0]],
    ]);

    /* ---- transformer: two wireframe rings ---- */
    const ring = (cy, r) => {
      const pts = [];
      const N = 40;
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
        pts.push([[Math.cos(a0) * r, cy + Math.sin(a0) * r, 0], [Math.cos(a1) * r, cy + Math.sin(a1) * r, 0]]);
      }
      addSegments(pts);
    };
    ring(3.35, 0.62); ring(2.75, 0.62);

    /* ---- feeders down to distribution boards (varied depth = real 3D) ---- */
    const feeders = [
      { x: -3, box: [-3, -2.7, -1.2] },
      { x: 0, box: [0, -2.7, 1.4] },
      { x: 3, box: [3, -2.7, -0.8] },
    ];
    feeders.forEach(f => {
      addSegments([[[f.x, 1.4, 0], [f.x, -0.2, f.box[2] * 0.4]], [[f.x, -0.2, f.box[2] * 0.4], f.box]]);
      // wireframe box at the end
      const [bx, by, bz] = f.box, s = 0.45;
      const box = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(s * 2, s * 2, s * 2)),
        segMat(WHITE, 0.55)
      );
      box.position.set(bx, by, bz);
      group.add(box);
    });

    /* ---- phase-colour nodes on the busbar ---- */
    [{ x: -3, c: R }, { x: 0, c: Y }, { x: 3, c: B }].forEach(n => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 14, 14),
        new THREE.MeshBasicMaterial({ color: n.c })
      );
      m.position.set(n.x, 1.4, 0);
      group.add(m);
    });

    /* ---- current pulses flowing through the network ---- */
    const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
    const makePath = (pts) => {
      const vs = pts.map(V), cum = [0]; let total = 0;
      for (let i = 0; i < vs.length - 1; i++) { total += vs[i].distanceTo(vs[i + 1]); cum.push(total); }
      return { vs, cum, total };
    };
    const pointAt = (path, t) => {
      const d = t * path.total;
      let i = 0;
      while (i < path.cum.length - 2 && path.cum[i + 1] < d) i++;
      const span = (path.cum[i + 1] - path.cum[i]) || 1;
      return path.vs[i].clone().lerp(path.vs[i + 1], (d - path.cum[i]) / span);
    };
    const paths = [
      makePath([[0, 5.2, 0], [0, 1.4, 0], [-3, 1.4, 0], [-3, -0.2, -0.48], [-3, -2.7, -1.2]]),
      makePath([[0, 5.2, 0], [0, 1.4, 0], [0, -0.2, 0.56], [0, -2.7, 1.4]]),
      makePath([[0, 5.2, 0], [0, 1.4, 0], [3, 1.4, 0], [3, -0.2, -0.32], [3, -2.7, -0.8]]),
    ];
    const pulses = [];
    paths.forEach(path => {
      for (let k = 0; k < 3; k++) pulses.push({ path, t: Math.random(), speed: 0.16 + Math.random() * 0.08 });
    });
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(pulses.length * 3), 3));
    const pulsePts = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: Y, size: 0.22, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    group.add(pulsePts);

    /* ---- interaction + loop ---- */
    let targetX = 0, targetY = 0, curX = 0, curY = 0, scrollRot = 0;
    window.addEventListener('pointermove', (e) => {
      const r = wrap.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
    }, { passive: true });
    window.addEventListener('scroll', () => { scrollRot = window.scrollY * 0.0004; }, { passive: true });

    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let visible = true;
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; })
      .observe(wrap);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) last = performance.now(); });

    const posAttr = pGeo.getAttribute('position');
    let last = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (!visible || document.hidden) return;

      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      group.rotation.y = Math.sin(now * 0.00018) * 0.5 + curX + scrollRot;
      group.rotation.x = curY * 0.6 + Math.sin(now * 0.00013) * 0.05;

      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        p.t += p.speed * dt;
        if (p.t > 1) p.t -= 1;
        const v = pointAt(p.path, p.t);
        posAttr.setXYZ(i, v.x, v.y, v.z);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  }
})();
