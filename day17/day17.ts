import { getLines } from "../lib/fs";

type Rock = string[];

enum CollisionResult {
  Move,
  Ignore,
  Stop,
}

const rocks: Rock[] = [
  ["####"],
  [".#.", "###", ".#."],
  ["..#", "..#", "###"],
  ["#", "#", "#", "#"],
  ["##", "##"],
];

const lines = await getLines(process.argv[2]);
const line = lines[0];
const jets = line.split("");

type Board = {
  tallestRock: number;
  width: number;
  blocked: Map<string, boolean>;
};

const b: Board = {
  tallestRock: -1,
  width: 7,
  blocked: new Map(),
};

let jetIdx = 0;
for (let r = 0; r < 2022; r++) {
  const rockToFall = rocks[r % rocks.length];

  let x = 2;
  let y = b.tallestRock + rockToFall.length + 3;

  // draw(b, rockToFall, x, y);

  let s = 0;
  while (true) {
    let dx = 0;
    let dy = 0;
    const down = s % 2 !== 0;
    if (!down) {
      // Jet
      const jet = jets[jetIdx % jets.length];
      // console.log(jet);
      switch (jet) {
        case ">":
          dx = 1;
          break;

        case "<":
          dx = -1;
          break;
      }
      ++jetIdx;
    } else {
      dy = -1;
    }

    const c = collision(down, x + dx, y + dy, rockToFall, b);
    if (c === CollisionResult.Stop) {
      break;
    } else if (c === CollisionResult.Ignore) {
      // Ignore
    } else {
      x += dx;
      y += dy;
    }

    s++;
  }

  // Commit block to board
  b.tallestRock = Math.max(y, b.tallestRock);
  for (let i = 0; i < rockToFall.length; i++) {
    for (let j = 0; j < rockToFall[i].length; j++) {
      if (rockToFall[i][j] === "#") {
        b.blocked.set(`${x + j},${y - i}`, true);
      }
    }
  }
}

console.log(b.tallestRock + 1);

function draw(b: Board, r?: Rock, rx?: number, ry?: number) {
  let sy = b.tallestRock + 3;
  if (r) {
    sy = ry;
  }

  for (let y = sy; y >= 0; y--) {
    let line = "";
    for (let x = 0; x < b.width; x++) {
      if (
        r &&
        y <= ry &&
        y >= ry - r.length &&
        x >= rx &&
        x <= rx + r[0].length
      ) {
        if (r[ry - y] && r[ry - y][x - rx]) {
          line += r[ry - y][x - rx];
          continue;
        }
      }

      if (b.blocked.get(`${x},${y}`)) {
        line += "#";
      } else {
        line += ".";
      }
    }

    console.log(line);
  }
  console.log("");
}

function collision(
  down: boolean,
  x: number,
  y: number,
  r: Rock,
  b: Board
): CollisionResult {
  // Check outer edges
  if (x + r[0].length > b.width) {
    return CollisionResult.Ignore;
  }

  if (x < 0) {
    return CollisionResult.Ignore;
  }

  // Check rock collisions
  for (let i = 0; i < r.length; i++) {
    for (let j = 0; j < r[i].length; j++) {
      if (r[i][j] === "#") {
        if (b.blocked.get(`${x + j},${y - i}`)) {
          return down ? CollisionResult.Stop : CollisionResult.Ignore;
        }

        if (y - i < 0) {
          return CollisionResult.Stop;
        }
      }
    }
  }

  return CollisionResult.Move;
}
