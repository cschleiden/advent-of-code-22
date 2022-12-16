import { getLines } from "../lib/fs";

type Valve = {
  name: string;
  flowRate: number;
  tunnels: string[];
  open: boolean;
};

type Operation = {
  action: "open" | "move";
  valve: string;
};

//
// Parse input
//
let vMap = new Map<string, Valve>();
let start: Valve;

const lines = await getLines(process.argv[2]);

for (const line of lines) {
  const matches =
    /Valve (..) has flow rate=(\d+); tunnels? leads? to valves? ((.+),?)+/.exec(
      line
    );
  let v: Valve = {
    name: matches[1],
    flowRate: parseInt(matches[2]),
    tunnels: matches[3].split(", ").map((x) => x.trim()),
    open: false,
  };

  if (v.name === "AA") {
    start = v;
  }

  vMap.set(v.name, v);
}

const c = new Map<
  string,
  {
    flow: number;
    openValves: string[];
  }
>();

const { flow, openValves } = traverse(start, [], 26);
c.clear();
const { flow: flow2, openValves: openValves2 } = traverse(
  start,
  openValves,
  26
);
console.log("Max flow", flow + flow2);

function traverse(
  valve: Valve,
  openValves: string[],
  minutes: number
): {
  flow: number;
  openValves: string[];
} {
  if (minutes === 0) {
    return {
      flow: 0,
      openValves,
    };
  }

  const ckey = `${valve.name}-${minutes}-${openValves.join("")}`;
  const cache = c.get(ckey);
  if (cache !== undefined) {
    return {
      flow: cache.flow,
      openValves: cache.openValves,
    };
  }

  const options = getPossibleOptions(openValves, valve);

  let maxFlow = Number.MIN_SAFE_INTEGER;
  let maxOpenValves = openValves;

  for (const option of options) {
    let f = 0;
    let newValve = valve;
    let ov = openValves;

    if (option.action === "open") {
      f += valve.flowRate * (minutes - 1);
      ov = [...ov, valve.name];
    } else {
      // Move
      newValve = vMap.get(option.valve);
    }

    let { flow: newFlow, openValves: newOpenValves } = traverse(
      newValve,
      ov,
      minutes - 1
    );
    if (f + newFlow > maxFlow) {
      maxFlow = f + newFlow;
      maxOpenValves = newOpenValves;
    }
  }

  c.set(ckey, {
    flow: maxFlow,
    openValves: maxOpenValves,
  });

  return {
    flow: maxFlow,
    openValves: maxOpenValves,
  };
}

function getPossibleOptions(openValves: string[], valve: Valve): Operation[] {
  const options: Operation[] = [];
  if (valve.flowRate > 0 && !openValves.includes(valve.name)) {
    options.push({ action: "open", valve: valve.name });
  }

  for (const tunnel of valve.tunnels) {
    options.push({ action: "move", valve: tunnel });
  }

  return options;
}
