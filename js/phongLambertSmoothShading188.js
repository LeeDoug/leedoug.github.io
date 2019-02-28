/***********
 * phongLambertSmoothShading188.js
 * M. Laszlo
 * February 2018
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();
var sun;
var matPhong, matLambert, mesh, geom;
var face1, face2;
var normalLines;
var lineMat = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 20});
var corners = [
    new THREE.Vector3(-10, -10, 0),
    new THREE.Vector3(10, -10, 0),
    new THREE.Vector3(10, 10, 0),
    new THREE.Vector3(-10, 10, 0)
    ];

function createScene() {
    matPhong = new THREE.MeshPhongMaterial({color: 0x0000FF});
    matPhong.shininess = 20; 
    matLambert = new THREE.MeshLambertMaterial({color: 0x0000FF});
    geom = makeSquareGeom();
    mesh = new THREE.Mesh(geom, matPhong);
    updateNormals();

    // light
    var sunMat = new THREE.MeshBasicMaterial({color: 'yellow'});
    var sunGeom = new THREE.SphereGeometry(0.5, 12, 12);
    sun = new THREE.Mesh(sunGeom, sunMat);
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light.position.set(0, 0, 0);
    sun.add(light);
    sun.translateZ(10);
    var ambientLight = new THREE.AmbientLight(0x222222);

    scene.add(sun);
    scene.add(ambientLight);
    scene.add(mesh);
}

function makeSquareGeom() {
    var geom = new THREE.Geometry();
    geom.vertices.push(corners[0]);
    geom.vertices.push(corners[1]);
    geom.vertices.push(corners[2]);
    geom.vertices.push(corners[3]);
    face1 = new THREE.Face3(0, 1, 2);
    face2 = new THREE.Face3(0, 2, 3);
    geom.faces.push(face1);
    geom.faces.push(face2);
    return geom;
}


function updateNormals() {
    var rad = controls.normalAngle * (Math.PI / 180);
    var xy = (Math.sqrt(2)/2.0) * Math.sin(rad);
    var z = Math.cos(rad);
    var normals = [];
    normals.push(new THREE.Vector3(-xy, -xy, z).normalize());
    normals.push(new THREE.Vector3(xy, -xy, z).normalize());
    normals.push(new THREE.Vector3(xy, xy, z).normalize());
    normals.push(new THREE.Vector3(-xy, xy, z).normalize());
    face1.vertexNormals.length = 0;
    face1.vertexNormals.push(normals[0]);
    face1.vertexNormals.push(normals[1]);
    face1.vertexNormals.push(normals[2]);
    face2.vertexNormals.length = 0;
    face2.vertexNormals.push(normals[0]);
    face2.vertexNormals.push(normals[2]);
    face2.vertexNormals.push(normals[3]);
    geom.normalsNeedUpdate = true;
    addNormalsToScene(normals);
}

function updateShading(shadingType) {
    switch (shadingType) {
        case 'Lambert':        
            mesh.material = matLambert; 
            break;
        case 'Phong':            
            matPhong.shininess = controls.shininess;
            mesh.material = matPhong;
            break;
    }
    geom.normalsNeedUpdate = true;
}

function updateShininess() {
    matPhong.shininess = controls.shininess;
}

function addNormalsToScene(normals) {
    if (normalLines)
        scene.remove(normalLines);
    var scale = 5.0;
    var geom = new THREE.Geometry();
    for (var i = 0; i < 4; i++) {
        geom.vertices.push(corners[i]);
        var n = new THREE.Vector3().copy(normals[i]);
        geom.vertices.push(n.multiplyScalar(scale).add(corners[i]));
    }
    normalLines = new THREE.Line(geom, lineMat, THREE.LinePieces);
    scene.add(normalLines);
}

var controls = new function() {
    this.transx = 0.0;
    this.transy = 0.0;
    this.transz = 10.0;
    this.normalAngle = 0;
    this.shading = 'Phong';
    this.shininess = 20;
}


function animate() {
	window.requestAnimationFrame(animate);
	render();
}


function render() {
    var delta = clock.getDelta();
    sun.position.x = controls.transx;
    sun.position.y = controls.transy;
    sun.position.z = controls.transz;
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

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 40);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    var gui = new dat.GUI();
    gui.add(controls, 'transx', -20.0, 20.0).step(0.5);
    gui.add(controls, 'transy', -20.0, 20.0).step(0.5);
    gui.add(controls, 'transz', 0.0, 20.0).step(0.5);
    var normalAngleControl = gui.add(controls, 'normalAngle', -90, 90).step(1);
    normalAngleControl.onChange(updateNormals);    
    var shadingTypes =  ['Lambert', 'Phong'];
    var shadetype = gui.add(controls, 'shading', shadingTypes);
    shadetype.onChange(updateShading);
    var shininessControl = gui.add(controls, 'shininess', 0, 200).step(1);
    shininessControl.onChange(updateShininess);
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
createScene();
addToDOM();
render();
animate();
