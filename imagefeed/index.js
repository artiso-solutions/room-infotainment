let weather = 'Rain';
let colors = ['#A14893', '#6984BE', '#ACE563', '#FFF600', '#FF4300', '#FF0000'];
let minTemp = -30;
let maxTemp = 50;

function calcTempColor(temperature) {
  let tempDist = maxTemp - minTemp;
  //clamp temp to valid ratio
  let temp = Math.min(Math.max(temperature, minTemp), maxTemp);
  let sections = colors.length - 1;
  let tempSection = tempDist / sections;
  let sectionNr = Math.floor((temp + Math.abs(minTemp)) / tempSection);

  let tempSectionStart = tempSection * sectionNr - Math.abs(minTemp);
  let tempSectionEnd = tempSection * (sectionNr + 1) - Math.abs(minTemp);
  console.log(sectionNr + ':' + tempSectionStart + ' ' + tempSectionEnd);
  let frac = (temp - tempSectionStart) / tempSection;
  console.log(frac);

  let col1 = new Color(colors[sectionNr]);
  let col2 = new Color(colors[sectionNr + 1]);
  let colVec = col2.subtract(col1);
  colVec = colVec.multiply(frac);
  return col1.add(colVec);
}

/* let circ = new Path.Circle([300,300], [150,150]);
circ.fillColor = calcTempColor(-5);

let circ2 = new Path.Circle([500,300], [150,150]);
circ2.fillColor = calcTempColor(-7); */

var TEMP = 0;
// The amount of circles we want to make:
var colorNrs = 4;
var count = 600;
var subcount = count / colorNrs;

// Create a symbol, which we will use to place instances of later:
let path;
switch (weather) {
  case 'Rain':
    path = new Path(
      'M85.91,66.47A43,43,0,0,1,0,66.47C0,42.75,43,0,43,0S85.91,42.75,85.91,66.47Z'
    );
    break;
  default:
    path = Path.Rectangle(new Point(150, 30), new Size(50, 50));
}
// Create a symbol, which we will use to place instances of later:
/*var path = new Path.Circle({
center: [0, 0],
radius: 10,
fillColor: calcTempColor(TEMP-4),
});*/

var path2 = path.clone();
path2.fillColor = calcTempColor(TEMP);

var path3 = path.clone();
path3.fillColor = calcTempColor(TEMP + 4);

var path4 = path.clone();
path4.fillColor = calcTempColor(TEMP + 8);

var symbols = [
  new Symbol(path),
  new Symbol(path2),
  new Symbol(path3),
  new Symbol(path4),
];

//path = new Path("M85.91,66.47A43,43,0,0,1,0,66.47C0,42.75,43,0,43,0S85.91,42.75,85.91,66.47Z")
for (var i = 0; i < count; i++) {
  // The center position is a random point in the view:
  var center = Point.random() * view.size;
  var placedSymbol = symbols[i % 4].place(center);
  placedSymbol.scale(i / count);
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
  // Run through the active layer's children list and change
  // the position of the placed symbols:
  for (var i = 0; i < count; i++) {
    var item = project.activeLayer.children[i];

    // Move the item 1/20th of its width to the right. This way
    // larger circles move faster than smaller circles:
    item.position.y += item.bounds.width / 2;

    // If the item has left the view on the right, move it back
    // to the left:
    if (item.bounds.top > view.size.width) {
      item.position.y = -item.bounds.width;
    }
  }
}
