
var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();
var camera2;
var squares;
var projector = new THREE.Projector();
var theSelectedSquare = null;
var theObjects = [];

var theObjects2 = [];
var canvasWidth, canvasHeight;

var m = 60, n = 60;
var offset = 2.4;
var waveRate = 9.0;
var curWave = null;
var waveLimit = 10;

var plainColor = null;
var nbrColors = 201;
var colors;
var raycaster = new THREE.Raycaster();
var raycaster2 = new THREE.Raycaster();

function squareGeom() {
    var geom = new THREE.Geometry();
    var vertices = [new THREE.Vector3(1, 1, 0), new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(-1, -1, 0), new THREE.Vector3(-1, 1, 0)];
    for (var i = 0; i < vertices.length; i++)
        geom.vertices.push(vertices[i]);
    var faces = [[0, 1, 3], [3, 1, 2]];
    var normal = new THREE.Vector3(0, 0, 1);
    for (var i = 0; i < faces.length; i++)
        geom.faces.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2], normal));
    return geom;
}

function createMatrixOfSquares(m, n, offset) {
    // fit into 10x10 square
    var root = new THREE.Object3D();
    root.scale.x = 10 / m*offset;
    root.scale.y = 10 / n*offset;

    // array of square meshes
    squares = new Array(m);
    for (var i = 0; i < m; i++) {
        squares[i] = new Array(n);
    }

    offset = offset !== undefined ? offset : 2.0;
    var geom = squareGeom();
    var xMin = -offset * ((m-1) / 2.0);
    var yMin = -offset * ((n-1) / 2.0);
    var mn = m * n;
    for (var i = 0, x = xMin; i < m; i++, x += offset) {
        for (var j = 0, y = yMin; j < n; j++, y += offset) {
            var mat = new THREE.MeshBasicMaterial({color: plainColor, shading: THREE.FlatShading, side: THREE.DoubleSide});
            var square = new THREE.Mesh(geom, mat);
            square.position.x = x;
            square.position.y = y;
            square.i = i;
            square.j = j;
            root.add(square);
            theObjects.push(square);
			theObjects2.push(square);
            squares[i][j] = square;
        }
    }
    scene.add(root);
	root.rotation.x = 0.1;
}

var maxHeight = 1.5;
var minHeight = -1.5;
var heightRange = maxHeight - minHeight;

function heightFunction(delta, dist) {
        return maxHeight * Math.cos(0.5*delta);
}

function colorFunction(ht, delta, dist) {
    var colorIndex = Math.floor(((ht - minHeight) / heightRange) * nbrColors);
    return colors[colorIndex];
} 


function updateSquares() {
    var changed = true;
    for (var i = 0, j = theObjects.length; i < theObjects.length; i++,j--) {
        var obj = theObjects[i];
		var obj2 = theObjects2[i];
        dist = distance(theSelectedSquare, obj);
        delta = curWave - dist;
        if (delta > waveLimit) {
            obj.position.z = 0;
			obj2.position.z=0;
            obj.material.color = plainColor;obj2.material.color = plainColor;
        } else if (delta > 0) {
            var ht = heightFunction(delta, dist);
            obj.position.z = ht*i;
			
			obj2.position.z = ht;
			
            obj.material.color = colorFunction(ht, delta, dist);
            changed = true;
        }
    }
	
	/**
    if (!changed) {
        curWave = null;
        theSelectedSquare.material.color = plainColor;
        theSelectedSquare = null;
        initializeColors();
    }**/
	
}

function updateSquares2() {
    var changed = true;
    for (var i = 0, j = theObjects.length; i < theObjects.length; i++,j--) {
        var obj = theObjects[i];
		var obj2 = theObjects2[i];
        dist = distance(theSelectedSquare, obj);
        delta = curWave - dist;
        if (delta > waveLimit) {
            obj.position.z = 5;
			obj2.position.z=5;
            obj.material.color = plainColor;obj2.material.color = plainColor;
        } else if (delta > 0) {
            var ht = heightFunction(delta, dist);
            //obj.position.y = ht*i;
			
			obj2.position.z = ht;
			
            obj2.material.color = colorFunction(ht, delta, dist);
            changed = true;
        }
    }
	
	/**
    if (!changed) {
        curWave = null;
        theSelectedSquare.material.color = plainColor;
        theSelectedSquare = null;
        initializeColors();
    }**/
	
}

