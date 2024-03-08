// Scott Gordon
// COMP 5460 Computer Graphics
// Assignment Six
// robotArm.js

"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT     = 2.0;
var BASE_WIDTH      = 5.0;
var LOWER_ARM_HEIGHT= 5.0;
var LOWER_ARM_WIDTH = 0.5;
var UPPER_ARM_HEIGHT= 5.0;
var UPPER_ARM_WIDTH = 0.5;
var FINGER_HEIGHT	= 3.0;
var FINGER_WIDTH	= 0.5;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;
var FingerOne = 3;
var FingerTwo = 4;
var FingerThree = 5;


var theta1= [ 0, 0, 0, 0, 0, 0];
var theta2= [ 0, 0, 0, 0, 0, 0];
var theta3= [ 0, 0, 0, 0, 0, 0];

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	// gather all input from sliders
	
    document.getElementById("slider11").onchange = function(event) {
        theta1[0] = event.target.value;
    };
    document.getElementById("slider21").onchange = function(event) {
        theta1[1] = event.target.value;
    };
    document.getElementById("slider31").onchange = function(event) {
        theta1[2] = event.target.value;
    };
	document.getElementById("slider41").onchange = function(event) {
        theta1[3] = event.target.value;
    };
    document.getElementById("slider51").onchange = function(event) {
        theta1[4] = event.target.value;
    };
    document.getElementById("slider61").onchange = function(event) {
        theta1[5] = event.target.value;
    };
	
	
	document.getElementById("slider12").onchange = function(event) {
        theta2[0] = event.target.value;
    };
    document.getElementById("slider22").onchange = function(event) {
        theta2[1] = event.target.value;
    };
    document.getElementById("slider32").onchange = function(event) {
        theta2[2] = event.target.value;
    };
	document.getElementById("slider42").onchange = function(event) {
        theta2[3] = event.target.value;
    };
    document.getElementById("slider52").onchange = function(event) {
        theta2[4] = event.target.value;
    };
    document.getElementById("slider62").onchange = function(event) {
        theta2[5] = event.target.value;
    };
	
	
	document.getElementById("slider13").onchange = function(event) {
        theta3[0] = event.target.value;
    };
    document.getElementById("slider23").onchange = function(event) {
        theta3[1] = event.target.value;
    };
    document.getElementById("slider33").onchange = function(event) {
        theta3[2] = event.target.value;
    };
	document.getElementById("slider43").onchange = function(event) {
        theta3[3] = event.target.value;
    };
    document.getElementById("slider53").onchange = function(event) {
        theta3[4] = event.target.value;
    };
    document.getElementById("slider63").onchange = function(event) {
        theta3[5] = event.target.value;
    };

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 20, -100, 100);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}

//----------------------------------------------------------------------------


function base() {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lowerArm()
{
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function fingerOne()
{
    var s = scale4(FINGER_WIDTH, FINGER_HEIGHT, FINGER_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * FINGER_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function fingerTwo()
{
    var s = scale4(FINGER_WIDTH, FINGER_HEIGHT, FINGER_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * FINGER_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function fingerThree()
{
    var s = scale4(FINGER_WIDTH, FINGER_HEIGHT, FINGER_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * FINGER_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}


//----------------------------------------------------------------------------


var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    modelViewMatrix = rotate(1, 0, 1, 0 );
	modelViewMatrix = mult(modelViewMatrix, rotate(theta1[Base], 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta2[Base], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta3[Base], 1, 0, 0));
    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta1[LowerArm], 0, 1, 0 ));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta2[LowerArm], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta3[LowerArm], 1, 0, 0));
    lowerArm();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta1[UpperArm], 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta2[UpperArm], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta3[UpperArm], 1, 0, 0));
    upperArm();
	
	modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT, 0.0));
	modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 0, 1)); // rotate to give finger offset
    modelViewMatrix = mult(modelViewMatrix, rotate(theta1[FingerOne], 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta2[FingerOne], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta3[FingerOne], 1, 0, 0));
    fingerOne();
	// undo effects, shouldnt effect other fingers
	modelViewMatrix = mult(modelViewMatrix, rotate(-theta1[FingerOne], 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(-theta2[FingerOne], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(-theta3[FingerOne], 1, 0, 0));
	
	modelViewMatrix = mult(modelViewMatrix, rotate(-30, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta1[FingerTwo], 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta2[FingerTwo], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta3[FingerTwo], 1, 0, 0));
    fingerTwo();
	modelViewMatrix = mult(modelViewMatrix, rotate(-theta1[FingerTwo], 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(-theta2[FingerTwo], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(-theta3[FingerTwo], 1, 0, 0));
	
	modelViewMatrix = mult(modelViewMatrix, rotate(-30, 0, 0, 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta1[FingerThree], 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta2[FingerThree], 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta3[FingerThree], 1, 0, 0));
    fingerThree();

    requestAnimFrame(render);
}