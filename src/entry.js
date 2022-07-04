import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as ZapparThree from "@zappar/zappar-threejs";
import model from '../assets/printer.glb';

var readpdf;
var closebutton;

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
    
    console.log(gltf.scene)
    gltf.scene.scale.x = 4;
    gltf.scene.scale.y = 4;
    gltf.scene.scale.z = 4;

    //hide what i don't wanna see first
    readpdf =  gltf.scene.children[3];
    closebutton =  gltf.scene.children[4];
    gltf.scene.children[3].visible = false;
    gltf.scene.children[4].visible = false;

    // Now the model has been loaded, we can add it to our instant_tracker_group
    instantTrackerGroup.add(gltf.scene);
  }, undefined, () => {
    console.log('An error ocurred loading the GLTF model');
});

// Let's add some lighting, first a directional light above the model pointing down
const directionalLight = new THREE.DirectionalLight('white', 2.8);
directionalLight.position.set(5, 5, 0);
directionalLight.lookAt(0, 0, 0);
instantTrackerGroup.add(directionalLight);

// And then a little ambient light to brighten the model up a bit
const ambientLight = new THREE.AmbientLight('white', 0.7);
instantTrackerGroup.add(ambientLight);


let hasPlaced = false;
const placeButton = document.getElementById('tap-to-place');
placeButton.addEventListener('click', () => {
  hasPlaced = true;
  placeButton.remove();
});

//Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( pointer, camera );

  // calculate objects intersecting the picking ray
const intersects = raycaster.intersectObjects( scene.children );
for ( let i = 0; i < intersects.length; i ++ ) {
  if (intersects[ i ].object.name === 'poipaper_1') {
    readpdf.visible = true;
    closebutton.visible = true;
  }
  if (intersects[ i ].object.name === 'close_2') {
    readpdf.visible = false;
    closebutton.visible = false;
  }

  
  console.log(intersects[ i ].object.name)
//  intersects[ i ].object.material.color.set( 0xff0000 );

}
}




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

window.addEventListener( 'pointerdown', onPointerMove );

render();


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}