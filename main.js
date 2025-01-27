import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Buttons
const btn_10k = document.getElementById('nodes_10k');
const btn_100k = document.getElementById('nodes_100k');
const btn_1m = document.getElementById('nodes_1M');
btn_10k.addEventListener('click', () => {
	window.location.reload();
	sessionStorage.setItem('count', 10000);
	renderCanvas();
});
btn_100k.addEventListener('click', () => {
	window.location.reload();
	sessionStorage.setItem('count', 100000);
	renderCanvas();
});
btn_1m.addEventListener('click', () => {
	window.location.reload();
	sessionStorage.setItem('count', 1000000);
	renderCanvas();
});

renderCanvas();
function renderCanvas() {
	let count = 10000;
	if (sessionStorage.getItem('count')) {
		count = sessionStorage.getItem('count');
	}
	// Scene, Camera, Renderer
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000); // Black background

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(50, 50, 100);

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Orbit Controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;

	// Cube Geometry and Material
	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
	const cubeMaterial = new THREE.MeshStandardMaterial({
		color: 0x44aa88,
		roughness: 0.5,
		metalness: 0.7,
	});

	// Instanced Mesh for Cubes
	const mesh = new THREE.InstancedMesh(cubeGeometry, cubeMaterial, count);

	// Generate Random Positions and Rotations
	const dummy = new THREE.Object3D(); // Helper object for transformations
	for (let i = 0; i < count; i++) {
		dummy.position.set(
			(Math.random() - 0.5) * 100, // X: Random position between -50 and 50
			(Math.random() - 0.5) * 100, // Y: Random position between -50 and 50
			(Math.random() - 0.5) * 100 // Z: Random position between -50 and 50
		);
		dummy.rotation.set(
			Math.random() * Math.PI, // Random X rotation
			Math.random() * Math.PI, // Random Y rotation
			Math.random() * Math.PI // Random Z rotation
		);
		dummy.updateMatrix(); // Update the transformation matrix
		mesh.setMatrixAt(i, dummy.matrix); // Apply to instanced mesh
	}

	// Add Mesh and Lighting
	scene.add(mesh);

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft ambient light
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(50, 50, 50);
	scene.add(directionalLight);

	// Resize Handler
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	// Animation Loop
	function animate() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
	animate();
}
