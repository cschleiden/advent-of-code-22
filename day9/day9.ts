import { getLines } from "../lib/fs";
const lines = await getLines(process.argv[2]);

type Pos = [x: number, y: number];
type Direction = "R" | "L" | "U" | "D";
const visited = new Set<string>();

const numKnots = 10;
let knots: Pos[] = [];
for (let i = 0; i < numKnots; i++) {
  knots.push([0, 0]);
}

visited.add(`${knots[knots.length - 1][0]}-${knots[knots.length - 1][1]}`);

for (const line of lines) {
  const [direction, stepsS] = line.split(" ");
  const steps = parseInt(stepsS);

  // console.log(direction, " ", steps);

  for (let i = 0; i < steps; i++) {
    knots[0] = move(direction as Direction, knots[0]);

    // print(head, tail);

    for (let j = 1; j < knots.length; j++) {
      knots[j] = updateKnot(knots[j], knots[j - 1]);
    }

    visited.add(`${knots[knots.length - 1][0]}-${knots[knots.length - 1][1]}`);

    // print(head, tail);
    // console.log("=====");
  }
}

console.log("Visited", visited.size);

function print(head: Pos, tail: Pos) {
  const xmin = Math.min(head[0], tail[0]);
  const xmax = Math.max(head[0], tail[0]);
  const ymin = Math.min(head[1], tail[1]);
  const ymax = Math.max(head[1], tail[1]);

  for (let y = ymin; y <= ymax; y++) {
    const b = [];
    for (let x = xmin; x <= xmax; x++) {
      if (x === head[0] && y === head[1]) {
        b.push("H");
      } else if (x === tail[0] && y === tail[1]) {
        b.push("T");
      } else if (visited.has(`${x}-${y}`)) {
        b.push("#");
      } else {
        b.push(".");
      }
    }
    console.log(b.join(""));
  }

  console.log("-");
}

function move(direction: Direction, pos: Pos): Pos {
  switch (direction) {
    case "R":
      return [pos[0] + 1, pos[1]];
    case "L":
      return [pos[0] - 1, pos[1]];
    case "U":
      return [pos[0], pos[1] - 1];
    case "D":
      return [pos[0], pos[1] + 1];
  }
}

function updateKnot(tail: Pos, head: Pos): Pos {
  const newTail = [...tail] as Pos;

  const xdiff = head[0] - tail[0];
  const ydiff = head[1] - tail[1];

  if (Math.abs(xdiff) > 1 && ydiff === 0) {
    newTail[0] += Math.sign(xdiff);
  } else if (xdiff === 0 && Math.abs(ydiff) > 1) {
    newTail[1] += Math.sign(ydiff);
  } else if (Math.abs(xdiff) > 1 || Math.abs(ydiff) > 1) {
    // Diagonal
    newTail[0] += Math.sign(xdiff);
    newTail[1] += Math.sign(ydiff);
  }

  return newTail;
}
