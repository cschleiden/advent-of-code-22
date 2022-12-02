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
  const [player1, desiredOutcome] = line.split(" ");

  let player2: string = "";

  switch (desiredOutcome) {
    case "X": // Lose
      switch (shapes[player1].name) {
        case "Rock":
          player2 = "C";
          break;
        case "Paper":
          player2 = "A";
          break;
        case "Scissors":
          player2 = "B";
          break;
      }
      break;

    case "Y": // Draw
      player2 = player1;
      break;

    case "Z": // Win
      switch (shapes[player1].name) {
        case "Rock":
          player2 = "B";
          break;
        case "Paper":
          player2 = "C";
          break;
        case "Scissors":
          player2 = "A";
          break;
      }
      break;
  }

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
