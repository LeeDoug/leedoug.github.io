
   

function Controls() {
    this.majorRadius = 100;
    this.minorRadius = 10;
    this.radialSegments = 24;
    this.tubularSegments = 24;
    this.arc = 2 * Math.PI;
    this.wireframe = false;
    this.Go = function() { updateObject(); }
}


function updateObject() {    
    if (currentMesh)
        scene.remove(currentMesh);
    var majorRad = controls.majorRadius;
    // ... more goes here
    currentMesh = new THREE.Mesh(geom, currentMat);
    scene.add(currentMesh);
}

function initGui() {
    gui = new dat.GUI();
    controls = new Controls();
    gui.add(controls, 'majorRadius', 5, 200).step(1);
    // ... more goes here
    gui.add(controls, 'Go');
}

initGui();


