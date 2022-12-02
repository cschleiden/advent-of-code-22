import { getLines } from "../lib/fs";

const shapes = {
  A: {
    name: "Rock",
    score: 1,
  },
  B: {
    name: "Paper",
    score: 2,
  },
  C: {
    name: "Scissors",
    score: 3,
  },
  X: {
    name: "Rock",
    score: 1,
  },
  Y: {
    name: "Paper",
    score: 2,
  },
  Z: {
    name: "Scissors",
    score: 3,
  },
};

const outcome = {
  Rock: {
    Rock: 0,
    Paper: 1,
    Scissors: -1,
  },
  Paper: {
    Rock: -1,
    Paper: 0,
    Scissors: 1,
  },
  Scissors: {
    Rock: 1,
    Paper: -1,
    Scissors: 0,
  },
};

const lines = await getLines("./input.txt");

let score = 0;

for (const line of lines) {
  const [player1, player2] = line.split(" ");

  score += shapes[player2].score + calcScore(calcOutcome(player1, player2));
}

console.log(score);

function calcOutcome(player1: string, player2: string): number {
  return outcome[shapes[player1].name][shapes[player2].name];
}

function calcScore(outcome: number): number {
  switch (outcome) {
    case -1:
      return 0;
    case 0:
      return 3;
    case 1:
      return 6;
  }
}
