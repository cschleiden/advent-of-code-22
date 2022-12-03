import { getLines } from "../lib/fs";
const lines = await getLines("./input.txt");

type rucksack = {
  first: string;
  second: string;
};

const r: rucksack[] = [];

const shared: string[] = [];

let x = 0;

let g = 0;
let i = 0;

let gb = "";
let gs = new Set<string>();

for (const line of lines) {
  if (i % 3 === 0) {
    if (g > 0) {
      x += p(Array.from(gs.values())[0]);
    }
    // new group
    gs = new Set(line.split(""));
    g++;
  } else {
    gs = new Set(line.split("").filter((x) => gs.has(x)));
  }
  ++i;
}
x += p(Array.from(gs.values())[0]);

console.log("Result:", x);

function p(shared: string) {
  if (shared.toLocaleLowerCase() === shared) {
    return 1 + shared[0].charCodeAt(0) - "a".charCodeAt(0);
  } else {
    return 27 + (shared[0].charCodeAt(0) - "A".charCodeAt(0));
  }
}
