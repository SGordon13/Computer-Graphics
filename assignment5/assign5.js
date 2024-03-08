// Scott Gordon
// COMP 5460 Computer Graphics
// Assignment Five
// assign5.js

// Extra credit done:
// 1. allow user to input points using mouse clicks rather than text box
// 2. rubberbanding on the appropriate algorithms

var n = 1000;

var x1;
var y1;
var x2;
var y2;

var pointCount = 0;
var pointArray = [];

var mouseDown = false;
var currentFunction = "ddaLine";

var can = document.getElementById("can");
var ctx = can.getContext("2d");
var cRect = can.getBoundingClientRect();
 
window.onload = function() {
	// outline the canvas for clarity
	readyCanvas();
	currentFunction = "ddaLine";
}

// change the current functin on radio button change
var radios = document.forms["functions"].elements["function"];
for(var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
		pointCount = 0;
		pointArray = [];
		currentFunction = this.value;
    }
}

can.onmousedown = function(mDown) {
	mouseDown = true;
	x1 = Math.round(mDown.clientX - cRect.left);
	y1 = Math.round(mDown.clientY - cRect.top);
	
	switch(currentFunction){
		case "bezierCurve":
			if(pointCount < 4){
				pointArray.push([x1, y1]);
				pointCount++;
			}
			if(pointCount == 4){
				readyCanvas();
				myBezierCurve(pointArray[0], pointArray[1], pointArray[2], pointArray[3]);
				// marking the clicked points
				// ctx.fillRect(pointArray[0][0], pointArray[0][1], 2, 2);
				// ctx.fillRect(pointArray[1][0], pointArray[1][1], 2, 2);
				// ctx.fillRect(pointArray[2][0], pointArray[2][1], 2, 2);
				// ctx.fillRect(pointArray[3][0], pointArray[3][1], 2, 2);
				pointCount = 0;
				pointArray = [];
			}
			break;
		case "hermiteCurve":
			if(pointCount < 4){
				pointArray.push([x1, y1]);
				pointCount++;
			}
			if(pointCount == 4){
				readyCanvas();
				myHermiteCurve(pointArray[0], pointArray[1], pointArray[2], pointArray[3]);
				// test call with example
				// myHermiteCurve([10, 20], [100, 40], [30, 30], [20, 70]);
				
				// marking the clicked points
				// ctx.fillRect(10, 20, 5, 5);
				// ctx.fillRect(100, 40, 5, 5);
				// ctx.fillRect(30, 30, 5, 5);
				// ctx.fillRect(20, 70, 5, 5);
				
				pointCount = 0;
				pointArray = [];
			}
			break;
		case "bSplineCurve":
			if(pointCount < 4){
				pointArray.push([x1, y1]);
				pointCount++;
			}
			if(pointCount == 4){
				readyCanvas();
				myBSplineCurve(pointArray[0], pointArray[1], pointArray[2], pointArray[3]);
				// marking the clicked points
				// ctx.fillRect(pointArray[0][0], pointArray[0][1], 2, 2);
				// ctx.fillRect(pointArray[1][0], pointArray[1][1], 2, 2);
				// ctx.fillRect(pointArray[2][0], pointArray[2][1], 2, 2);
				// ctx.fillRect(pointArray[3][0], pointArray[3][1], 2, 2);
				pointCount = 0;
				pointArray = [];
			}
			break;
	}
}
can.onmouseup = function(mUp) {
	mouseDown = false;
}

can.onmousemove = function(mMove) {
	x2 = Math.round(mMove.clientX - cRect.left);
	y2 = Math.round(mMove.clientY - cRect.top);
	
	if(mouseDown){
		switch(currentFunction){
			case "ddaLine":
				readyCanvas();
				myDDALine(x1, y1, x2, y2);
				break;
			case "midpointLine":
				readyCanvas();
				myMidpointLine(x1, y1, x2, y2);
				break;
			case "midpointCircle":
				readyCanvas();
				myMidpointCircle(x1, y1, x2, y2);
				break;
			case "midpointEllipse":
				readyCanvas();
				myMidpointEllipse(x1, y1, x2, y2);
				break;
		}
	}
}

function readyCanvas(){
	ctx.clearRect(0, 0, can.width, can.height);
	ctx.strokeRect(0, 0, can.width, can.height);
}

function myDDALine(x1t, y1t, x2t, y2t){
	
	// primitive call
	// ctx.beginPath();
	// ctx.moveTo(x1t, y1t);
	// ctx.lineTo(x2t, y2t);
	// ctx.stroke();
	// line does not fade when close to vertical
	
	// swap if in Q2 or Q3
	if(x1t > x2t){
		var xTemp = x1t;
		var yTemp = y1t;
		x1t = x2t;
		x2t = xTemp;
		y1t = y2t;
		y2t = yTemp;
	}
	var dx = x2t - x1t;
	var dy = y2t - y1t;
	var m = dy / dx;
	var y = y1t;
	for(var x = x1t; x < x2t; x++){
		ctx.fillRect(x, y, 1, 1);
		y = y + m;
	}
}

