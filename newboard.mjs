const random = Math.random;
const floor = Math.floor;
const randomN = (a) => floor(random() * a)
const randomR = (a, b) => a + floor(randomN(b - a));
const randomEle = arr => arr[floor(randomN(arr.length))];

export default function cuHits(hits, miss) {
  const addMiss = (x, y) => {
    let n = x * 10 + y;
    if (!miss.includes(n)) miss.push(n);
  }

  hits.forEach(n => {
    let [x, y] = [Math.floor(n / 10), n % 10];

    if (x > 0) {
      if (y > 0) addMiss(x - 1, y - 1);
      if (y < 8) addMiss(x - 1, y + 1);
    }
    if (x < 8) {
      if (y > 0) addMiss(x + 1, y - 1);
      if (y < 8) addMiss(x + 1, y + 1);
    }
  });

  let sample = floor(Math.pow(81 - miss.length - hits.length, 2));

  let stats = [];
  for (let i = 0; i < 9; i++) {
    stats[i] = [];
    for (let j = 0; j < 9; j++) {
      stats[i][j] = 0;
    }
  }

  let count = 0;
  while (count < sample) {
    let hitSpots = randomBoardHits([...hits], [...miss]);
    if (hitSpots == false) continue;

    hitSpots.forEach(([x, y]) => stats[y][x]++);
    count++;
  }

  hits.forEach(n => {
    let x = floor(n / 10);
    let y = n % 10;
    stats[y][x] = -1;
  })

  console.log(sample, 'boards checked\n');
  return stats.map(row => row.map(n => floor(n / sample * 100)));
}

function randomBoardHits(hits, miss) {
  let board = [];
  let locs = new Set();
  let hitSpots = [];

  for (let i = 0; i < 9; i++) {
    board[i] = [];
    for (let j = 0; j < 9; j++) {
      board[i][j] = 0;
      locs.add(i * 10 + j);
    }
  }

  miss.forEach(n => {
    let [x, y] = [floor(n / 10), n % 10];
    board[y][x] = 2;
    locs.delete(n);
  });

  let ships = [4, 4, 4, 3, 3, 3, 3, 3];
  // let ships = [4];

  let spaces = 9 * 9;
  let attempts = 0;
  while (ships.length > 0) {
    attempts++;
    if (attempts >= spaces) break;
    if (locs.size == 0) break;

    let curr = randomEle(ships);

    let pos = hits.length != 0 ? hits[0] : randomEle([...locs]);
    let [px, py] = [floor(pos / 10), pos % 10];

    let top, bot, lef, rig;

    for (let i = 0; i <= 9; i++) {
      if (lef == undefined && (px - i < 0 || board[py][px - i] != 0)) lef = i - 1;
      if (rig == undefined && (px + i > 8 || board[py][px + i] != 0)) rig = i - 1;
      if (top == undefined && (py - i < 0 || board[py - i][px] != 0)) top = i - 1;
      if (bot == undefined && (py + i > 8 || board[py + i][px] != 0)) bot = i - 1;
    }
    [top, bot, lef, rig] = [top, bot, lef, rig].map(n => Math.min(curr - 1, n));

    let positions = [];

    for (let i = px - lef; i <= px + rig - curr + 1; i++) positions.push([i, py, curr, 1]);
    for (let i = py - top; i <= py + bot - curr + 1; i++) positions.push([px, i, 1, curr]);

    if (positions.length == 0) continue;
    let [x, y, w, h] = randomEle(positions);

    // console.log(top, rig, bot, lef);
    // console.log(x, y, w, h);
    // console.log();

    attempts = 0;

    for (let i = x - 1; i <= x + w; i++) {
      for (let j = y - 1; j <= y + h; j++) {
        if (i < 0 || i >= 9 || j < 0 || j >= 9) continue;
        locs.delete(i * 10 + j);

        let hitInd = hits.indexOf(i * 10 + j);
        if (hitInd != -1) hits.splice(hitInd, 1);

        if (i >= x && i < x + w && j >= y && j < y + h) {
          board[j][i] = 1;
          hitSpots.push([i, j]);
        }
        else board[j][i] = 2;
      }
    }

    ships.splice(ships.indexOf(curr), 1);
  }

  if (hits.length == 0 && ships.length == 0) return hitSpots;
  else return false;
}
