import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("earthCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

// 🎥 カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4.5;

// 💡 光源
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 3, 5);
scene.add(light);

// 🌍 地球
const texture = new THREE.TextureLoader().load(
  "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg",
  () => renderer.render(scene, camera)
);
const geometry = new THREE.SphereGeometry(2.3, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: texture });
const earth = new THREE.Mesh(geometry, material);
earth.position.y = 0.5; // 少し上に配置
scene.add(earth);

// 🌌 星空
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3000;
const positions = [];
for (let i = 0; i < starsCount; i++) {
  positions.push((Math.random() - 0.5) * 1000);
  positions.push((Math.random() - 0.5) * 1000);
  positions.push(-Math.random() * 1000);
}
starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// 🌏 スクロールで縦回転させる
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const ratio = total > 0 ? scrollY / 3 / total : 0; // スクロール割合（0〜1）
  earth.rotation.x = ratio * Math.PI * 2; // 1周回転
});

// 🌀 自動でゆっくり横回転（雰囲気用）
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

// 📱 ウィンドウリサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
