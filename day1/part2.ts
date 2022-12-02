import { readFile } from "fs/promises";

const input = await readFile("input.txt", "utf-8");
const lines = input.split("\n");

const elves = new Map<number, number>();

let elf = 1;

for (const line of lines) {
  if (line.trim() === "") {
    elf++;
  } else {
    const calories = parseInt(line);
    elves.set(elf, (elves.get(elf) || 0) + calories);
  }
}

console.log(
  "Top 3 elf calories sum",
  Array.from(elves.values())
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a + b, 0)
);