function myMidpointLine(x1t, y1t, x2t, y2t){
	
	// primitive call
	// ctx.beginPath();
	// ctx.moveTo(x1t, y1t);
	// ctx.lineTo(x2t, y2t);
	// ctx.stroke();
	// same result
	
	// declare all useful variables up front
	var x,y,dx,dy,dx1,dy1,px,py,xe,ye,i;
	
	dx = x2t-x1t;
	dy = y2t-y1t;
	dx1 = Math.abs(dx);
	dy1 = Math.abs(dy);
	px = 2 * dy1 - dx1;
	py = 2 * dx1 - dy1;
	
	// if change in y is less than change in x
	if(dy1<=dx1){
		// if the change in x is positive
		if(dx>=0){
			x=x1t;
			y=y1t;
			xe=x2t;
		}
		// negative change in x
		else{
			x=x2t;
			y=y2t;
			xe=x1t;
		}
		ctx.fillRect(x, y, 1, 1);
		for(i=0;x<xe;i++){
			x=x+1;
			if(px<0){
			px=px+2*dy1;
			}
			else{
				if((dx<0 && dy<0) || (dx>0 && dy>0)){
					y=y+1;
				}
				else{
					y=y-1;
				}
				px=px+2*(dy1-dx1);
			}
			ctx.fillRect(x, y, 1, 1);
		}
	}
	// change in y is greater than change in x
	else{
		// if change in y is positive
		if(dy>=0){
			x=x1t;
			y=y1t;
			ye=y2t;
		}
		// negative change in y
		else{
			x=x2t;
			y=y2t;
			ye=y1t;
		}
		ctx.fillRect(x, y, 1, 1);
		for(i=0;y<ye;i++){
			y=y+1;
			if(py<=0){
			py=py+2*dx1;
			}
			else{
				if((dx<0 && dy<0) || (dx>0 && dy>0)){
					x=x+1;
				}
				else{
					x=x-1;
				}
				py=py+2*(dx1-dy1);
			}
			ctx.fillRect(x, y, 1, 1);
		}
	}
	/* Original attempt, failed in q2 and q4
	if(x1t > x2t){
		var xTemp = x1t;
		var yTemp = y1t;
		x1t = x2t;
		x2t = xTemp;
		y1t = y2t;
		y2t = yTemp;
	}
	// calculate dx & dy
    let dx = x2t - x1t;
    let dy = y2t - y1t;
 
    // initial value of decision
    // parameter d
    let d = dy - (dx/2);
    let x = x1t, y = y1t;
 
    // Plot initial given point
    // putpixel(x,y) can be used to
    // print pixel of line in graphics
    ctx.fillRect(x, y, 1, 1);
 
    // iterate through value of X
    while (x < x2t)
    {
        x++;
 
        // E or East is chosen
        if (d < 0)
            d = d + dy;
 
        // NE or North East is chosen
        else
        {
            d += (dy - dx);
            y++;
        }
 
        // Plot intermediate points
        // putpixel(x,y) is used to print
        // pixel of line in graphics
        ctx.fillRect(x, y, 1, 1);
    }
	*/
}

function myMidpointCircle(x1t, y1t, x2t, y2t){
	var rad = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
	
	// primitive call
	// ctx.beginPath();
	// ctx.arc(x1t,y1t,rad,0*Math.PI,2*Math.PI);
	// ctx.stroke();
	// slightly smoother around edges
	
	var x = 0;
	var y = rad;
	var d = 5/4 - rad;
	
	CirclePoints(x1t, y1t, x, y);
	while(y > x){
		if(d < 0){
			d = d + 2 * x + 3;
		}
		else {
			d = d + 2 * (x-y) + 5;
			y--;
		}
		x++;
		CirclePoints(x1t, y1t, x, y);
	}
}
function CirclePoints(x1t, y1t, x, y)
{
	ctx.fillRect(x1t+x, y1t+y, 1, 1);
	ctx.fillRect(x1t+y, y1t+x, 1, 1);
	ctx.fillRect(x1t+y, y1t-x, 1, 1);
	ctx.fillRect(x1t+x, y1t-y, 1, 1);
	ctx.fillRect(x1t-x, y1t-y, 1, 1);
	ctx.fillRect(x1t-y, y1t-x, 1, 1);
	ctx.fillRect(x1t-y, y1t+x, 1, 1);
	ctx.fillRect(x1t-x, y1t+y, 1, 1);
}

