import { getLines } from "../lib/fs";

const lines = await getLines(process.argv[2]);

type Valve = {
  name: string;
  flowRate: number;
  tunnels: string[];
  open: boolean;
};

let vMap = new Map<string, Valve>();
let start: Valve;

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

let c = new Map<
  string,
  {
    flow: number;
    path: Operation[];
  }
>();

const { path, additionalFlow } = traverse(start, [], 30);
console.log("Max flow", additionalFlow, "Path length", path.length);
for (const p of path) {
  console.log(p.action, p.valve);
}

type Operation = {
  action: "open" | "move";
  valve: string;
};

function traverse(
  v: Valve,
  openValves: string[],
  minutes: number
): {
  path: Operation[];
  additionalFlow: number;
} {
  if (minutes <= 0) {
    // Time is up, return the flow until this point
    return {
      path: [],
      additionalFlow: 0,
    };
  }

  // We have two options, open this valve and use up a minute or move on immediately
  let shouldOpen = [false];
  if (v.flowRate > 0 && !openValves.includes(v.name)) {
    shouldOpen.unshift(true);
  }

  // Max flow for all the possible tunnels
  let maxFlow = Number.MIN_SAFE_INTEGER;
  let maxPath: Operation[] = [];

  for (const open of shouldOpen) {
    let m = minutes;
    let p = [];
    let f = 0;
    let ov = openValves;

    // Determine if we should open this valve or not
    if (open) {
      // Consume a minute for opening
      m--;

      // Mark valve as open
      ov = [...ov, v.name];
      p = [{ action: "open", valve: v.name }];

      // Calculate how much flow this valve will produce in the remaining time
      f += m * v.flowRate;
      // console.log("f", f);

      if (m === 0) {
        return {
          path: p,
          additionalFlow: f,
        };
      }
    }

    // Move to available connections
    for (const tunnel of v.tunnels) {
      const target = vMap.get(tunnel);

      let newFlow: number;
      let newPath: Operation[];

      const ckey = `${target.name}-${m}-${ov.join("")}`;
      if (c.has(ckey)) {
        const { flow, path } = c.get(ckey)!;
        newFlow = flow;
        newPath = path;
      } else {
        ({ path: newPath, additionalFlow: newFlow } = traverse(
          target,
          ov,
          m - 1
        ));

        c.set(ckey, {
          flow: newFlow,
          path: newPath,
        });
      }

      if (f + newFlow > maxFlow) {
        maxFlow = f + newFlow;
        maxPath = [
          ...p,
          {
            action: "move",
            valve: target.name,
          },
          ...newPath,
        ];
      }
    }
  }

  // console.log(
  //   maxPath.map((p) => `${p.action[0]}${p.valve}`).join(""),
  //   minutes,
  //   maxFlow
  // );

  return {
    path: maxPath,
    additionalFlow: maxFlow,
  };
}
