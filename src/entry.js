import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as ZapparThree from "@zappar/zappar-threejs";
import model from '../assets/waving.glb';


if (ZapparThree.browserIncompatible()) {
    ZapparThree.browserIncompatibleUI();
    throw new Error('Unsupported browser');
  }

const manager = new ZapparThree.LoadingManager();

const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );

//Zappar Camera
const camera = new ZapparThree.Camera();
ZapparThree.permissionRequestUI().then((granted) => {
    // If the user granted us the permissions we need then we can start the camera
    // Otherwise let's them know that it's necessary with Zappar's permission denied UI
    if (granted) camera.start();
    else ZapparThree.permissionDeniedUI();
});

ZapparThree.glContextSet(renderer.getContext());

scene.background = camera.backgroundTexture;

//ground Plane
const instantTracker = new ZapparThree.InstantWorldTracker();
const instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, instantTracker);
scene.add(instantTrackerGroup);

const gltfLoader = new GLTFLoader(manager);

//load 3d file
gltfLoader.load(model, (gltf) => {
    // Now the model has been loaded, we can add it to our instant_tracker_group
    instantTrackerGroup.add(gltf.scene);
  }, undefined, () => {
    console.log('An error ocurred loading the GLTF model');
});

// Let's add some lighting, first a directional light above the model pointing down
const directionalLight = new THREE.DirectionalLight('white', 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
instantTrackerGroup.add(directionalLight);

// And then a little ambient light to brighten the model up a bit
const ambientLight = new THREE.AmbientLight('white', 0.4);
instantTrackerGroup.add(ambientLight);


let hasPlaced = false;
const placeButton = document.getElementById('tap-to-place');
placeButton.addEventListener('click', () => {
  hasPlaced = true;
  placeButton.remove();
});


function render() {
    requestAnimationFrame( render );

    if (!hasPlaced) {
        // If the user hasn't chosen a place in their room yet, update the instant tracker
        // to be directly in front of the user
        instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
      }
    
      // The Zappar camera must have updateFrame called every frame
      camera.updateFrame(renderer);
    
      // Draw the ThreeJS scene in the usual way, but using the Zappar camera
      renderer.render(scene, camera);
    
};

render();


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}