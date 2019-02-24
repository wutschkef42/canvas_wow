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


// load svg into fabricjs
var serializer = new XMLSerializer();
var svgStr = serializer.serializeToString(svgEl);
canvas.backgroundColor = 'rgb(150,150,150)';
var path = fabric.loadSVGFromString(svgStr, function(objects, options) {
  console.log(objects)
  var obj = fabric.util.groupSVGElements(objects, options);
  obj.scaleToHeight(canvas.height - 40)
      .set({top: canvas.height / 2, left: canvas.height / 2, angle: 0, originX: 'center', originY: 'center',}) // try changing the angle you will see it rotates around a bad origin
      .setCoords();

  canvas.add(obj).renderAll();
});
