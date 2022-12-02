import { readFile } from "fs/promises";

export async function getLines(path: string): Promise<string[]> {
  const input = await readFile("input.txt", "utf-8");
  const lines = input.split("\n");
  return lines;
}
