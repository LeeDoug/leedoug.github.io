function createScene(nbrBoxes, minSide, maxSide, minHeight, maxHeight) {
    var floorSide = 200;
    var floorGeom = new THREE.PlaneGeometry(floorSide, floorSide);
    var floorMat = new THREE.MeshBasicMaterial({color: 0x666666, side: THREE.DoubleSide});
    var floor = new THREE.Mesh(floorGeom, floorMat);
	
   scene.add(floor);
    for (var i = 0; i < nbrBoxes; i++) {
        xlen = getRandomInt(minSide, maxSide);
        ylen = getRandomInt(minSide, maxSide);
        zlen = getRandomInt(minHeight, maxHeight);
        var boxGeom = new THREE.BoxGeometry(xlen, ylen, zlen);
        var boxMat = new THREE.MeshBasicMaterial({color:Math.random() * 0xff00000 - 0xff00000 ,transparent: false, opacity: 0.8});
			
			var box = new THREE.Mesh(boxGeom,boxMat);
			box.position.x = getRandomInt(-80,80);
            box.position.y = getRandomInt(-80,80);
        // ...
        scene.add(box);
	}
	var light = new THREE.AmbientLight( 0xffffff,0.5 ); 
	scene.add( light );
   
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

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

var target = new THREE.Vector3(-1, 1, 1);
camera = new THREE.PerspectiveCamera(1000, canvasRatio, 0.1, 1000);
camera.position.set(2, 230, 255);
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

function showGrids() {
    Coordinates.drawAllAxes({axisLength:11, axisRadius:0.05});
} 

try {
init();
createScene(100,5,20,5,60);
addToDOM();
render();
animate();
} catch(e) {
var errorMsg = "Error: " + e;
document.getElementById("msg").innerHTML = errorMsg;
}




