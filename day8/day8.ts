import { getLines } from "../lib/fs";

const grid: number[][] = [];

const lines = await getLines(process.argv[2]);
for (const line of lines) {
  const row: number[] = [];
  for (const c of line) {
    row.push(parseInt(c));
  }
  grid.push(row);
}

const lx = grid[0].length;
const ly = grid.length;

const scores: number[] = [];

for (let x = 0; x < lx; x++) {
  for (let y = 0; y < ly; y++) {
    scores.push(determineScore(grid, x, y));
  }
}

scores.sort((a, b) => b - a);

console.log(scores);

function determineScore(grid: number[][], x: number, y: number): number {
  // Up
  let up = viewingDistance(grid, x, y, 0, -1);
  // Down
  let down = viewingDistance(grid, x, y, 0, 1);
  // Left
  let left = viewingDistance(grid, x, y, -1, 0);
  // Right
  let right = viewingDistance(grid, x, y, 1, 0);

  return up * down * left * right;
}

function viewingDistance(
  grid: number[][],
  x: number,
  y: number,
  xdir: number,
  ydir: number
): number {
  const height = grid[x][y];
  let distance = 0;
  x += xdir;
  y += ydir;
  while (x >= 0 && x < lx && y >= 0 && y < ly) {
    if (grid[x][y] < height) {
      distance++;
    } else {
      distance++;
      break;
    }
    x += xdir;
    y += ydir;
  }
  return distance;
}
