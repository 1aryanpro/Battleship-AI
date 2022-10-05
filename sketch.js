let size = 9;
// let ships = [0, 0, 0, 5, 3];
let ships = [0, 0, 0, 0, 1];
let loColor, hiColor;

let unit;
let field = [];
let probs = [];
let maxProb = 1;

function setup() {
  createCanvas(600, 600, P2D);
  unit = width / size;

  for (let y = 0; y < size; y++) {
    field[y] = [];
    probs[y] = [];
    for (let x = 0; x < size; x++) {
      field[y][x] = 0;
      probs[y][x] = 0;
    }
  }

  loColor = color('#C8C8C8');
  hiColor = color('#1E7DF0');

  generateProbs();
}

function draw() {
  background(200);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      drawSpace(x, y);
    }
  }
  drawGrid();
}

function drawSpace(x, y) {
  noStroke();

  let shot = field[y][x];
  let prob = probs[y][x];
  let probNormal = prob/maxProb;


  let probColor = probNormal == 1 ? '#FDCA96' : lerpColor(loColor, hiColor, probNormal);

  fill(shot == 0 ? probColor : shot == 1 ? loColor : '#FF6961');
  rect(x * unit, y * unit, unit);
  if (shot == 0) return;

  fill(shot == 1 ? 0 : 'red');
  circle((x + 0.5) * unit, (y + 0.5) * unit, unit / (shot == 1 ? 8 : 2));
}

function drawGrid() {
  stroke(0);
  strokeWeight(2);
  for (let i = 1; i < size; i++) {
    line(i * unit, 0, i * unit, height);
    line(0, i * unit, width, i * unit);
  }
}

function mousePressed() {
  let x = floor(mouseX / unit);
  let y = floor(mouseY / unit);

  field[y][x] = (field[y][x] + 1) % 3;
  generateProbs();
}

function generateProbs() {
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) probs[y][x] = 0;

  for (let a = 0; a < size; a++) {
    let [colMisses, rowMisses] = findMisses(a);

    for (let w = 0; w < ships.length; w++) {
      let num = ships[w];
      if (num == 0) continue;

      for (let p = 0; p < size; p++) {
        if (rowMisses.indexOf(p) == -1) {
          let lRow = min(...rowMisses.map((v) => p - v).filter((v) => v > 0));
          let rRow = min(...rowMisses.map((v) => v - p).filter((v) => v > 0));
          if (lRow + rRow - 1 >= w) probs[a][p] += min(lRow, rRow, w) * num;
        }
        if (colMisses.indexOf(p) == -1) {
          let lCol = min(...colMisses.map((v) => p - v).filter((v) => v > 0));
          let rCol = min(...colMisses.map((v) => v - p).filter((v) => v > 0));
          if (lCol + rCol - 1 >= w) probs[p][a] += min(lCol, rCol, w) * num;
        }
      }
    }
  }
  // print(probs);
  maxProb = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let prob = probs[y][x];
      maxProb = max(prob, maxProb);
      if (prob == 0) field[y][x] = 1;
    }
  }
}

function findMisses(p) {
  let colMisses = [-1, size];
  let rowMisses = [-1, size];
  for (let a = 0; a < size; a++) {
    if (field[p][a] == 1) rowMisses.push(a);
    if (field[a][p] == 1) colMisses.push(a);
  }
  return [colMisses, rowMisses];
}
