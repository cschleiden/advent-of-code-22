import { getLines } from "../lib/fs";

const lines = await getLines("input.txt");

let dps = 0;

for (const line of lines) {
  const [p1, p2] = line.split(",");

  const r1 = getRange(p1);
  const r2 = getRange(p2);

  if (
    inRange(r1[0], r2) ||
    inRange(r1[1], r2) ||
    inRange(r2[0], r1) ||
    inRange(r2[1], r1)
  ) {
    dps++;
  }
}

function inRange(x: number, r: [start: number, end: number]): boolean {
  return r[0] <= x && x <= r[1];
}

console.log("Result:", dps);

function getRange(x: string): [start: number, end: number] {
  const [s, e] = x.split("-");
  return [parseInt(s), parseInt(e)];
}
