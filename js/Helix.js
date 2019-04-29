

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 5, 5);


var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101000);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(100);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

var Width = .5;
var Thickness = 0.1;
var Steps = 5;
var StepLength = 1.5;
var SegsPerStep = 50;
var Radius = 1;

var Geom = new THREE.BoxGeometry(Steps * Math.PI * 2, Width, Thickness, Steps * SegsPerStep, 1, 1);

Geom.computeBoundingBox();

var size = new THREE.Vector3();

Geom.boundingBox.getSize(size);

Geom.translate(size.x * 0.5, size.y * 0.5, size.z * 0.5);

Geom.vertices.forEach(v => {
  
  let angle = -v.x;
  
  let radius = Radius + v.z;
  
  let shift = (v.x / (Math.PI * 2)) * StepLength + v.y;
  
  v.x = Math.cos(angle) * radius;
  
  v.y = shift;
  
  v.z = Math.sin(angle) * radius;
}); 

Geom.computeFaceNormals();

Geom.computeVertexNormals();

Geom.center();


var ribbon = new THREE.Mesh(Geom, new THREE.MeshStandardMaterial({color: 0x0099ff}));
scene.add(ribbon);

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
