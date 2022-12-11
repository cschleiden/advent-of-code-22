import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

let worry = 0;

type Monkey = {
  items: number[];
  operation: (x: number) => number;
  divBy: number;
  ifTrue: number;
  ifFalse: number;
  inspected: number;
};
const monkeys: Monkey[] = [];

let m = 0;
while (m < lines.length) {
  m++; // Skip monkey line
  const mo = {
    inspected: 0,
  } as Monkey;
  monkeys.push(mo);
  mo.items = lines[m++]
    .slice("  Starting items: ".length)
    .split(", ")
    .map(Number);

  // Operation
  const op = lines[m++].slice("  Operation: new = old ".length);
  const ops = op.split(" ");
  mo.operation = (x: number) => {
    switch (ops[0]) {
      case "*":
        return x * (ops[1] === "old" ? x : Number(ops[1]));

      case "+":
        return x + (ops[1] === "old" ? x : Number(ops[1]));
    }
  };

  // Test
  mo.divBy = parseInt(lines[m++].slice("  Test: divisible by ".length));
  mo.ifTrue = parseInt(
    lines[m++].slice("    If true: throw to monkey ".length)
  );
  mo.ifFalse = parseInt(
    lines[m++].slice("    If false: throw to monkey ".length)
  );

  // Skip empty line
  m++;
}

const rounds = 20;

for (let r = 0; r < rounds; r++) {
  for (const m of monkeys) {
    if (m.items.length === 0) {
      continue;
    }

    // Inspect items
    while (m.items.length > 0) {
      m.inspected++;
      const item = m.items.shift()!;
      let newWorry = m.operation(item);
      newWorry = Math.floor(newWorry / 3); // Get bored
      // Check where to send
      if (newWorry % m.divBy === 0) {
        monkeys[m.ifTrue].items.push(newWorry);
      } else {
        monkeys[m.ifFalse].items.push(newWorry);
      }
    }
  }

  console.log("Round done");
}

// Find two most active ones
monkeys.sort((a, b) => b.inspected - a.inspected);
console.log(monkeys[0].inspected * monkeys[1].inspected);
