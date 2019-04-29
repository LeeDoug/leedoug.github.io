
var camera, scene, renderer,vertex;
var cameraControls;
var clock = new THREE.Clock();

// SC1. Cube with per vertex colors
function createScene() {
    // geometry
    var geom = new THREE.CubeGeometry(90, 90, 90);
    // vertex colors
    vertexColors = []; var c;
    //face
    var face;
    var findex=['a','b','c','d'];
    var p;var s = 100;

    // each face in geom, assign colors to its vertices
    // look into face.vertexColors array

    for ( var i = 0; i < geom.vertices.length; i++ ){
        p = geom.vertices[ i ];
        c = new THREE.Color( 0xffffff );
        c.setHSL( Math.random(), 0.9, 0.3 );
        geom.colors[i] = c; 
    }

    for (var i = 0; i < geom.faces.length; i++) {
        var face = geom.faces[i];
        for( j = 0; j < 3; j++ ){
            vertex = face[ findex[ j ] ];
            face.vertexColors[ j ] = geom.colors[ vertex ];
        }
    }
    // create mesh and add to scene

    var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
    var mesh = new THREE.Mesh(geom, mat);
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
// set the clear color to black, for our open box scene
renderer.setClearColor(0x000000, 1.0);

// set the camera position for looking at our open box
// and point the camera at our target
var target = new THREE.Vector3(0, 0, 0);
camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
camera.position.set(200,20,100);
camera.lookAt(target);
cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.target = target;
cameraControls.center = target;
}
// end

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
showGrids();
createScene();
addToDOM();
render();
animate();
} catch(e) {
var errorMsg = "Error: " + e;
document.getElementById("msg").innerHTML = errorMsg;
}
