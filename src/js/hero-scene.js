import * as THREE from 'three';

export function initHeroScene(canvas) {
  if (!canvas) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particleCount = 2800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const blue = new THREE.Color(0x00aaff);
  const violet = new THREE.Color(0x9b59b6);

  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r = 1.2 + Math.random() * 0.35;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const mix = Math.random();
    const c = blue.clone().lerp(violet, mix);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.018,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const wireGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const wireframe = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireframe);

  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotY = mouseX * 0.4;
    targetRotX = mouseY * 0.25;
  });

  function resize() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  resize();
  window.addEventListener('resize', resize);

  function animate() {
    particles.rotation.y += 0.0015;
    particles.rotation.x += 0.0008;
    wireframe.rotation.y -= 0.002;
    wireframe.rotation.x += 0.001;

    particles.rotation.y += (targetRotY - particles.rotation.y) * 0.04;
    particles.rotation.x += (targetRotX - particles.rotation.x) * 0.04;
    wireframe.rotation.y = particles.rotation.y * 0.8;
    wireframe.rotation.x = particles.rotation.x * 0.8;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  return { scene, camera, renderer, particles };
}
