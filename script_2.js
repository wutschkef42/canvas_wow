/*
    HERE IS WHERE THE ACTION HAPPENS
*/

const svgEl = document.querySelector('svg');
const canvas = new fabric.Canvas('c');

/*
** calculate linear grayscale
** @i element index
** @n number of elements
*/

function getGrayscale(i, n) {
  return `#${Math.floor((n - i) / n * 255).toString(16).repeat(3)}`;
}

/*
** @n number of slices
*/

function generateSlices(n) {
  return ((new Array(n).fill({})).map((el, i) => (
    { percent: 1 / n, color: getGrayscale(i + 1, n) })));
}

/*
** (x, y) coordinates along circle perimeter in @percent
*/

function getCoordinatesForPercent(percent) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}



let cumulativePercent = 0;
generateSlices(8).forEach(slice => {
  const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
  cumulativePercent += slice.percent;
  const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

  const pathData = [
    `M ${startX} ${startY}`,
    `A 1 1 0 0 1 ${endX} ${endY}`,
    `L 0 0`,
    `L ${startX} ${startY}`,
  ].join(' ');

  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', pathData);
  pathEl.setAttribute('fill', slice.color);
  pathEl.setAttribute('stroke', 'white');
  pathEl.setAttribute('stroke-width', 0.04);
  svgEl.appendChild(pathEl);
});


var circle = new fabric.Circle({
  radius: 70, fill: 'white', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var circle_2 = new fabric.Circle({
  radius: 60, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var circle_3 = new fabric.Circle({
  radius: 50, fill: 'white', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var circle_4 = new fabric.Circle({
  radius: 242, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var triangle = new fabric.Triangle({
  width: 30, height: 38, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2, top: 25, angle: 180, stroke: 'white', strokeWidth: 4
});


function spin() {

}

let rotate = 3000;

const onClick = obj => () => {
  obj.animate('angle', rotate, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 10000,
    easing: fabric.util.ease.easeInOutCubic
  });

  rotate += 3000 + Math.random() * 1000 ;
}

// load svg into fabricjs
var serializer = new XMLSerializer();
var svgStr = serializer.serializeToString(svgEl);
var path = fabric.loadSVGFromString(svgStr, (objects, options) =>{
  var obj = fabric.util.groupSVGElements(objects, options)
                        .scaleToHeight(canvas.height - 40)
                        .set({
                          top: canvas.height / 2,
                          left: canvas.height / 2,
                          originX: 'center', originY: 'center'});

  canvas.add(circle_4)
  canvas.add(obj).renderAll();
  canvas.add(circle, circle_2, circle_3, triangle)


  const button = document.getElementById('relance');
  button.addEventListener("click", onClick(obj))

});

console.log(path);
