
var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

var box = null;
var curAngle = 0;	// current rotation around y axis 
var angleStep = Math.PI/2;  

// SC1. Cube with per vertex colors
function createScene() {
    // geometry
    var geometry = new THREE.Geometry(2,2,2);

// Make the simplest shape possible: a triangle.
geometry.vertices.push(
    new THREE.Vector3(-10,  10, 0),
    new THREE.Vector3(-10, -10, 0),
    new THREE.Vector3( 10, -10, 0)
);

// Note that I'm assigning the face to a variable
// I'm not just shoving it into the geometry.
var face = new THREE.Face4(0, 1, 2,3);

// Assign the colors to the vertices of the face.
face.vertexColors[0] = new THREE.Color(0xff0000); // red
face.vertexColors[1] = new THREE.Color(0x00ff00); // green
face.vertexColors[2] = new THREE.Color(0x0000ff); // blue
face.vertexColors[3]= new THREE.Color(0x0000ff);
// Now the face gets added to the geometry.
geometry.faces.push(face);

// Using this material is important.
var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}


function render() {
	var delta = clock.getDelta();
	curAngle += (angleStep * delta);
    if (curAngle >= 2*Math.PI)
        curAngle -= 2*Math.PI;
	//box.rotation.z = curAngle;

	cameraControls.update(delta);
	renderer.render(scene, camera);
}


function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x0, 1.0);

	camera = new THREE.PerspectiveCamera(40, canvasWidth/canvasHeight, 1, 1000);
	camera.position.set(0, 0, 20);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}

function showGrids() {
    Coordinates.drawAllAxes({axisLength:11, axisRadius:0.05});
} 


function addToDOM() {
    	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}



	init();
    showGrids();
	createScene();
	addToDOM();
	animate();
