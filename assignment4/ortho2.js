// Scott Gordon
// COMP 5460 Computer Graphics
// Assignment Four
// ortho2.js
"use strict";

var canvas;
var gl;

var numVertices  = 64;

var pointsArray = [];
var colorsArray = [];
var eyePoints = [];
var totalSteps = 10;
var steps = totalSteps;
var x1;
var y1;
var z1;
var x2;
var y2;
var z2;
var speed = 500;
var runButton;

// fixing a bug the best way I could find
var tx1;
var ty1;
var tz1;

// definition of the house, given by assignment
var vertices = [
		vec4( 0,  0, 30, 1),	//lft bot frnt
		vec4(16,  0, 30, 1),	//rgt bot frnt
		vec4(16, 10, 30, 1),	//rgt top frnt
		vec4( 8, 16, 30, 1),	//mid top frnt
		vec4( 0, 10, 30, 1),	//lft top frnt
		vec4( 0,  0, 54, 1),	//lft bot back
		vec4(16,  0, 54, 1),	//rgt bot back
		vec4(16, 10, 54, 1),	//rgt top back
		vec4( 8, 16, 54, 1),	//mid top back
		vec4( 0, 10, 54, 1),	//lft top back
	];
	
var vertexColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 0.0, 1.0 ),   // black
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
		vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
		vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    ];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;

// center of the house
// y = 1 for up
const at = vec3(8.0, 8.0, 42.0);
const up = vec3(0.0, 1.0, 0.0);

// takes 4 corners of a quad and makes two triangles out of them
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

function colorCube()
{
	quad(1, 2, 4, 0); // front
	quad(3, 4, 2, 2); // frontTop
	quad(2, 1, 6, 7); // right
	quad(5, 6, 1, 0); // bottom
	quad(6, 7, 9, 5); // back
	quad(7, 8, 9, 7); // backTop
	quad(0, 4, 9, 5); // left
	quad(8, 7, 2, 3); // topRight
	quad(4, 3, 8, 9); // topLeft
}
	
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
	//runButton = document.getElementById( "runButton" );
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //render();
}
document.getElementById("runButton").onclick = function runClicked() {
//runButton.onclick = function clearPressed() {
	
	// get the values for end points of line
	x1 = document.getElementById("x1").value;
	y1 = document.getElementById("y1").value;
	z1 = document.getElementById("z1").value;
	x2 = document.getElementById("x2").value;
	y2 = document.getElementById("y2").value;
	z2 = document.getElementById("z2").value;
	
	console.log("Moving from: " + x1 + " " + y1 + " " + z1);
	console.log("Moving to: " + x2 + " " + y2 + " " + z2);
	
	// fill the array with the points along the line
	eyePoints = [];
	for(var i = 0; i < (steps + 1); i++){
		var alpha = i/steps;
		var ax = ((alpha * x2) + ((1-alpha) * x1));
		var ay = ((alpha * y2) + ((1-alpha) * y1));
		var az = ((alpha * z2) + ((1-alpha) * z1));
		
		console.log("step " + i + ": " + ax + ", " + ay + ", " + az);
		// skip over the problem coordinate, substitute last valid coord instead
		// ditched this solution, fixed the bug in render
		/*if(ax != 8 || az != 42){
			var temp = vec3(ax, ay, az);
			eyePoints.push(temp);
			var tx1 = ax;
			var ty1 = ay;
			var tz1 = az;
		} else {*/
			//var temp = vec3(tx1, ty1, tz1);
			var temp = vec3(ax, ay, az);
			eyePoints.push(temp);
		//}
	}
	
	render();
};

var render = function() {
	// as long as there are steps remaining
	if(steps >= 0){
		// make i go from 0 to steps
		var i = totalSteps - steps;
		console.log("step: " + i);
		steps--;
		setTimeout(() => {
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			// step i in the process, and each coordinate x, y, z
			// if the coord is exactly above center, move slightly to avoid problems
			// awkward solution to annoying bug
			if(eyePoints[i][0] == 8 && eyePoints[i][2] == 42){
				eyePoints[i][2] = 42.1;
			}
			eye = vec3(eyePoints[i][0], eyePoints[i][1], eyePoints[i][2]);
			
			modelViewMatrix = lookAt(eye, at , up);
			// view just happens to look proper, doesn't have to be this though
			projectionMatrix = ortho(-20, 20, -20, 20, -100, 100); 
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

			gl.drawArrays( gl.TRIANGLES, 0, numVertices );
			requestAnimFrame(render);
		}, speed);
	} else {
		// return the number of steps and empty the points array for next run
		steps = totalSteps;
		eyePoints = [];
	}
}