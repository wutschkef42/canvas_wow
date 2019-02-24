/*

    SOME SHIT I USE TO TEST

*/

// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.StaticCanvas('c');

// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20,
  angle: 45,
});

// "add" rectangle onto canvas
canvas.add(rect);

rect.set({ left: 20, top: 50 });
canvas.renderAll();


var circle = new fabric.Circle({
    radius: 20, fill: 'green', left: 100, top: 100
  });
var triangle = new fabric.Triangle({
    width: 20, height: 30, fill: 'blue', left: 50, top: 50
});
  
canvas.add(circle, triangle);

var path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');

path.set({ left: 120, top: 120 });
console.log(path)
canvas.add(path);

/*
var svgEl = document.body.getElementsByTagName('svg')[0];
var serializer = new XMLSerializer();
var svgStr = serializer.serializeToString(svgEl);

var canvas = new fabric.Canvas('c');
canvas.backgroundColor = 'rgb(150,150,150)';
var path = fabric.loadSVGFromString(svgStr,function(objects, options) {
  var obj = fabric.util.groupSVGElements(objects, options);
  obj.scaleToHeight(canvas.height-10)
    .set({ left: canvas.width/2, top: canvas.height/2 })
    .setCoords();
  
  canvas.add(obj).renderAll();
});
*/