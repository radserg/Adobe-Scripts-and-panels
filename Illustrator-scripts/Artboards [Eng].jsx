/************************************************
Author: Sergey Radtsevich
contact: radserg@gmail.com

Aim:
Allign artboards and sort artboards list by they coordinates.
Usfull for exporting artboards in rigth order.

Testing on artboards 1920 x 1080 px copied from each other in different order

Done:
+ Align artboards by pixels
+ Can move artboards
+ Can move artboard with content
+ Function setup artboard with content in some coordinates
	+ find moving coord
	+ move content
	+ move artboard

Need to do:
- sort artboards by position on list
	+ sort by y coordinate
	+ sort by x coordinate
	+ find groups of artboards whith close y coordinates
	+ find groups of artboards whith close x coordinates
	+ make array of artboard numbers by they position on x and y groups
	- find middle coordinate in rows and lines of artboard groups 
	- move artboards in middle coordinates (aligne by groups)
- change order of artboards in illustrator window
- make a GUI
- Strange move of the textfields
??? is it possible to sort artboard objects by sinding them in function, whithout making additional arry of they numbers ???



*************************************************/

var doc = app.activeDocument;
var allboards = doc.artboards


/* Data about artboards */
$.writeln(" * * *");
$.writeln("Number of artboards: " + doc.artboards.length);
var fine_f = false; //flag strart align to pixels function
var cord = []; //array [artboard number, x cord, y cord]
get_cord(doc.artboards);

sortby(cord,2);
//infosort(2);

var result = new Array([1,2,3]);
var row = 0;
var line = 0;
var treshold = 800; //threshold of vertical grouping


for (var i = 0; i < cord.length; i++) { //group by large changing of vert coord
	if (!(cord[i+1]===undefined)) {
		var diff = Math.round(cord[i][2] - cord[i+1][2]);
		
	}
	else
	{
		var diff = 0;
	}	
	result[line][row] = [cord[i][0], cord[i][1], cord[i][2] ]
	row++;
	if (diff>treshold) {
		row = 0;
		line++;
		result.push(new Array())
	}
}

for (var i = 0; i < result.length; i++) { //sort by lines
	sortby(result[i],1);
	result[i].reverse();
}

$.writeln(" Result: ")	//write result of sort and group
for (var i = 0; i < result.length; i++) {
	for (var j = 0; j < result[i].length; j++) {
		$.write(allboards[ result[i][j][0] ].name + " ")
	}
	$.writeln()	
}

function infosort(param) { 
	for (var i = 0; i < cord.length; i++) { //write result of sort by param like in get_cord()
		if (!(cord[i+1]===undefined)) {
			var diff = Math.round(cord[i][param] - cord[i+1][param]);
		}
		else
		{
			var diff = "0"
		}
		$.writeln(i + " " + allboards[cord[i][0]].name + " " + cord[i][1] +" x "+ cord[i][2] + " разница: " + diff);
	}
}

//var set = [0,1,2,3,4,5,6,7];
//var set = [0,8];
//var mid_x = -7100;
//var mid_y = undefined;
/* * */
/* Moving artboards whith content */
//all_artboards();

/*  //counting and moving
for (var i = 0; i < set.length; i++) {
	doc.artboards.setActiveArtboardIndex(set[i]);
	var board = doc.artboards[doc.artboards.getActiveArtboardIndex()]; //save active artboard
	info(board);
	moveto(board, mid_x, mid_y);
}
*/

//* Sort by x or y
function sortby(ab, param) { //array data of artboards, number of parameter for sorting
	function compare(cord1, cord2) {
		return cord1[param]-cord2[param]
	}
	ab.sort(compare)
	ab.reverse();
}

function moveto(b, x, y) { // move artboard whith content b - artboard, x - new coord, y - new coord
	if (x === undefined) {
		var delta_x = 0; // find x move
	}
	else {
		var delta_x = x - board.artboardRect[0];
	}

	if (y === undefined) {
		var delta_y = 0;
	} else {
		var delta_y = y - board.artboardRect[1];
	}

	movement(b, delta_x, delta_y)
	delta(b, delta_x, delta_y);
}

function all_artboards() { //every artboard
	$.writeln("* * *");
	
	for (var i = 0; i < doc.artboards.length; i++) {
		if (fine_f) {
			fine(doc.artboards[i]);
			$.writeln(i + " Adjust: " + doc.artboards[i].name + " - done;");
		}
	};
}

function movement(b, x, y) { //offset content of active artboard
	doc.selectObjectsOnActiveArtboard(); 
	for (var i = 0; i < doc.selection.length; i++) {
			doc.selection[i].translate(x, y);
		}
}

function delta(b, x, y) { //offset artboard rectangle
	var rect = (b.artboardRect);
	var delta_rect_x = x;
	var delta_rect_y;
	if (x===undefined) { //
		delta_rect_x = 0;
	}

	if (y===undefined) {
		delta_rect_y = delta_rect_x;
	}
	else {
		delta_rect_y = y;
	}
	b.artboardRect = Array(
									(rect[0] + delta_rect_x ), 
									(rect[1] + delta_rect_y ), 
									(rect[2] + delta_rect_x ), 
									(rect[3] + delta_rect_y )
								);
	info(b);
}

function fine(b) { //align by pixels
	b.artboardRect = Array(
								Math.round(b.artboardRect[0]), 
								Math.round(b.artboardRect[1]),
								Math.round(b.artboardRect[2]),
								Math.round(b.artboardRect[3])
					    	);
}

function info(t) { //console info about artboard position
	$.writeln("Artboard: " + t.name)
    $.writeln("Origin: " + t.rulerOrigin)
    $.writeln("Rect: " + t.artboardRect);
    $.writeln("Measures: " + Math.abs(t.artboardRect[2] - t.artboardRect[0]) + " x " + Math.abs(t.artboardRect[3] - t.artboardRect[1]))
}

function get_cord(b) { //take numbers of artboards and they coordinates in array
	for (var i = 0; i < b.length; i++) {
		cord[i] = [
			i,						//artboard number
			b[i].artboardRect[0],	//x coord
			b[i].artboardRect[1]	//y coord
		]
	}
}