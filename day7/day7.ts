import { getLines } from "../lib/fs";

type Entry = {
  kind: "file" | "directory";

  name: string;

  size?: number;

  entries?: Entry[];
};

const root: Entry = {
  kind: "directory",
  name: "/",
  entries: [],
};

let current = [root];

const lines = await getLines(process.argv[2]);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line === "$ cd /") {
    continue;
  }

  const entry = current[current.length - 1];

  switch (line.substring(0, 4)) {
    case "$ cd": {
      const dest = line.substring(5);
      if (dest === "..") {
        current.pop();
        continue;
      }

      current.push(entry.entries.find((entry) => entry.name === dest));
      continue;
    }

    case "$ ls": {
      while (i + 1 < lines.length && lines[i + 1][0] !== "$") {
        const l = lines[++i];
        const [sizeOrKind, ...name] = l.split(" ");
        if (sizeOrKind === "dir") {
          entry.entries.push({
            kind: "directory",
            name: name.join(""),
            entries: [],
          });
        } else {
          entry.entries.push({
            kind: "file",
            name: name.join(""),
            size: parseInt(sizeOrKind),
          });
        }
      }
      break;
    }
  }
}

let r: Entry[] = [];

const s = [root];
while (s.length > 0) {
  const n = s.pop();

  if (n.kind === "directory") {
    if (n.size !== undefined) {
      if (n.size < 100_000) {
        r.push(n);
        continue;
      }
    }

    if (n.entries?.every((x) => x.size !== undefined)) {
      n.size = dirSize(n);
      if (n.size < 100_000) {
        r.push(n);
        continue;
      }
    } else {
      s.push(n);
      s.push(...n.entries.filter((x) => x.kind === "directory"));
    }
  }
}

console.log(r.reduce((a, e) => a + e.size, 0));

function dirSize(dir: Entry): number {
  return dir.entries.reduce(
    (acc, entry) => acc + (entry.kind === "file" ? entry.size : dirSize(entry)),
    0
  );
}