function myMidpointEllipse(x1t, y1t, x2t, y2t){
	
	// primitive call
	// ctx.beginPath();
	// ctx.ellipse(x1t, y1t, x2t, y2t, 0, 0*Math.PI, 2*Math.PI, true);
	// ctx.stroke();
	// smoother edges, but same shape
	
	var d2;
	var x = 0;
	var y = y2t;
	var d1 = (y2t*y2t) - (x2t*x2t) + (.25*x2t*x2t);
	
	EllipsePoints(x, y);
	
	// test gradient if still in region 1
    while (((x2t*x2t)*(y-0.5)) > ((y2t*y2t)*(x+1))) {
        if (d1 < 0) {
            d1 = d1 + ((y2t*y2t)*(2*x+3));
        }
        else {
            d1 = d1 + ((y2t*y2t)*(2*x+3)) + ((x2t*x2t)*(-2*y+2));
            y--;
        }
        x++;
        EllipsePoints(x1t, y1t, x, y);
    }   // Region 1
	
	d2 = ((y2t*y2t)*(x+0.5)*(x+0.5))+((x2t*x2t)*(y-1)*(y-1))-(x2t*x2t*y2t*y2t);
    while (y > 0) {
        if (d2 < 0) {
            d2 = d2 + ((y2t*y2t)*(2*x+2)) + ((x2t*x2t)*(-2*y+3));
            x++;
        }
        else {
            d2 = d2 + ((x2t*x2t)*(-2*y+3));
        }
        y--;
        EllipsePoints(x1t, y1t, x, y);
    } 	// Region 2
}
function EllipsePoints(x1t, y1t, x, y){
	ctx.fillRect(x1t+x, y1t+y, 1, 1);
	ctx.fillRect(x1t-x, y1t+y, 1, 1);
	ctx.fillRect(x1t+x, y1t-y, 1, 1);
	ctx.fillRect(x1t-x, y1t-y, 1, 1);
}

function myBezierCurve(p1, p2, p3, p4){
	//primitive call
	// ctx.beginPath();
	// ctx.moveTo(p1[0], p1[1]);
	// ctx.bezierCurveTo(p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]);
	// ctx.stroke();
	// color change in line due to change in 'n' or number of iterations
	
    var i;
    var x, y, z;
    var delta = 1.0/n;
    var t;

    x = p1[0];
    y = p1[1];
    t = 0.0;
    ctx.fillRect(x, y, 1, 1);
    for (var i = 0; i < n; i++) {
        t += delta;
        var t2 = t * t;
        var t3 = t2 * t;
           
        var q1=(1-t);
        var q2=q1*q1;
        var q3=q2*q1;
        x = q3*p1[0] + (3*t*q2)*p2[0] + (3*t2*q1)*p3[0] + t3*p4[0];
        y = q3*p1[1] + (3*t*q2)*p2[1] + (3*t2*q1)*p3[1] + t3*p4[1];
        ctx.fillRect(x, y, 1, 1);
    }
}

function myHermiteCurve(p1, p4, r1, r4){
	
	// not sure about this one
	// tested with same input as sample program
	// got exact same points as output so must be correct
	// didnt know how to test primitive for hermite curve other than that
	
	var i;
    var x;
	var y;
	var z;
    var delta = 1.0/n;
    var t;
	
    x = p1[0];
    y = p1[1];
    t = 0.0;
    ctx.fillRect(x, y, 1, 1);
    for (i = 0; i < n; i++) {
        t += delta;
        var t2 = t * t;
        var t3 = t2 * t;
		
        x = ((2*t3)-(3*t2)+1)*p1[0] + ((-2*t3)+(3*t2))*p4[0] + (t3-(2*t2)+t)*r1[0] + (t3-t2)*r4[0];
		y = ((2*t3)-(3*t2)+1)*p1[1] + ((-2*t3)+(3*t2))*p4[1] + (t3-(2*t2)+t)*r1[1] + (t3-t2)*r4[1];
		ctx.fillRect(x, y, 1, 1);
		//console.log("x=" + x + " y=" + y);
    }
}

function myBSplineCurve(p1, p2, p3, p4){
	
	// same situation as hermite curve
	// same output as sample program 
	// must be correct due to same output as sample
	
	var i;
    var x;
	var y;
	var z;
    var delta = 1.0/n;
    var t;

    x = p1[0];
    y = p1[1];
    t = 0.0;
    ctx.fillRect(x, y, 1, 1);
    for (i = 0; i < n; i++) {
        t += delta;
        var t2 = t * t;
        var t3 = t2 * t;

        x = (((1-t3)/6)*p1[0])+(((3*t3-6*t2+4)/6)*p2[0])+(((-3*t3+3*t2+3*t+1)/6)*p3[0])+((t3/6)*p4[0]);
        y = (((1-t3)/6)*p1[1])+(((3*t3-6*t2+4)/6)*p3[1])+(((-3*t3+3*t2+3*t+1)/6)*p3[1])+((t3/6)*p4[1]);
        
        ctx.fillRect(x, y, 1, 1);
    }
}