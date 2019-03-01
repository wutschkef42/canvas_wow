/*
** CONFIGURATION
** ====================================================================================================
** @sliceColors: default to gray scale, optionally replace with array of custom colors ['#ffffff', ...]
** @sliceLabels: labels on slices
** @dotColors: colors of the dots inside each slice 
**
** sliceColors.length == sliceLabels.length == dotColors.length == wheelSize !! otherwise TypeError
** ====================================================================================================
*/

const wheelSize = 9; // number of slices in the wheel

const config = {
  slices: generateSlices(wheelSize),
  sliceColors: new Array(wheelSize).fill('').map((_, i) => (getGrayscale(i + 1, wheelSize))),
  sliceLabels: ['blabla', 'italian', 'mexican', 'thai', 'french', 'korean', 'chinese', 'american', 'japanese'],
  dotColors: ['#4286f4', '#92ea3a', '#e83594', '#9530dd', '#f7e525', '#221cdb', '#e5a43b', '#3be57c', '#92ea3a'],
}




const offsetHalfSlice = 360 / (wheelSize * 2)
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
  return ((new Array(n).fill({})).map((_, i) => (
    { percent: 1 / n })));
}

/*
** convert degrees to radians
*/

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
config.slices.forEach((slice, i) => {
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
  pathEl.setAttribute('fill', config.sliceColors[i]);
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
  let colors = config.dotColors
  let labels = config.sliceLabels
  for (let i = 0; i < n; i++) {
    let [posX, posY] = getCoordinatesForAngle(90, offsetHalfSlice + i/n * 360)
    let [posXLabel, posYLabel] = getCoordinatesForAngle(160, offsetHalfSlice + i/n * 360)
    let dot = new fabric.Circle({
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
      angle: i/n * 360 + offsetHalfSlice,
      fontFamily: 'Helvetica',
      fontSize: 12,
      fontWeight: 'bold'
    })
    objs.push(dot)
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
}

/* circles for the center of the wheel */

const circleInnerOuterWhite = new fabric.Circle({
  radius: 70, fill: 'white', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

const circleInnerBlack = new fabric.Circle({
  radius: 60, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

const circleInnerWhite = new fabric.Circle({
  radius: 50, fill: 'white', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

const circleOuterBlack = new fabric.Circle({
  radius: 242, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2 , top: canvas.height/2,
});

const triangle = new fabric.Triangle({
  width: 30, height: 38, fill: 'black', originX: 'center', originY: 'center', left: canvas.width/2, top: 25, angle: 180, stroke: 'white', strokeWidth: 4
});

/* load wheel svg into fabric */

const serializer = new XMLSerializer();
const svgStr = serializer.serializeToString(svgEl);
const path = fabric.loadSVGFromString(svgStr, (objects, options) =>{
  const obj = fabric.util.groupSVGElements(objects, options)
                        .scaleToHeight(canvas.height - 40)
                        .set({
                          top: canvas.height / 2,
                          left: canvas.height / 2,
                          originX: 'center', originY: 'center'});

  canvas.add(circleOuterBlack)
  const dotLabelObjs = generateDotsAndLabels(wheelSize)
  dotLabelObjs.unshift(obj)
  const motionGroupObj = new fabric.Group(dotLabelObjs,{
                            originX: 'center', originY: 'center'
  });

  canvas.add(motionGroupObj).renderAll();
  canvas.add(circleInnerOuterWhite, circleInnerBlack, circleInnerWhite, triangle)
  const button = document.getElementById('relance');
  button.addEventListener("click", onClick(motionGroupObj))
});
