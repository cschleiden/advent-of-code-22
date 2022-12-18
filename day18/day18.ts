import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

type Pos = {
  x: number;
  y: number;
  z: number;
};

type TuplePos = [x: number, y: number, z: number];

const cm = new Map<string, Pos>();
const outsideFree = new Set<string>();

let minX: number = Number.MAX_SAFE_INTEGER;
let maxX: number = Number.MIN_SAFE_INTEGER;
let minY: number = Number.MAX_SAFE_INTEGER;
let maxY: number = Number.MIN_SAFE_INTEGER;
let minZ: number = Number.MAX_SAFE_INTEGER;
let maxZ: number = Number.MIN_SAFE_INTEGER;

let cubes: Pos[] = [];
for (const line of lines) {
  const [x, y, z] = line.split(",").map(Number);
  const cube: Pos = {
    x,
    y,
    z,
  };
  cubes.push(cube);
  cm.set(key(cube), cube);

  minX = Math.min(x, minX);
  maxX = Math.max(x, maxX);
  minY = Math.min(y, minY);
  maxY = Math.max(y, maxY);
  minZ = Math.min(z, minZ);
  maxZ = Math.max(z, maxZ);
}

const s: Pos[] = [
  {
    x: minX - 1,
    y: minY - 1,
    z: minZ - 1,
  },
];
const visited = new Set<string>();
while (s.length > 0) {
  const n = s.shift();
  const k = key(n);
  if (visited.has(k)) {
    continue;
  }

  if (cm.has(k)) {
    // It's a cube
  } else {
    outsideFree.add(k);
  }

  visited.add(k);

  // Continue with neighbors
  s.push(
    ...(
      [
        [-1, 0, 0],
        [1, 0, 0],
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1],
      ] as TuplePos[]
    )
      .map((tp) => relativeCube(n, tp))
      .filter((x) => !cm.has(key(x)))
      .filter((x) => !visited.has(key(x)))
      .filter(
        (c) =>
          c.x >= minX - 1 &&
          c.x <= maxX + 1 &&
          c.y >= minY - 1 &&
          c.y <= maxY + 1 &&
          c.z >= minZ - 1 &&
          c.z <= maxZ + 1
      )
  );
}

let freeSides = 0;
for (const cube of cubes) {
  const freeNeighbors = (
    [
      [-1, 0, 0],
      [1, 0, 0],
      [0, -1, 0],
      [0, 1, 0],
      [0, 0, -1],
      [0, 0, 1],
    ] as TuplePos[]
  )
    .map((x) => relativeCube(cube, x))
    .filter((x) => outsideFree.has(key(x)));

  freeSides += freeNeighbors.length;
}

console.log(freeSides);

function relativeCube(c: Pos, [relX, relY, relZ]: TuplePos): Pos {
  return {
    x: c.x + relX,
    y: c.y + relY,
    z: c.z + relZ,
  };
}

function key(c: Pos): string {
  return `${c.x}-${c.y}-${c.z}`;
}
