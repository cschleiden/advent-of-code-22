import { getLines } from "../lib/fs";
const lines = await getLines("./input.txt");

type rucksack = {
  first: string;
  second: string;
};

const r: rucksack[] = [];

const shared: string[] = [];

let x = 0;

for (const line of lines) {
  const rs = {
    first: line.substring(0, line.length / 2),
    second: line.substring(line.length / 2),
  };
  r.push(rs);

  const sm = new Set(rs.second.split(""));

  const shared = rs.first.split("").filter((x) => sm.has(x))[0];
  if (shared.toLocaleLowerCase() === shared) {
    x += 1 + shared[0].charCodeAt(0) - "a".charCodeAt(0);
  } else {
    x += 27 + (shared[0].charCodeAt(0) - "A".charCodeAt(0));
  }
}

console.log("Result:", x);
