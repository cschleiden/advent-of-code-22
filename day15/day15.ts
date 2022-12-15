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

//
const targetY = 2000000;
let p = 0;
let o = [];
for (let x = minX - 1; x < maxX + 1; x++) {
  if (
    sensors.some(
      (s) =>
        dist({ x, y: targetY }, s.p) <= s.dist &&
        (s.b.x !== x || s.b.y !== targetY)
    )
  ) {
    // o.push("#");
    p++;
  } else {
    // o.push(".");
  }
}

console.log(o.join(""));
console.log(p);

// Manhattan distance
function dist(s: Pos, t: Pos): number {
  return Math.abs(s.x - t.x) + Math.abs(s.y - t.y);
}
