import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

type Cube = {
  x: number;
  y: number;
  z: number;
};

const xm = new Map<number, Cube[]>();
const ym = new Map<number, Cube[]>();
const zm = new Map<number, Cube[]>();

const cm = new Map<string, Cube>();

let cubes: Cube[] = [];
for (const line of lines) {
  const [x, y, z] = line.split(",").map(Number);
  const cube: Cube = {
    x,
    y,
    z,
  };
  cubes.push(cube);
  xm.set(x, [...(xm.get(x) || []), cube]);
  ym.set(y, [...(ym.get(y) || []), cube]);
  zm.set(z, [...(zm.get(z) || []), cube]);

  cm.set(key(cube), cube);
}

let freeSides = 0;
for (const cube of cubes) {
  // Left/right
  freeSides += [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ].filter(([x, y, z]) => !matchingCube(cube, x, y, z)).length;
}

console.log(freeSides);

function matchingCube(c: Cube, dx: number, dy: number, dz: number): boolean {
  return cm.has(
    key({
      x: c.x + dx,
      y: c.y + dy,
      z: c.z + dz,
    })
  );
}

function key(c: Cube): string {
  return `${c.x}-${c.y}-${c.z}`;
}
