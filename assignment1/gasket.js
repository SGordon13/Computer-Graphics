// Scott Gordon
// COMP 5460
// Assignment One
// gasket.js
// Extra credit:
// slider found starting on line: 236
"use strict";

var gl;
var points;
var NumPoints = 5000;
var ct = 0;

// Variables that are changing
var width = 500;
var height = 500;
var speed = 250;
var x = 0;
var y = 0;

// Function for color creation
function createColor(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}
// these will be the colors to cycle through
var colors = [
	new createColor(0.0, 0.0, 0.0),
	new createColor(0.0, 0.0, 1.0),
	new createColor(0.0, 1.0, 0.0),
	new createColor(0.0, 1.0, 1.0),
	new createColor(1.0, 0.0, 0.0),
	new createColor(1.0, 0.0, 1.0),
	new createColor(0.0, 1.0, 0.0),
	new createColor(0.0, 0.0, 0.0),
	new createColor(0.0, 0.0, 1.0),
	new createColor(0.0, 1.0, 0.0),
	new createColor(0.0, 1.0, 1.0),
];

// Vertex and Fragment Shaders
// Moved in from the html file
var vertexShade = `
	attribute vec4 vPosition;
	void
	main()
	{
	gl_PointSize = 1.0;
	gl_Position = vPosition;
	}
`;
var fragmentShade = `
	precision mediump float;

	void
	main()
	{
	gl_FragColor = vec4(${colors[ct].r}, ${colors[ct].g}, ${colors[ct].b}, 1.0 );
	}
`;


window.onload = function init(){
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if ( !gl ) { alert( "WebGL isn't available" ); }
	
	// First, initialize the corners of our gasket with three points.
	var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];
	// Specify a starting point p for our iterations
	// p must lie inside any set of three vertices
	var u = add(vertices[0], vertices[1]);
	var v = add(vertices[0], vertices[2]);
	var p = scale(0.25, add(u, v));

	// And, add our initial point into our array of points
	points = [p];

	// Compute new points
	// Each new point is located midway between
	// last point and a randomly chosen vertex
	for (var i = 0; points.length < NumPoints; ++i) {
		var j = Math.floor(Math.random() * 3);
		p = add(points[i], vertices[j]);
		p = scale(0.5, p);
		points.push(p);
	}
	
	//  Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 0.0);
	
	var program = createProgram(gl, vertexShade, fragmentShade);
	gl.useProgram(program);
	
	// Load the data into the GPU
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	render();
};

function render() {
	// First, initialize the corners of our gasket with three points.
	var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];
	// Specify a starting point p for our iterations
	// p must lie inside any set of three vertices
	var u = add(vertices[0], vertices[1]);
	var v = add(vertices[0], vertices[2]);
	var p = scale(0.25, add(u, v));

	// And, add our initial point into our array of points
	points = [p];

	// Compute new points
	// Each new point is located midway between
	// last point and a randomly chosen vertex
	for (var i = 0; points.length < NumPoints; ++i) {
		var j = Math.floor(Math.random() * 3);
		p = add(points[i], vertices[j]);
		p = scale(0.5, p);
		points.push(p);
	}
	
	gl.viewport(x, y, width, height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background color
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// Shaders
	var program = createProgram(gl, vertexShade, fragmentShade);
	gl.useProgram(program);

	// Update colors for fragment shader
	fragmentShade = `
		precision mediump float;

		void
		main()
		{
			gl_FragColor = vec4(${colors[ct].r}, ${colors[ct].g}, ${colors[ct].b}, 1.0 );
		}
	`;
	
	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	gl.drawArrays(gl.POINTS, 0, points.length);
	setTimeout(() => {
		requestAnimationFrame(function () {
			if (ct > 9) {
				// Reset values back to default
				ct = 0;
				x = 0;
				y = 0;
				width = 500;
				height = 500;
				NumPoints = 5000;
			}
			render();
			// Update ct
			const countP = document.getElementById("count");
			countP.innerHTML = "Iteration: " + ct  + " | " +  "Number of Points: " + NumPoints;
			ct++;
			// Subtract values from viewport
			x += 25;
			y += 17.5;
			width -= 50;
			height -= 50;
			NumPoints -= 500;
		});
	}, speed);
}

function createProgram(gl, vsSource, fsSource) {
	const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert(gl.getProgramInfoLog(shaderProgram));
		return null;
	}
	return shaderProgram;
}

function compileShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

// Extra credit slider for animation speed
var speedSlider = document.getElementById("spdRange");
var speedOutput = document.getElementById("spdRangeId");
speedOutput.innerHTML = "Speed: " + speedSlider.value;
speedSlider.oninput = function () {
	speedOutput.innerHTML = "Speed: " + this.value;
	speed = this.value;
};