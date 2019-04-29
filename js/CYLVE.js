var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createCylinder(n, len, rad, isCappedBottom, isCappedTop) {
// re-use the built-in CylinderGeometry
var geom = new THREE.CylinderGeometry(rad, rad, len, n, n, false);
// remove the top faces if it's not capped top
if (!isCappedTop) {
    geom.faces.splice(geom.faces.length - 2 * n, n);
}
// remove the bottom faces if it's not capped bottom
if (!isCappedBottom) {
    geom.faces.splice(geom.faces.length - n, n);
}
return geom;
}

function createScene() {
var size = 10;
var geom = createCylinder(55, 6, 2);
var geom2 = createCylinder(55,6,2.5);
var geom3 = createCylinder(55,6,3);

var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0x180eaa} );
var cylinder = new THREE.Mesh( geometry, material );
scene.add( cylinder );


var geometry2 = new THREE.CylinderGeometry( 3, 3, 25, 32 );
var material2 = new THREE.MeshBasicMaterial( {color: 0x7d2841} );
var cylinder2 = new THREE.Mesh( geometry2, material2 );
scene.add( cylinder2 );


var geometry3 = new THREE.CylinderGeometry( 2, 2, 30, 32,1,false,0,4.3);
var material3 = new THREE.MeshBasicMaterial( {color: 0xcf6483} );
var cylinder3 = new THREE.Mesh( geometry3, material3 );
scene.add( cylinder3 );



var geometry4 = new THREE.CylinderGeometry( 1.5, 1.5, 35, 32 );
var material4 = new THREE.MeshBasicMaterial( {color: 'red'} );
var cylinder4 = new THREE.Mesh( geometry4, material4 );
scene.add( cylinder4 );


var geometry5 = new THREE.CylinderGeometry( 1, 1, 35, 32 );
var material5 = new THREE.MeshBasicMaterial( {color: 'red'} );
var cylinder5 = new THREE.Mesh( geometry5, material5 );
scene.add( cylinder5 );



// red lambert material, which is affected by lights
var mat = new THREE.MeshLambertMaterial({color: "red", shading: THREE.FlatShading, side: THREE.DoubleSide});
var mat2 = new THREE.MeshLambertMaterial({color:0x7d2841,shading: THREE.Flatshading, side: THREE.DoubleSide});
var mat3 = new THREE.MeshLambertMaterial({color:0xb61645,shading: THREE.Flatshading, side: THREE.DoubleSide});
// create our mesh
var mesh = new THREE.Mesh(geom, mat);
var mesh2 = new THREE.Mesh(geom2,mat2);
var mesh3 = new THREE.Mesh(geom3,mat3);

// lights
var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 15, 10);
var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(light);
scene.add(ambientLight);

// add to the scene
scene.add(mesh);scene.add(mesh2);scene.add(mesh3);

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
var target = new THREE.Vector3(5, 0, 0);
camera = new THREE.PerspectiveCamera(1000, canvasRatio*2, 1, 1000);
camera.position.set(35, 5, 5);
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