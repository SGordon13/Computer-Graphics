// Scott Gordon
// COMP 5460
// Assignment Two
// gasket.js
"use strict";

var gl;
var points;
var NumPoints = 5000;
var ct = 0;
var r = 255;
var g = 0;
var b = 0;

// Variables that are changing
var width = 500;
var height = 500;
var x = 0;
var y = 0;
var isColorSet = false;
var statusText = `Display or nimate`;

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

var myColor = new createColor(1.0, 0.0, 0.0);

// Vertex and Fragment Shaders (OpenGL Shading Language)

var vertexSource = `
	attribute vec4 vPosition;

	void
	main()
	{
	gl_PointSize = 1.0;
	gl_Position = vPosition;
	}
`;

var fragmentSource = `
	precision mediump float;

	void
	main()
	{
	gl_FragColor = vec4(${myColor.r}, ${myColor.g}, ${myColor.b}, 1.0 );
	}
`;

// WebGL Functions
window.onload = function init() {
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	// First, initialize the corners of our gasket with three points.
	var vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];

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
	gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background color

	//  Load shaders and initialize attribute buffers
	var program = initShaderProgram(gl, vertexSource, fragmentSource);
	gl.useProgram(program);

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	render();
};

function render() {
	var vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];

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

	gl.viewport(0, 0, width, height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Shaders
	var program = initShaderProgram(gl, vertexSource, fragmentSource);
	gl.useProgram(program);

	// Update colors for fragment shader
	if (isColorSet) {
		fragmentSource = `
			precision mediump float;

			void
			main()
			{
				gl_FragColor = vec4(${myColor.r}, ${myColor.g}, ${myColor.b}, 1.0 );
			}
		`;
	} else {
		fragmentSource = `
			precision mediump float;

			void
			main()
			{
			  gl_FragColor = vec4(${myColor.r}, ${myColor.g}, ${myColor.b}, 1.0 );
			}
		`;
	}

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.drawArrays(gl.POINTS, 0, points.length);
}

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

// Points Slider
var pointSlider = document.getElementById("myRange");
var pointOutput = document.getElementById("rangeValue");
pointOutput.innerHTML = `Points: ${pointSlider.value}`;

pointSlider.oninput = function () {
	pointOutput.innerHTML = `Points: ${this.value}`;
	NumPoints = this.value;
};

var rColorInput = document.getElementById("rInput");
var gColorInput = document.getElementById("gInput");
var bColorInput = document.getElementById("bInput");

// Display button on click
document.getElementById("displayButton").onclick = function displayPressed() {
	if (rColorInput.value.length != 0 &&
		gColorInput.value.length != 0 &&
		bColorInput.value.length != 0 ){
		isColorSet = true;
		myColor.r = rColorInput.value / 255.0;
		myColor.g = gColorInput.value / 255.0;
		myColor.b = bColorInput.value / 255.0;
	} else {
		isColorSet = false;
	}
	
	// change the status message
	statusText = `Displaying Canvas`;
	const StatusBox = document.getElementById("statusText");
	StatusBox.innerHTML = statusText;
	
	var vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];

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

	// Update colors for fragment shader
	if (isColorSet){
		fragmentSource = `
			precision mediump float;

			void
			main()
			{
				gl_FragColor = vec4(${myColor.r}, ${myColor.g}, ${myColor.b}, 1.0 );
			}
		`;
	} else {
		fragmentSource = `
			precision mediump float;

			void
			main()
			{
			  gl_FragColor = vec4(${myColor.r}, ${myColor.g}, ${myColor.b}, 1.0 );
			}
		`;
	}

	// Shaders
	var program = initShaderProgram(gl, vertexSource, fragmentSource);
	gl.useProgram(program);

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.drawArrays(gl.POINTS, 0, points.length);
};

document.getElementById("animateButton").onclick = function render() {
	// change the status message
	statusText = `Animating Canvas`;
	const StatusBox = document.getElementById("statusText");
	StatusBox.innerHTML = statusText;
	
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

	// Update colors for fragment shader
	if (isColorSet) {
		fragmentSource = `
			precision mediump float;

			void
			main()
			{
				gl_FragColor = vec4(${myColor.r}, ${myColor.g}, ${myColor.b}, 1.0 );
			}
		`;
	} else {
		fragmentSource = `
			precision mediump float;

			void
			main()
			{
				gl_FragColor = vec4(${colors[ct].r}, ${colors[ct].g}, ${colors[ct].b}, 1.0 );
			}
		`;
	}

	// Shaders
	var program = initShaderProgram(gl, vertexSource, fragmentSource);
	gl.useProgram(program);

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
			}
			render();
			// Update ct
			statusText = `Status: Animating... ${ct}`;
			const countP = document.getElementById("count");
			ct++;
			// Change values from viewport
			x += 25;
			y += 17.5;
			width -= 50;
			height -= 50;
		});
	}, 275);
};

document.getElementById("clearButton").onclick = function clearPressed() {
	// change the status message
	statusText = `Clearing Canvas`;
	const StatusBox = document.getElementById("statusText");
	StatusBox.innerHTML = statusText;

	location.reload();
};