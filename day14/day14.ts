import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

enum Tile {
  Air = 0,
  Rock = 1,
  Sand = 2,
}

type Pos = {
  x: number;
  y: number;
};

function key(p: Pos): string {
  return `${p.x},${p.y}`;
}

const grid = new Map<string, Tile>();

let maxY: number = Number.MIN_SAFE_INTEGER;

// Example:
// 498,4 -> 498,6 -> 496,6
// 503,4 -> 502,4 -> 502,9 -> 494,9
for (const line of lines) {
  const segments = line.split(" -> ");
  let last: Pos | undefined;
  for (const s of segments) {
    const [tx, ty] = s.split(",").map(Number);
    if (last) {
      const dx = Math.sign(tx - last.x);
      const dy = Math.sign(ty - last.y);
      for (
        let x = last.x, y = last.y;
        x != tx + dx || y != ty + dy;
        x += dx, y += dy
      ) {
        grid.set(key({ x, y }), Tile.Rock);

        maxY = Math.max(maxY, y);
      }
    }

    last = { x: tx, y: ty };
  }
}

// Fill in the sand
let sandPlaced = 0;
let moved = true;
while (moved) {
  // Sand starts at 500,0
  let spos = { x: 500, y: 0 };

  // Try down
  while (true) {
    if (!grid.get(key({ x: spos.x, y: spos.y + 1 }))) {
      spos = { x: spos.x, y: spos.y + 1 };
    } else if (!grid.get(key({ x: spos.x - 1, y: spos.y + 1 }))) {
      spos = { x: spos.x - 1, y: spos.y + 1 };
    } else if (!grid.get(key({ x: spos.x + 1, y: spos.y + 1 }))) {
      spos = { x: spos.x + 1, y: spos.y + 1 };
    } else {
      grid.set(key(spos), Tile.Sand);
      sandPlaced++;
      break;
    }

    if (spos.y > maxY) {
      // Sand fell into the abyss
      moved = false;
      break;
    }
  }
}

console.log(sandPlaced);
