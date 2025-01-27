import {
	Engine,
	Scene,
	ArcRotateCamera,
	Vector3,
	HemisphericLight,
	MeshBuilder,
	StandardMaterial,
	Color3,
} from 'babylonjs';

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

	// Ensure the canvas element exists in your HTML
	const canvas = document.getElementById('container'); // The canvas element in your HTML
	if (!canvas) {
		throw new Error(
			'Canvas element not found! Ensure you have a <canvas id="renderCanvas"></canvas> in your HTML.'
		);
	}

	// Create Babylon Engine and Scene
	const engine = new Engine(canvas, true, { antialias: true }); // Enable antialiasing
	const scene = new Scene(engine);

	// Create Camera
	const camera = new ArcRotateCamera(
		'camera',
		Math.PI / 2,
		Math.PI / 4,
		150,
		new Vector3(0, 0, 0),
		scene
	);
	camera.attachControl(canvas, true); // Enable camera controls

	// Lighting
	new HemisphericLight('light', new Vector3(0, 1, 0), scene); // Ambient light

	// Cube Material
	const cubeMaterial = new StandardMaterial('cubeMaterial', scene);
	cubeMaterial.diffuseColor = new Color3(0.27, 0.67, 0.53); // Set the base color
	cubeMaterial.specularColor = new Color3(1, 1, 1); // Add specular highlights

	// Create a Single Cube (Master Mesh)
	const masterCube = MeshBuilder.CreateBox('masterCube', { size: 1 }, scene);
	masterCube.material = cubeMaterial;
	masterCube.isVisible = false; // Hide the master mesh

	// Create 1,000,000 Instanced Cubes
	for (let i = 0; i < count; i++) {
		const instance = masterCube.createInstance(`cube_${i}`);
		instance.position = new Vector3(
			(Math.random() - 0.5) * 100, // X: Random position between -50 and 50
			(Math.random() - 0.5) * 100, // Y: Random position between -50 and 50
			(Math.random() - 0.5) * 100 // Z: Random position between -50 and 50
		);
		instance.rotation = new Vector3(
			Math.random() * Math.PI, // Random X rotation
			Math.random() * Math.PI, // Random Y rotation
			Math.random() * Math.PI // Random Z rotation
		);
	}

	// Handle Window Resizing
	window.addEventListener('resize', () => {
		engine.resize();
	});

	// Render Loop
	engine.runRenderLoop(() => {
		scene.render();
	});
}
