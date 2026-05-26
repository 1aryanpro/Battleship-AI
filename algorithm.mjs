import chalk from 'chalk';
import { table } from 'table';

import cuHits from './newboard.mjs';

let hits = [23,22, 5, 6, 4, 28, 38, 18, 60, 21, 62];
let miss = [30, 2, 3, 7, 8, 48, 82, 42];

let start = [];

for (let i = 0; i < 9; i++) {
  start[i] = [];
  for (let j = 0; j < 9; j++) start[i][j] = 0;
}


miss.forEach(n => {
  let [x, y] = [Math.floor(n / 10), n % 10];
  start[y][x] = 2;
});

const drawBoard = (arr, px = -1, py = -1) => {

  let drawDict = {
    0: chalk.blue('■'),
    1: chalk.red('⏺'),
    2: chalk.gray('■'),
    // 3: chalk.blue('■'),
    3: chalk.green('✖'),
  }

  arr.forEach((row, y) =>
    console.log(
      row.map((v, x) => drawDict[hits.includes(x * 10 + y) ? 1
        : ((px == x && py == y) ? 3 : v)])
        .join(' ')));
  console.log();
}

let stats = cuHits(hits, miss);

let max = -1;
let maxX = -1;
let maxY = -1;
stats.forEach((row, y) => row.forEach((n, x) => {
  if (n <= max) return;
  max = n;
  maxX = x;
  maxY = y;
}));

drawBoard(start, maxX, maxY);

console.log(
  table(stats.map((row, y) =>
    row.map((n, x) => {
      n = n <= 0 ? (n == 0 ? '' : chalk.red('hit')) : n + '%';
      return (x == maxX && y == maxY || n == '100%') ? chalk.bold.green(n) : n;
    })
  ), { columnDefault: { width: 4 } })
);

console.log(maxX * 10 + maxY);

