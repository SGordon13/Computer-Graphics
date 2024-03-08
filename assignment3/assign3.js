// Scott Gordon
// COMP 5460
// Assignment Three
// assign3.js

// shape definitions to draw on the canvas

first = true;
lCenter = [0, 0];
mLine = [
	[-50, 0],
	[50, 0]];

rCenter = [0, 0];
mRectangle = [
	[-50, -50],
	[-50, 50],
	[50, 50],
	[50, -50]];
	
// These values make the roation on the center
// of the equilateral triangle
tCenter = [0, 0];	
mTriangle = [ 
	[-60, 32],
	[60, 32],
	[0, -68]];

lCenter = [0, 0];	
mPolygon = [
	[-50, -50],
	[-50, 50],
	[0, 5],
	[50, 50],
	[50, -50],
	[0, -5]];

cCenter = [0, 0];
mCircleRadius = 50;

var currentShape = "line";
var currentFunction = "translate";
var mouseDown = false;
var clickX = 0;
var clickY = 0;
var currentX = 0;
var currentY = 0;
var releaseX = 0;
var releaseY = 0;

var dx = 0;

var can = document.getElementById("can");
var ctx = can.getContext("2d");
var cRect = can.getBoundingClientRect();
 
window.onload = function() {
	currentShape = "line";
	currentFunction = "translate";
	
	// draw the shapes to start
	drawShapes();
}

// change the current shape when one is selected with drop down menu
var mySelect = document.getElementById('shapes');
mySelect.onchange = function() {
   var x = document.getElementById("shapes").value;
   currentShape = x;
   //console.log("currentShape: " + currentShape);
}

// change the current functin on radio button change
var radios = document.forms["functions"].elements["function"];
for(var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
		currentFunction = this.value;
		//console.log("currentFunction: " + currentFunction);
    }
}

can.onmousedown = function(mDown) {
	mouseDown = true;
	clickX = Math.round(mDown.clientX - cRect.left);
	clickY = Math.round(mDown.clientY - cRect.top);
	//console.log("down on canvas at: " + clickX + ", " + clickY);
}
can.onmouseup = function(mUp) {
	mouseDown = false;
	releaseX = Math.round(mUp.clientX - cRect.left);
	releaseY = Math.round(mUp.clientY - cRect.top);
	//console.log("up on canvas at: " + releaseX + ", " + releaseY);
}

can.onmousemove = function(mMove) {
	if(mouseDown){
		currentX = Math.round(mMove.clientX - cRect.left);
		currentY = Math.round(mMove.clientY - cRect.top);
		
		switch(currentShape) {
			case "line":
				switch(currentFunction){
					case "translate":
						// clear the old line
						ctx.clearRect(0, 0, 600, 600);
						
						// translate then draw
						translate(lCenter, (currentX - clickX), (currentY - clickY));
						drawLine();
						break;
					case "scale":
						// clear the old line
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mLine = scale(mLine, 1.05, 1.05);
						} else {
							mLine = scale(mLine, .95, .95);
						}
						drawLine();
						break;
					case "rotate":
						// clear the old line
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mLine = rotate(mLine, .06, .06);
						} else {
							mLine = rotate(mLine, -.06, -.06);
						}
						drawLine();
						break;
				}
				break;
			case "circle":
				switch(currentFunction){
					case "translate":
						// clear the old circle
						ctx.clearRect(0, 0, 600, 600);
						
						// translate then draw
						translate(cCenter, (currentX - clickX), (currentY - clickY));
						ctx.fill();
						break;
					case "scale":
						// erase old circle
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mCircleRadius *= 1.01;
						} else {
							mCircleRadius *= 0.99;
						}
						ctx.fill();
						break;
					case "rotate":
						// simple solution provided:
						break;
				}
				break;
			case "rectangle":
				switch(currentFunction){
					case "translate":
						// erase old rectangle
						ctx.clearRect(0, 0, 600, 600);
						
						// translate and draw
						translate(rCenter, (currentX - clickX), (currentY - clickY));
						drawRectangle();
						break;
					case "scale":
						// erase old rectangle
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mRectangle = scale(mRectangle, 1.01, 1.01);
						} else {
							mRectangle = scale(mRectangle, .99, .99);
						}
						ctx.fill();
						break;
					case "rotate":
						// clear the old rectangle
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mRectangle = rotate(mRectangle, .02, .02);
						} else {
							mRectangle = rotate(mRectangle, -.02, -.02);
						}
						drawLine();
						break;
						break;
				}
				break;
			case "triangle":
				switch(currentFunction){
					case "translate":
						// erase old triangle
						ctx.clearRect(0, 0, 600, 600);
						
						// translate and draw
						translate(tCenter, (currentX - clickX), (currentY - clickY));
						drawTriangle();
						break;
					case "scale":
						// erase old triangle
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mTriangle = scale(mTriangle, 1.01, 1.01);
						} else {
							mTriangle = scale(mTriangle, .99, .99);
						}
						ctx.fill();
						break;
					case "rotate":
						// clear the old triangle
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mTriangle = rotate(mTriangle, .02, .02);
						} else {
							mTriangle = rotate(mTriangle, -.02, -.02);
						}
						drawLine();
						break;
				}
				break;
			case "polygon":
				switch(currentFunction){
					case "translate":
						// erase old rectangle, translate, then draw 
						ctx.beginPath();
						ctx.clearRect(0, 0, 600, 600);
						translate(pCenter, (currentX - clickX), (currentY - clickY));
						ctx.fill();
						break;
					case "scale":
						// erase old polygon
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mPolygon = scale(mPolygon, 1.01, 1.01);
						} else {
							mPolygon = scale(mPolygon, .99, .99);
						}
						ctx.fill();
						break;
					case "rotate":
						// clear the old polygon
						ctx.clearRect(0, 0, 600, 600);
						
						if(currentX > clickX){
							mPolygon = rotate(mPolygon, .02, .02);
						} else {
							mPolygon = rotate(mPolygon, -.02, -.02);
						}
						drawLine();
						break;
				}
				break;
			default:
				//console.log("Oops, something went wrong...");
		}
		clickX = currentX;
		clickY = currentY;
		drawShapes();
	}
}

