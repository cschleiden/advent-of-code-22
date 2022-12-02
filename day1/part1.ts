import { readFile } from "fs/promises";

const input = await readFile("input.txt", "utf-8");
const lines = input.split("\n");

const elves = new Map<number, number>();

let elf = 1;
let elfIdx = -1;
let elfMax = -1;

for (const line of lines) {
  if (line.trim() === "") {
    const max = elves.get(elf);
    if (max > elfMax) {
      elfMax = max;
      elfIdx = elf;
    }
    elf++;
  } else {
    const calories = parseInt(line);
    elves.set(elf, (elves.get(elf) || 0) + calories);
  }
}

console.log("Elf:", elfIdx, "Calories:", elfMax);
