// SG1
// torus with controls




var camera , scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createScene() {

var geometry = new THREE.TorusBufferGeometry( 10, 3, 16, 100 );
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var torus = new THREE.Mesh( geometry, material );




var L = new THREE.PointLight(0xFFFFFF, 1, 100);

L.position.set(-20, 10, 5);

var ALight = new THREE.AmbientLight(0x222220);
/**
scene.add(ALight);

scene.add(L);
**/

// add to the scene
scene.add(torus);
}

function init() {
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvasRatio = canvasWidth / canvasHeight;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.setSize(canvasWidth, canvasHeight);

renderer.setClearColor(0x000000, 1.0);

var target = new THREE.Vector3(0, 0, 0);
camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
camera.position.set(-15, 20, 20);
camera.lookAt(target);
cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.target = target;
cameraControls.center = target;


var gui = new dat.GUI({
    height : 5 *32 - 1
});

}

function animate() {
window.requestAnimationFrame(animate);
render();
}

function render() {
var delta = clock.getDelta();
cameraControls.update(delta);
renderer.render(scene, camera);
}

function addToDOM() {
var container = document.getElementById('container');
var canvas = container.getElementsByTagName('canvas');
if (canvas.length>0) {
    container.removeChild(canvas[0]);
}
container.appendChild( renderer.domElement );
}

try {
init();
initGui();
createScene();
addToDOM();
render();
animate();
} catch(e) {
var errorMsg = "Error: " + e;
document.getElementById("msg").innerHTML = errorMsg;
}



function Controls() {
    this.majorRadius = 100;
    this.minorRadius = 10;
    this.radialSegments = 24;
    this.tubularSegments = 24;
    this.arc = 2 * Math.PI;
    this.wireframe = false;
    this.Go = function() { updateObject(); }
}


function updateObject() {    
    if (currentMesh)
        scene.remove(currentMesh);
    var majorRad = controls.majorRadius;
    // ... more goes here

    
    currentMesh = new THREE.Mesh(geom, currentMat);
    scene.add(currentMesh);
}

function initGui() {
    gui = new dat.GUI();
    controls = new Controls();
    gui.add(controls, 'majorRadius', 5, 200).step(1);


    // ... more goes here
    gui.add(controls, 'Go');
}
