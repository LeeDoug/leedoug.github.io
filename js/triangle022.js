/***********
 * triangle022.js
 * Two triangles with orbit control and light
 * M. Laszlo
 * February 2018
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createScene() {
    // triangle geometry
    var geom = new THREE.Geometry();
    geom.vertices.push(new THREE.Vector3(0, 0, 0.1));
    geom.vertices.push(new THREE.Vector3(4, 0, 0.1));
    geom.vertices.push(new THREE.Vector3(0, 6, 0.1));
    geom.vertices.push(new THREE.Vector3(-4, 0, 4));
    var normal1 = new THREE.Vector3(0, 0, 1);
    var normal2 = new THREE.Vector3(0.7071, 0, 0.7071);
    var face1 = new THREE.Face3(0, 1, 2, normal1);
    geom.faces.push(face1);
    var face2 = new THREE.Face3(0, 2, 3, normal2);
    geom.faces.push(face2);
    // material
    var mat = new THREE.MeshLambertMaterial( {color: 0xFF0000, shading: THREE.FlatShading, side: THREE.DoubleSide })
    //  mesh
    var mesh = new THREE.Mesh(geom, mat);

    // light
    //   args: color, intensity, range (0 if limitless)
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
	// var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(-10, 0, 20);
    var ambientLight = new THREE.AmbientLight(0x222222);

    scene.add(light);
    scene.add(ambientLight);
    scene.add(mesh);
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


function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);

	camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 40);
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
render();
animate();

