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

const c = new Map<
  string,
  {
    rockIdx: number;
    jetIdx: number;
    tallestRock: number;
    r: number;
  }
>();

let jetIdx = 0;
const goal = 1_000_000_000_000;
let tallestRockAdjust = -1;
for (let r = 0; r < goal; r++) {
  const rockIdx = r % rocks.length;
  const rockToFall = rocks[rockIdx];

  let x = 2;
  let y = b.tallestRock + rockToFall.length + 3;

  // draw(b, rockToFall, x, y);

  ({ x, y, jetIdx } = placeRock(x, y, rockToFall, jetIdx));

  b.tallestRock = Math.max(y, b.tallestRock);

  // Calculate fingerprint
  const fp = calcFingerPrint();

  // Cache
  if (fp != null && tallestRockAdjust <= 0) {
    const ckey = `${rockIdx}-${jetIdx % jets.length}-${fp.join(",")}`;
    if (c.has(ckey)) {
      const cached = c.get(ckey);

      const remaining = goal - r;
      const deltaR = r - cached.r;
      const iterationsToSkip = Math.floor(remaining / deltaR);
      const toSkip = iterationsToSkip * deltaR;
      r += toSkip;

      const deltaRock = b.tallestRock - cached.tallestRock;
      tallestRockAdjust = iterationsToSkip * deltaRock;

      console.log("Skipping", "from", r, "plus", toSkip, deltaRock);
    } else {
      c.set(ckey, {
        rockIdx,
        jetIdx,
        tallestRock: b.tallestRock,
        r,
      });
    }
  }
}

console.log(b.tallestRock + 1 + tallestRockAdjust);

function calcFingerPrint() {
  const fp = [];
  for (let x = 0; x < b.width; x++) {
    let top = -1;
    for (let y = b.tallestRock; y >= 0; y--) {
      if (b.blocked.get(`${x},${y}`)) {
        top = b.tallestRock - y;
        break;
      }
    }
    if (top === -1) {
      return null;
    }

    fp.push(top);
  }
  return fp;
}

function placeRock(x: number, y: number, rockToFall: Rock, jetIdx: number) {
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
  for (let i = 0; i < rockToFall.length; i++) {
    for (let j = 0; j < rockToFall[i].length; j++) {
      if (rockToFall[i][j] === "#") {
        b.blocked.set(`${x + j},${y - i}`, true);
      }
    }
  }
  return { x, y, jetIdx };
}

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