function distance(sq1, sq2) {
    dx = sq1.i - sq2.i;
    dy = sq1.j - sq2.j;
    return Math.sqrt(dx*dx + dy*dy);
}


function createScene() {
    initializeColors();
	initializeColors2();
    var matrixOfSquares = createMatrixOfSquares(m, n, offset);
    scene.add(matrixOfSquares);
	
	var matrix = createMatrixOfSquares(m, n, offset);
    scene.add(matrix);
}

function initializeColors() {
    if (nbrColors % 2 == 0) {
        nbrColors++;
    }
    colors = new Array(nbrColors);    
    nbrColors2 = (nbrColors - 1) / 2;
    var hues = [Math.random(), Math.random()];
    for (var j = 0; j < nbrColors2; j++) {
        var sat = 1 - j/nbrColors2;
        colors[j] = new THREE.Color().setHSL(hues[0], sat, 0.5);
        colors[nbrColors-j-1] = new THREE.Color().setHSL(hues[3], sat, 0.5);
    }
    plainColor = colors[nbrColors2] = new THREE.Color().setHSL(0, 0.5, 0.7);
}

function initializeColors2() {
    if (nbrColors % 2 == 0) {
        nbrColors++;
    }
    colors = new Array(nbrColors);    
    nbrColors2 = (nbrColors - 1) / 2;
    var hues = [Math.random(), Math.random()];
    for (var j = nbrColors2; j >0; j--) {
        var sat = 1 - j/nbrColors2;
        colors[j] = new THREE.Color().setHSL(hues[0], sat, 0.5);
        colors[nbrColors-j-1] = new THREE.Color().setHSL(hues[3], sat, 0.5);
    }
    plainColor = colors[nbrColors2] = new THREE.Color().setHSL(0, 0.2, 0.5);
}
var x = 3;


function onDocumentMouseDown(event) {
   // var mouse = new THREE.Vector2(
    //    2*(event.clientX/window.innerWidth)-1,
      //  1-2*(event.clientY/window.innerHeight));
		var mouse2 = new THREE.Vector2(0.55,0.55);
		var mouse = new THREE.Vector2(0.32,0.55);
		//document.write(window.innerWidth);
		//document.write(window.innerHeight);
    //raycaster.setFromCamera(mouse, camera);

	
	for(var i = 0 ; i<2;i++){
		raycaster.setFromCamera(mouse2,camera);
		
		raycaster.setFromCamera(mouse,camera);
		
    var intersects = raycaster.intersectObjects(theObjects,);//array
    if ((!theSelectedSquare) && (intersects.length > 0)) {
        // select the closest intersected object
		for(var i = 0 ; i<3;i++){
        theSelectedSquare = intersects[i].object;
        theSelectedSquare.material.color.setHex( Math.random() * 0xffffff );
        curWave = 0;
		}
    }
	
	raycaster2.setFromCamera(mouse,camera2);
		
	
	var intersects2 = raycaster2.intersectObjects(theObjects2);
    if ((!theSelectedSquare) && (intersects.length > 0)) {
        // select the closest intersected object
        theSelectedSquare = intersects[i].object;
        theSelectedSquare.material.color.setHex( Math.random() * 0xffffff );
        curWave = 0;
	
	}

	
		//document.write(window.innerWidth);
		//document.write(window.innerHeight);
    //raycaster.setFromCamera(mouse, camera);
	
	//printMousePos(event);
}
}

document.addEventListener('mousedown', onDocumentMouseDown, false);

function printMousePos(event) {
  document.body.textContent =
    "clientX: " + event.clientX +
    " - clientY: " + event.clientY;
}

function animate() {
    window.requestAnimationFrame(animate);
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousedown', onDocumentMouseDown, false);
    render();
}


function render() {
    var delta = clock.getDelta();
    if (theSelectedSquare) {
        curWave += (waveRate * delta);
        updateSquares();
		delta += 0.1;
		
		updateSquares2();
    }

    cameraControls.update(delta);
    renderer.render(scene, camera);
	renderer.render(scene,camera2);
}


function init() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, -40, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	 
	 camera2 = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera2.position.set(0, -40, 30);
    camera2.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new THREE.OrbitControls(camera2, renderer.domElement);
}


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}


// try {
    init();
    createScene();
    addToDOM();
    render();
    animate();
	again();
/**
} catch(e) {
    var errorMsg = "Error: " + e;
    document.getElementById("msg").innerHTML = errorMsg;
}
**/

