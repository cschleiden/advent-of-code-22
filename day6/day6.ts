import { getLines } from "../lib/fs";

const [line] = await getLines(process.argv[2]);

const chars = line.split("");

for (let i = 14; i < chars.length; i++) {
  if (allDifferent(chars.slice(i - 14, i))) {
    console.log(i);
    break;
  }
}

function allDifferent(x: string[]) {
  return new Set(x).size === x.length;
}
