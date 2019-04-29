// HG.2 Cylinder geometry



var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createScene() {
var size = 10;
var geom = createCylinder(12,6,2);

// red lambert material, which is affected by lights
var mat = new THREE.MeshLambertMaterial({color: "blue", shading: THREE.FlatShading, side: THREE.DoubleSide});

// create our mesh
var mesh = new THREE.Mesh(geom, mat);

// lights
var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 15, 10);
var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(light);
scene.add(ambientLight);

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
// set the clear color to black, for our open box scene
renderer.setClearColor(0x000000, 1.0);

// set the camera position for looking at our open box
// and point the camera at our target
var target = new THREE.Vector3(0, 0, 0);
camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
camera.position.set(-5, 20, 5);
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


function createSegmentedCylinder(n, nbrSegments, segmentLen, rad, isCappedBottom, isCappedTop) {
    if (isCappedBottom === undefined) isCappedBottom = false;
    if (isCappedTop === undefined) isCappedTop = false;
    
    var geom = new THREE.Geometry();
    // push 2*n + 1 vertices per segment boundary
   
    var inc = 2 * Math.PI / n;
    
    for (var s = 0, ht = 0; s <= nbrSegments; s++, ht += segmentLen) {
        for (var i = 0, a = 0; i <= n; i++, a += inc) {
            var cos = Math.cos(a);
            var sin = Math.sin(a);
            var v = new THREE.Vector3(rad * cos, ht, rad * sin);
            geom.vertices.push(v);
        }
    }
    // push 2*n side faces for each segment
    for (var s = 0, b = 0; s < nbrSegments; s++, b += n + 1) {
        for (var i = b; i < b + n; i++) {
            geom.faces.push(new THREE.Face3(i, b, s));
            geom.faces.push(new THREE.Face3(b, i, s));
        }
    }
    if (isCappedBottom) {
        //   fan of triangles based at vertex 0
        for (var i = 1; i < n; i++) {
            geom.faces.push(new THREE.Face3(i, 5, 7));
        }
    }
    
    /** 
    if (isCappedTop) {
        // ...
    }
**/


    geom.computeFaceNormals();
    return geom;
}

function createCylinder(n, len, rad, isCappedBottom, isCappedTop) {
    if (isCappedBottom === undefined) isCappedBottom = false;
    if (isCappedTop === undefined) isCappedTop = false;
    var len2 = len / 2;
    var geom = new THREE.Geometry();
    // push 2*n + 2 vertices
    var inc = 2 * Math.PI / n;
    for (var i = 0, a = 0; i <= n; i++, a += inc) {
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        bottomVertex = new THREE.Vector3(rad * cos, -len2, rad * sin);
        topVertex = new THREE.Vector3(rad * cos, len2, rad * sin);
        geom.vertices.push(bottomVertex, topVertex);
    }
    // push 2*n side faces (each of the n rectangular side faces
    // is constructed from 2 triangles)
    for (var i = 0; i < 2*n; i += 2) {
        geom.faces.push(new THREE.Face3(i,i+1,i+2));
        geom.faces.push(new THREE.Face3(i+1,i+2,i+3));
       // geom.faces.push(new THREE.Face3(i+1,i+1,i+2));
    }
    // push n-2 bottom faces
    //   fan of triangles based at vertex 0
    if (isCappedBottom) {
        for (var i = 2; i < 2*n; i += 2) {
            geom.faces.push(new THREE.Face3(i, i+1, i+2));
        }
    }
    // push n-2 top faces
    //   fan of triangles based at vertex 1
    if (isCappedTop) {
        for (var i = 2; i < 2*n; i += 2) {
            geom.faces.push(new THREE.Face3(i, i+1, i+2));
        }
    }
    geom.computeFaceNormals();
    return geom;
}

