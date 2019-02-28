
var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

// HG1. Stairs
// returns geometry of a single step

function createStairs(riser, tread, width, stepnum) {

// step = riser + tread
// riser increases along +y and tread increases along -z
// step has width along x axis

var geom = new THREE.Geometry();

geom.vertices.push(new THREE.Vector3(0, 0, 0));
geom.vertices.push(new THREE.Vector3(0, 0, width));

//steps
for (var i = 0; i < stepnum; i++) {
    
    var left = geom.vertices[geom.vertices.length - 2], right = geom.vertices[geom.vertices.length - 1];

    // 4 vertices that rise and tread 
    var vertex1 = new THREE.Vector3(left.x, left.y + riser, left.z);
    
    var vertex2 = new THREE.Vector3(right.x, right.y + riser, right.z);
    
    var vertex3 = new THREE.Vector3(left.x + tread, left.y + riser, left.z);
    
    var vertex4 = new THREE.Vector3(right.x + tread, right.y + riser, right.z);
    
    
    geom.vertices.push(vertex1, vertex2, vertex3, vertex4);

    var vertex = geom.vertices.length;

    geom.faces.push(new THREE.Face3(vertex - 6, vertex - 5, vertex- 4));

    geom.faces.push(new THREE.Face3(vertex - 5, vertex - 4, vertex - 3));

    geom.faces.push(new THREE.Face3(vertex - 4, vertex - 3, vertex - 2));

    geom.faces.push(new THREE.Face3(vertex - 3, vertex - 2, vertex - 1));
}

// define your normals, or call Face3 with three arguments and then
// call geom.computeFaceNormals()
geom.computeFaceNormals();

return geom;
}

function createScene() {

var geom = createStairs(1, 2, 4, 7);

var mat = new THREE.MeshLambertMaterial({color: 0xFF0000, shading: THREE.FlatShading, side: THREE.DoubleSide});

var mesh = new THREE.Mesh(geom, mat);

var L = new THREE.PointLight(0xFFFFFF, 1, 100);

L.position.set(-20, 10, 5);

var ALight = new THREE.AmbientLight(0x222220);

scene.add(ALight);

scene.add(L);

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


