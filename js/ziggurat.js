

var camera , scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// HG1. Stairs
// returns geometry of a single step

function ziggurat(n, zheight, sf) {
    if (n == 0)
        return new THREE.Object3D();
    // construct new ziggurat
    var s1 = ziggurat(n-1, zheight, sf);
    // transform it
    s1.position.z = zheight;
    s1.scale = new THREE.Vector3(sf, sf, 1);
    // construct new base mesh under s1 of size 2x2xzheight
    // ... more here
    // place s1 and base in common group
    var s1Group = new THREE.Object3D();
    s1Group.add(s1);
    s1Group.add(base);
    return s1Group;
}

function createScene() {

var geom = ziggurat(30,.2,.9);

var mat = new THREE.MeshBasicMaterial( { color: 0xffffff } );

var mesh = new THREE.Mesh(geom, mat);

var L = new THREE.PointLight(0xFFFFFF, 1, 100);

L.position.set(-20, 10, 5);

var ALight = new THREE.AmbientLight(0x222220);
/**
scene.add(ALight);

scene.add(L);
**/

// add to the scene
scene.add(mesh);
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
createScene();
addToDOM();
render();
animate();
} catch(e) {
var errorMsg = "Error: " + e;
document.getElementById("msg").innerHTML = errorMsg;
}


