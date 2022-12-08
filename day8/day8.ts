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

let visible = lx * 2 + (ly - 2) * 2;

console.log("Edges: " + visible);

// Iterate over inner trees
for (let x = 1; x < lx - 1; x++) {
  for (let y = 1; y < ly - 1; y++) {
    if (hasSightline(grid, x, y)) {
      visible++;
    }
  }
}

console.log(visible);

function hasSightline(grid: number[][], x: number, y: number): boolean {
  const height = grid[x][y];

  // Check left
  let allShorter = true;
  for (let i = x - 1; i >= 0 && allShorter; i--) {
    allShorter = allShorter && grid[i][y] < height;
  }
  if (allShorter) {
    return true;
  }

  // Check right
  allShorter = true;
  for (let i = x + 1; i < lx && allShorter; i++) {
    allShorter = allShorter && grid[i][y] < height;
  }
  if (allShorter) {
    return true;
  }

  // Check up
  allShorter = true;
  for (let i = y - 1; i >= 0 && allShorter; i--) {
    allShorter = allShorter && grid[x][i] < height;
  }
  if (allShorter) {
    return true;
  }

  // Check down
  allShorter = true;
  for (let i = y + 1; i < ly && allShorter; i++) {
    allShorter = allShorter && grid[x][i] < height;
  }
  if (allShorter) {
    return true;
  }

  return false;
}
