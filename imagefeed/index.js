let iconCount = 10; //randomInRange([0, 1], [5, 10]);

let pathOld;
for (let i = 0; i < 10; i++) {
  let path;
  path = new Path(
    'M85.91,66.47A43,43,0,0,1,0,66.47C0,42.75,43,0,43,0S85.91,42.75,85.91,66.47Z'
  );
  path.fillColor = 'blue';

  if (pathOld != undefined) {
    path.bounds.topLeft = pathOld.bounds.bottomCenter - pathOld.width;
  }
  pathOld = path;
}

function randomInRange(srcRange, dstRange) {
  return convertToRange(Point.random().x, srcRange, dstRange);
}

function convertToRange(value, srcRange, dstRange) {
  // value is outside source range return
  if (value < srcRange[0] || value > srcRange[1]) {
    return NaN;
  }

  var srcMax = srcRange[1] - srcRange[0],
    dstMax = dstRange[1] - dstRange[0],
    adjValue = value - srcRange[0];

  return (adjValue * dstMax) / srcMax + dstRange[0];
}
