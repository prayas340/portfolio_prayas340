import * as THREE from 'three';

export function initContactScene(canvas) {
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.TorusKnotGeometry(1.2, 0.28, 120, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0x9b59b6,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

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
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.005;
    inner.rotation.x -= 0.004;
    inner.rotation.z += 0.003;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
