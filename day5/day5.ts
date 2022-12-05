import { getLines } from "../lib/fs";

const { stacks, operations } = await readInput(process.argv[2]);

// Apply operations
for (const operation of operations) {
  const tmp = stacks[operation.from - 1].splice(0, operation.move);
  stacks[operation.to - 1].unshift(...tmp);
}

const result = stacks.map((s) => s[0]).join("");
console.log(result);

///

type Operation = {
  move: number;
  from: number;
  to: number;
};

async function readInput(
  path: string
): Promise<{ stacks: string[][]; operations: Operation[] }> {
  const lines = await getLines(path);

  const stacks: string[][] = [];
  const operations: Operation[] = [];

  let l = 0;
  for (; l < lines.length; ++l) {
    const line = lines[l];
    if (line.trim() === "") {
      // End of stacks
      break;
    }

    for (let i = 0; i < line.length; i += 4) {
      if (!stacks[i / 4]) {
        stacks[i / 4] = [];
      }

      const t = line.substring(i, i + 4);
      if (t.trim() === "1") {
        break;
      }

      if (t.trim() === "") {
        // Empty slot
        continue;
      }

      // Skip `[`]
      stacks[i / 4].push(t[1]);
    }
  }

  // Skip empty line
  ++l;

  // Parse operations
  for (; l < lines.length; ++l) {
    const line = lines[l];
    if (line.trim() === "") {
      // End of stacks
      break;
    }

    const [, move, , from, , to] = line.split(" ");
    operations.push({
      move: parseInt(move),
      from: parseInt(from),
      to: parseInt(to),
    });
  }

  return {
    stacks,
    operations,
  };
}
