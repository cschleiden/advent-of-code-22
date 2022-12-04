import { getLines } from "../lib/fs";

const lines = await getLines("input.txt");

let dps = 0;

for (const line of lines) {
  const [p1, p2] = line.split(",");

  const r1 = getRange(p1);
  const r2 = getRange(p2);

  if (
    (r1[0] <= r2[0] && r2[1] <= r1[1]) ||
    (r1[0] >= r2[0] && r2[1] >= r1[1])
  ) {
    dps++;
  }
}

console.log("Result:", dps);

function getRange(x: string): [start: number, end: number] {
  const [s, e] = x.split("-");
  return [parseInt(s), parseInt(e)];
}
