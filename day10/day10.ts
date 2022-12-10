import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

const commands = {
  addx: {
    cycles: 2,
  },
  noop: {
    cycles: 1,
  },
};

let regX = 1;
let cycle = 0;

let signal = 0;

let output = [];
for (const line of lines) {
  const [command, value] = line.split(" ");

  const { cycles } = commands[command];
  for (let i = 0; i < cycles; i++) {
    // Draw
    const pixel = cycle % 40;
    if (regX - 1 <= pixel && pixel <= regX + 1) {
      output.push("#");
    } else {
      output.push(".");
    }
    if (output.length >= 40) {
      console.log(output.join(""));
      output = [];
    }

    cycle++;
    if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
      // console.log(cycle, regX);
      signal += cycle * regX;
    }

    if (command === "addx" && i === cycles - 1) {
      regX += parseInt(value);
    }
  }
}

console.log("Signal", signal);
