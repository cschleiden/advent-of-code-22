import console from "console";
import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

type Pos = [number, number];

let start: Pos[] = [];
let target: Pos = [0, 0];

const grid: number[][] = [];

let x = 0;
let y = 0;
for (const line of lines) {
  const row = [];

  for (const c of line) {
    if (c === "S") {
      row.push(0);
    } else if (c === "E") {
      row.push("z".charCodeAt(0) - "a".charCodeAt(0));
      target = [x, y];
    } else {
      row.push(c.charCodeAt(0) - "a".charCodeAt(0));
    }

    if (row[row.length - 1] === 0) {
      start.push([x, y]);
    }

    y++;
  }

  grid.push(row);

  y = 0;
  x++;
}

const maxX = grid.length;
const maxY = grid[0].length;

function shortestPath(start: Pos) {
  const dist = new Map<string, number>();
  const prev = new Map<string, Pos>();

  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const node: Pos = [x, y];

      for (const pos of getReachablePositions(node)) {
        dist.set(key(pos), Number.MAX_SAFE_INTEGER);
        prev.set(key(pos), null);
      }
    }
  }

  dist.set(key(start), 0);

  const q: Pos[] = [start];
  while (q.length > 0) {
    q.sort((a, b) => dist.get(key(a)) - dist.get(key(b)));
    const u = q.shift();
    if (key(u) === key(target)) {
      break;
    }

    for (const v of getReachablePositions(u)) {
      const alt = dist.get(key(u)) + 1;
      if (alt < dist.get(key(v))) {
        dist.set(key(v), alt);
        prev.set(key(v), u);
        q.push(v);
      }
    }
  }

  const s = [];
  let u = target;
  while (u !== null) {
    s.push(u);
    u = prev.get(key(u));
  }

  return s;
}

const pathLengths = [];
console.log("Calculating shortest paths...", start.length);

let i = 0;
for (const s of start) {
  i++ % 100 === 0 && console.log(".");

  const path = shortestPath(s);
  if (path.length > 1) {
    pathLengths.push(path.length - 1);
  }
}
pathLengths.sort((a, b) => a - b);
console.log(pathLengths[0]);

function key(p: Pos): string {
  return p.join(",");
}

function getReachablePositions(pos: [number, number]) {
  const [x, y] = pos;
  const height = grid[x][y];
  const positions: Pos[] = [];

  // right
  if (x + 1 < maxX && grid[x + 1][y] - height <= 1) {
    const n: Pos = [x + 1, y];
    positions.push(n);
  }

  // left
  if (x - 1 >= 0 && grid[x - 1][y] - height <= 1) {
    const n: Pos = [x - 1, y];
    positions.push(n);
  }

  // up
  if (y - 1 >= 0 && grid[x][y - 1] - height <= 1) {
    const n: Pos = [x, y - 1];
    positions.push(n);
  }

  // down
  if (y + 1 < maxY && grid[x][y + 1] - height <= 1) {
    const n: Pos = [x, y + 1];
    positions.push(n);
  }

  return positions;
}
