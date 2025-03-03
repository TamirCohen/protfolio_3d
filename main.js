import './style.css'
import * as THREE from 'three'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

let animals = [];
function add_animal(scene, obj_path, scale) {
// instantiate a loader
const loader = new OBJLoader();
// load a resource
loader.load(
	// resource URL
	obj_path,
	// called when resource is loaded
	function ( object ) {
    object.scale.set(scale, scale, scale);
    // Set random position
    const range = 80;
    const x = Math.random() * range - range / 2;
    const z = Math.random() * range - range / 2;
    object.position.set(x, 0, z);
    // Set object color
		scene.add( object );
    animals.push(object);
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
		console.log( error );

	}
);
}

function addTree(scene) {
  // Create trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

  // Create leaves
  const leavesGeometry = new THREE.ConeGeometry(5, 5, 4);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);

  // Position leaves
  leaves.position.y = 5;

  // Create tree
  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leaves);

  // Position tree at a random location
  const range = 300;
  const x = Math.random() * range - range / 2;
  const z = Math.random() * range - range / 2;
  tree.position.set(x, 5, z);

  // Add tree to scene
  scene.add(tree);
}

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(0)
camera.position.setX(0)
camera.position.setY(4)
camera.rotation.x = 0.01

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(200, 200, 0);
scene.background = new THREE.Color(0x0099cc);

scene.add(directionalLight);
// Visual representation of the light source

// Create a sphere that represents the sun
const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Position the sun at the same position as the directional light
sun.position.copy(directionalLight.position);

// Add the sun to the scene
scene.add(sun);


// const  controls = new OrbitControls(camera, renderer.domElement)

// Create the bottom of the ocean
const groundColor = 0x8B4513; // Brown color
const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
// Manipulate the vertices to create bumps and hills
const vertices = groundGeometry.attributes.position.array;

groundGeometry.computeVertexNormals();

const groundMaterial = new THREE.MeshStandardMaterial({ color: groundColor });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal

scene.add(ground);

for (let i = 0; i < 40; i++) {
  // add_animal(scene, "models/wolf.obj", 0.03);
  // Choose random animal and add it to the scene (one of 4 options)
  const animal = Math.floor(Math.random() * 4);
  switch (animal) {
    case 0:
      add_animal(scene, "./models/wolf.obj", 0.03);
      break;
    case 1:
      add_animal(scene, "./models/goat.obj", 0.01);
      break;
    case 2:
      add_animal(scene, "./models/deer.obj", 0.005);
      break;
    case 3:
console.log(vertices.length);
add_animal(scene, "./models/cow.obj", 0.005);
      break;

  
}}

// Choose 50 location to create the trees, and add them to the scene
for (let i = 0; i < 1000; i++) {
  addTree(scene);
}

var loader = new THREE.TextureLoader();

// Replace these paths with the actual paths to your face images
var textures = [
    //SORRY :)
    loader.load('./tamir.jpg'),
    loader.load('./tamir.jpg'),
    loader.load('./tamir.jpg'),
    loader.load('./tamir.jpg'),
    loader.load('./tamir.jpg'),
    loader.load('./tamir.jpg')
];

var materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
var cube = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), materials);
cube.position.set(7, 5, -13);
scene.add(cube);


// var loader = new THREE.TextureLoader();
// const geometry = new THREE.SphereGeometry( 5, 32, 16 ); 
// var texture = loader.load('assets/tamir.jpg'); // Replace with the path to your face image
// var material = new THREE.MeshBasicMaterial({ map: texture });

// const sphere = new THREE.Mesh( geometry, material ); 
// sphere.rotation.y = 4.2;
// scene.add( sphere );

// Add texture to the sphere object



const moving_period = 14;
let index = 0;

function rotate_animal(animal) {
  const direction = new THREE.Vector3();
  // Generate a random direction for the movement
  direction.x = (Math.random() - 0.5) * 2;
  direction.z = (Math.random() - 0.5) * 2;  
  animal.rotation.y = Math.atan2(direction.x, direction.z); // Rotate the animal to face the direction
}

function move_animal(animal, distance = 0.5) {
  // Get animal direction and move it
  const direction = new THREE.Vector3();

  var angle = animal.rotation.y;
  var newX = animal.position.x + distance * Math.sin(angle);
  var newZ = animal.position.z + distance * Math.cos(angle);
  animal.position.set(newX, 0, newZ);
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.02;
  camera.position.x = t * -0.0004;
  camera.position.y = 4 + t * -0.008;
  camera.rotation.y = t * -0.0002;


  cube.position.x = camera.position.x + -Math.sin(camera.rotation.y - 0.5) * 10;
  cube.position.z = camera.position.z + -Math.cos(camera.rotation.y - 0.5) * 10;
  cube.position.y = camera.position.y;
  cube.rotation.y = t * -0.0006;



}

document.body.onscroll = moveCamera;
moveCamera();



function animate() {
  index++;
  requestAnimationFrame(animate)
  // controls.update()
  for (let i = 0; i < animals.length; i++) {
    if (index % moving_period == 0) {
      rotate_animal(animals[i]);
    }
    move_animal(animals[i]);
  }

  renderer.render(scene, camera)
}
animate()