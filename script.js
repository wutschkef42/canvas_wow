
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

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

/*
** (x, y) coordinates along circle perimeter from @percent
*/

function getCoordinatesForPercent(percent) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

/*
** (x, y) coordinates along circle perimeter in from @angle
*/

function getCoordinatesForAngle(radius, angle) {
  x = radius * Math.cos(Math.radians(angle))
  y = radius * Math.sin(Math.radians(angle))
  return [x, y];
}

/*
** generate wheel SVG
*/

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


/*
** generate dots and labels
** you can change colors and labels here
*/

function generateDotsAndLabels(n) {
  let objs = []
  let colors = ['#4286f4', '#92ea3a', '#e83594', '#9530dd', '#f7e525', '#221cdb', '#e5a43b', '#3be57c']
  let labels = ['italian', 'mexican', 'thai', 'french', 'korean', 'chinese', 'american', 'japanese']
  for (let i = 0; i < n; i++) {
    let [posX, posY] = getCoordinatesForAngle(90, 22.5 + i/n * 360)
    let [posXLabel, posYLabel] = getCoordinatesForAngle(160, 22.5 + i/n * 360)
    let circle = new fabric.Circle({
      radius: 12,
      fill: colors[i],
      originX: 'center',
      originY: 'center',
      left: canvas.width/2 + posX ,
      top: canvas.height/2 + posY
    });
    let label = new fabric.Text(labels[i].toLocaleUpperCase(), {
      fill: 'white',
      originX: 'center',
      originY: 'center',
      left: canvas.width/2 + posXLabel,
      top: canvas.height/2 + posYLabel,
      angle: i/n * 360 + 22.5,
      fontFamily: 'Helvetica',
      fontSize: 12,
      fontWeight: 'bold'
    })
    objs.push(circle)
    objs.push(label)
  }
  return (objs);
}

let rotate = 3000;
const onClick = obj => () => {
  obj.animate('angle', rotate, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 6000,
    easing: fabric.util.ease.easeInOutCubic
  });

  rotate += 1500 + Math.random() * 360 ;
  console.log(rotate % 360)
}

/* circles for the center of the wheel */

var circle_inner_outer_white = new fabric.Circle({
  radius: 70, fill: 'white', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var circle_inner_black = new fabric.Circle({
  radius: 60, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var circle_inner_white = new fabric.Circle({
  radius: 50, fill: 'white', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var circle_outer_black = new fabric.Circle({
  radius: 242, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

var triangle = new fabric.Triangle({
  width: 30, height: 38, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2, top: 25, angle: 180, stroke: 'white', strokeWidth: 4
});

/* load wheel svg into fabric */

var serializer = new XMLSerializer();
var svgStr = serializer.serializeToString(svgEl);
var path = fabric.loadSVGFromString(svgStr, (objects, options) =>{
  var obj = fabric.util.groupSVGElements(objects, options)
                        .scaleToHeight(canvas.height - 40)
                        .set({
                          top: canvas.height / 2,
                          left: canvas.height / 2,
                          originX: 'center', originY: 'center'});

  canvas.add(circle_outer_black)
  let dotLabelObjs = generateDotsAndLabels(8)
  dotLabelObjs.unshift(obj)
  var motionGroupObj = new fabric.Group(dotLabelObjs,{
                            originX: 'center', originY: 'center'
  });

  canvas.add(motionGroupObj).renderAll();
  canvas.add(circle_inner_outer_white, circle_inner_black, circle_inner_white, triangle)
  const button = document.getElementById('relance');
  button.addEventListener("click", onClick(motionGroupObj))
});
