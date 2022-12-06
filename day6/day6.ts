import { getLines } from "../lib/fs";

const [line] = await getLines(process.argv[2]);

const chars = line.split("");

let start = 0;
for (let i = 0; i < chars.length; i++) {
  if (i - start >= 4 && allDifferent(chars.slice(start, i))) {
    console.log(i - 1);
    break;
  } else if (i - start > 4) {
    start = i - 4;
  }
}

function allDifferent(x: string[]) {
  return new Set(x).size === x.length;
}
