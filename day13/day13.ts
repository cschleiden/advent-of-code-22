import { getLines } from "../lib/fs";

type List = (number | List)[];
const pairs: [List, List][] = [];

const lines = await getLines(process.argv[2]);
for (let i = 0; i < lines.length; i += 3) {
  const a = JSON.parse(lines[i]) as List;
  const b = JSON.parse(lines[i + 1]) as List;
  pairs.push([a, b]);
}

const indices = [];
for (let i = 0; i < pairs.length; i++) {
  if (compareLists(pairs[i][0], pairs[i][1])) {
    indices.push(i + 1);
  }
}

console.log(
  "Result",
  indices.reduce((a, b) => a + b, 0)
);

function compareLists(a: List, b: List): boolean | null {
  let i = 0,
    j = 0;
  for (; i < a.length && j < b.length; i++, j++) {
    let x = a[i];
    let y = b[j];

    if (typeof x !== typeof y) {
      x = fix(x);
      y = fix(y);
    }

    if (Array.isArray(x) && Array.isArray(y)) {
      const r = compareLists(x, y);
      if (r !== null) {
        return r;
      }
    }

    if (typeof x === "number") {
      if (x != y) {
        return x < y;
      }
    }
  }

  // Remaining items
  const il = a.length - i;
  const jl = b.length - j;

  if (il === jl) {
    return null;
  }

  return il < jl;
}

function fix(a: number | List): List {
  if (!Array.isArray(a)) {
    return [a];
  }

  return a;
}
