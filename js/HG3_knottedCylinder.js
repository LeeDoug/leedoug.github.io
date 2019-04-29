// HG.4 Knotted cylinder geometry

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

function createScene() {
var size = 10;

var heights = [0.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.1, 4.2, 4.3, 4.3];
var scales = [1.8, 1.95, 2.0, 1.95, 1.8, 1.5, 1.2, 1.05, 1.0, 1.05, 1.15, 1.25, 1.35, 1.45, 1.5];
var n = 12;
var geo = createKnottedCylinder(n, heights, scales, true);

for ( var i = 0; i < geo.faces.length; i ++ ) {
    geo.faces[ i ].color.setHSL( Math.random(), 0.5, 0.5 ); // pick your colors
}
// red lambert material, which is affected by lights
//var mat = new THREE.MeshLambertMaterial({color: "blue", shading: THREE.FlatShading, side: THREE.DoubleSide});
var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } ); 
// create our mesh
var mesh = new THREE.Mesh(geo, material);


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


init();
showGrids();
createScene();
addToDOM();
render();
animate();

function createKnottedCylinder(n, heights, scales, isCappedBottom, isCappedTop) {
    // heights[i] is the y-value of the i'th knot
    // scales[i] is the scale factor of the i'th knot
    // heights.length == height.scales is the number of knots
    // note that nbrSegments == heights.length - 1
    // 
    // Implementation of the knotted cylinder is similar to
    // that of the segmented cylinder except that
    // the i'th regular n-sided polygon (n-gon) lies
    // in the y = heights[i] plane and that it is scaled
    // by scales[i]. So the code that generates the vertices
    // at the start of HG2_segmentedCylinder.js must take this
    // into account.
    if (isCappedBottom === undefined) isCappedBottom = false;
    if (isCappedTop === undefined) isCappedTop = false;
    
    var geom = new THREE.Geometry();

    var nbrSegments = heights.length-1;

    var inc = 2 * Math.PI / n;

    for (var s = 0; s <= nbrSegments; s++) {

        var ht = heights[s];
        var scale = scales[s];

        for (var i = 0, a = 0; i <= n; i++, a += inc) {
            var cos = Math.cos(a);
            var sin = Math.sin(a);
            var v = new THREE.Vector3(scale*cos, ht,scale*sin );
            geom.vertices.push(v);

            
        }
    }
    // the rest of the code is like that of HG2_segmentedCylinder.js
    // ...
    // push 2*n side faces for each segment
    for (var s = 0, b = 0; s < nbrSegments; s++,b+= n+1) {
        for (var i = b; i < b+n ; i+=2) {
            geom.faces.push(new THREE.Face3(i,i+1,i+2));
          geom.faces.push(new THREE.Face3(s, s+1,s+2));
          // geom.faces.push(new THREE.Face3(i+s, i+1+s, i+2+s));
        }
      

    }
    if (isCappedBottom) {
        //   fan of triangles based at vertex 0
        for (var i = 1; i < n; i++) {
           // geom.faces.push(new THREE.Face3(i, i+1, i+2));
        }
    }

    if (isCappedBottom) {
        //   fan of triangles based at vertex 0
        for (var i = 1; i < n; i++) {
          //  geom.faces.push(new THREE.Face3(i, i+1, i+2));
        }
    }
    

    geom.computeFaceNormals();
    return geom;
}
