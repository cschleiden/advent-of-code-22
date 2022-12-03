import { readFile } from "fs/promises";

export async function getLines(path: string): Promise<string[]> {
  const input = await readFile(path, "utf-8");
  const lines = input.split("\n");
  return lines;
}
