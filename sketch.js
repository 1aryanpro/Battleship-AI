let size = 9;
let unit;
let field = [];
let probs = [];
let maxProb = 1;

let loColor, hiColor;

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


  fill(shot == 0 ? lerpColor(loColor, hiColor, prob/maxProb) : shot == 1 ? loColor : '#FF6961');
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
}
