import { getLines } from "../lib/fs";

type List = (number | List)[];
const packets: List[] = [];

const lines = await getLines(process.argv[2]);
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l === "") {
    continue;
  }
  const a = JSON.parse(l) as List;
  packets.push(a);
}

// Add divider packets
const da = [[2]];
const db = [[6]];
packets.push(da, db);

packets.sort((a, b) => (compareLists(a, b) ? -1 : 1));

let ia = 0;
for (let i = 0; i < packets.length; i++) {
  if (packets[i] === da) {
    ia = i + 1;
  }

  if (packets[i] === db) {
    console.log(ia * (i + 1));
    break;
  }
}

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
