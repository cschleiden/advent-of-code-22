import { readFile } from "fs/promises";

const input = await readFile("input.txt", "utf-8");
const lines = input.split("\n");
