import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

type Pos = { x: number; y: number };

const sensors: {
  p: Pos;
  b: Pos;
  dist: number;
}[] = [];
let minX = Number.MAX_SAFE_INTEGER;
let maxX = Number.MIN_SAFE_INTEGER;
const coords = /x=(-?\d+), y=(-?\d+)/g;
for (const line of lines) {
  // Example:
  //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  const matches = [...line.matchAll(coords)];
  const p = {
    x: Number(matches[0][1]),
    y: Number(matches[0][2]),
  };
  const b = {
    x: Number(matches[1][1]),
    y: Number(matches[1][2]),
  };
  const d = dist(p, b);
  sensors.push({
    p,
    b,
    dist: d,
  });

  minX = Math.min(minX, p.x - d);
  maxX = Math.max(maxX, p.x + d);
}

// //
// const targetY = 2000000;
// let p = 0;
// let o = [];
// for (let x = minX - 1; x < maxX + 1; x++) {
//   if (
//     sensors.some(
//       (s) =>
//         dist({ x, y: targetY }, s.p) <= s.dist &&
//         (s.b.x !== x || s.b.y !== targetY)
//     )
//   ) {
//     // o.push("#");
//     p++;
//   } else {
//     // o.push(".");
//   }
// }

type Rect = {
  start: Pos;
  length: number;
};

const rects: Rect[] = [];
for (const s of sensors) {
  const top = s.p.y - s.dist;
  const left = s.p.x - s.dist;
  const right = s.p.x + s.dist;

  const start = rot({ x: s.p.x, y: top });
  const r: Rect = {
    start: start,
    length: rot({ x: right, y: s.p.y }).x - start.x,
  };
  rects.push(r);
}

function rot(p: Pos): Pos {
  return {
    x: p.x + p.y,
    y: p.y - p.x,
  };
}

let searchSpace =
  process.argv[2].indexOf("example.txt") !== -1 ? 20 : 4_000_000;

let x, y;

outer: for (const s of sensors) {
  let leftX = s.p.x - s.dist - 1;
  let rightX = s.p.x + s.dist + 1;
  let topY = s.p.y - s.dist - 1;
  let bottomY = s.p.y + s.dist + 1;

  // right, down
  x = s.p.x;
  y = topY;
  while (x <= rightX && y <= s.p.y) {
    if (isFree({ x, y })) {
      console.log("Found at", x, y);
      break outer;
    }
    x++;
    y++;
  }

  while (x >= s.p.x && y <= bottomY) {
    if (isFree({ x, y })) {
      console.log("Found at", x, y);
      break outer;
    }
    x--;
    y++;
  }

  while (x >= leftX && y >= s.p.y) {
    if (isFree({ x, y })) {
      console.log("Found at", x, y);
      break outer;
    }
    x--;
    y--;
  }

  while (x <= s.p.x && y <= topY) {
    if (isFree({ x, y })) {
      console.log("Found at", x, y);
      break outer;
    }
    x++;
    y--;
  }

  console.log("Sensor done");
}

console.log("Found at", x, y, "Frequency", x * 4_000_000 + y);

function isFree(p: Pos): boolean {
  return (
    p.x >= 0 &&
    p.x <= searchSpace &&
    p.y >= 0 &&
    p.y <= searchSpace &&
    sensors.every((s) => dist(p, s.p) > s.dist)
  );
}

// Manhattan distance
function dist(s: Pos, t: Pos): number {
  return Math.abs(s.x - t.x) + Math.abs(s.y - t.y);
}