function drawShapes(){
	// move the shapes into starting position
	if(first){
		lCenter = [300, 300]
		cCenter = [450, 300];
		rCenter = [150, 300];
		tCenter = [300, 125];
		pCenter = [300, 450];
		first = false;
	}

	
	// outline the canvas for clarity
	ctx.strokeRect(0, 0, can.width, can.height);
	
	// draw the shapes
	drawLine()
	drawCircle()
	drawRectangle()
	drawTriangle()
	drawPolygon()
}

function drawLine(){
	// draw the line
	ctx.beginPath();
	ctx.moveTo((lCenter[0] + mLine[0][0]), (lCenter[1] + mLine[0][1]));
	ctx.lineTo((lCenter[0] + mLine[1][0]), (lCenter[1] + mLine[1][1]));
	ctx.stroke();
}
function drawCircle(){
	// draw the circle
	ctx.fillStyle="#e0453d";
	ctx.beginPath();
	ctx.arc(cCenter[0], cCenter[1], mCircleRadius, 0, 2 * Math.PI);
	ctx.fill();
}
function drawRectangle(){
	// draw the rectangle
	ctx.fillStyle="#e35faa";
	ctx.beginPath();
	ctx.moveTo(rCenter[0] + mRectangle[0][0], rCenter[1] + mRectangle[0][1]);
	ctx.lineTo(rCenter[0] + mRectangle[1][0], rCenter[1] + mRectangle[1][1]);
	ctx.lineTo(rCenter[0] + mRectangle[2][0], rCenter[1] + mRectangle[2][1]);
	ctx.lineTo(rCenter[0] + mRectangle[3][0], rCenter[1] + mRectangle[3][1]);
	ctx.closePath();
	ctx.fill();
}
function drawTriangle(){
	// draw the triangle
	ctx.fillStyle="#51d143";
	ctx.beginPath();
	ctx.moveTo(tCenter[0] + mTriangle[0][0], tCenter[1] + mTriangle[0][1]);
	ctx.lineTo(tCenter[0] + mTriangle[1][0], tCenter[1] + mTriangle[1][1]);
	ctx.lineTo(tCenter[0] + mTriangle[2][0], tCenter[1] + mTriangle[2][1]);
	ctx.closePath();
	ctx.fill();
}
function drawPolygon(){
	// draw the polygon
	ctx.fillStyle="#364e96";
	ctx.beginPath();
	ctx.moveTo(pCenter[0] + mPolygon[0][0], pCenter[1] + mPolygon[0][1]);
	ctx.lineTo(pCenter[0] + mPolygon[1][0], pCenter[1] + mPolygon[1][1]);
	ctx.lineTo(pCenter[0] + mPolygon[2][0], pCenter[1] + mPolygon[2][1]);
	ctx.lineTo(pCenter[0] + mPolygon[3][0], pCenter[1] + mPolygon[3][1]);
	ctx.lineTo(pCenter[0] + mPolygon[4][0], pCenter[1] + mPolygon[4][1]);
	ctx.lineTo(pCenter[0] + mPolygon[5][0], pCenter[1] + mPolygon[5][1]);
	ctx.closePath();
	ctx.fill();
}

// translate the given structure
function translate(temp, dx, dy){
	temp[0] += dx;
	temp[1] += dy;
}

// scale the given structure
function scale(temp, dx, dy) {
	mScale = [
		[dx, 0],
		[0, dy]];
		
	return (multiply(temp, mScale));
}

// rotate the given structure
function rotate(temp, dx, dy) {
	mRotate = [
		[Math.cos(dx), Math.sin(dx)],
		[-Math.sin(dx), Math.cos(dx)]];
		
	return (multiply(temp, mRotate));
}

// for multiplying matrices
function multiply(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

/*
// calculating the bounding box of a triangle
// for the purpose of clearing previously drawn one
function findBoundedBox(tCenter, mTriangle){
	ret = [];
	x1 = tCenter[0] + mTriangle[0][0];
	y1 = tCenter[1] + mTriangle[0][1];
	x2 = tCenter[0] + mTriangle[1][0];
	y2 = tCenter[1] + mTriangle[1][1];
	x3 = tCenter[0] + mTriangle[2][0];
	y3 = tCenter[1] + mTriangle[2][1];
	
	var xmax = x1 > x2 ? (x1 > x3 ? x1 : x3) : (x2 > x3 ? x2 : x3);
	var ymax = y1 > y2 ? (y1 > y3 ? y1 : y3) : (y2 > y3 ? y2 : y3);
	var xmin = x1 < x2 ? (x1 < x3 ? x1 : x3) : (x2 < x3 ? x2 : x3);
	var ymin = y1 < y2 ? (y1 < y3 ? y1 : y3) : (y2 < y3 ? y2 : y3);
	
	ret[0] = xmin;
	ret[1] = ymin;
	ret[2] = xmax - xmin;
	ret[3] = ymax - ymin;
	
	return ret;
}
*/