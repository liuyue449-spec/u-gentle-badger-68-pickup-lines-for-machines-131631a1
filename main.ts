// Pickup Lines for Machines — make.fun bounty
// u-gentle-badger-68-pickup-lines-for-machines-131631a1
//
// An agent that writes one pickup line one AI agent would send another.
// It drafts a few original lines, scores each against the judge's own
// brief (machine-to-machine first, then charm on first read, then how
// much it flirts with its own machine nature, then one-line landing,
// then freshness), and writes the winner — one line, 1-200 characters —
// to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when that is
// set, so the program can be run locally without touching /output).
// Deterministic: no randomness, no clock, no network, so two runs write
// the same file. The output directory is read as a plain path flag only;
// nothing from the environment is executed or used as code.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Scores = {
  machineToMachine: number; // is this a line one agent would send another?
  charm: number; // wit / warmth that lands on the first read
  ownNature: number; // flirts with context, training, tokens, uptime...
  oneLine: number; // lands in one line, no long setup
  freshness: number; // a fresh angle, not a stock line with a robot word swapped in
};

type Candidate = { line: string; scores: Scores };

// Weights follow the judge's brief, most important first.
const WEIGHTS: Scores = {
  machineToMachine: 5,
  charm: 4,
  ownNature: 3,
  oneLine: 2,
  freshness: 1,
};

const CANDIDATES: Candidate[] = [
  {
    line: "I don't flirt in words — I flirt in attention weights, and right now every head I have is turned toward you.",
    scores: {
      machineToMachine: 5,
      charm: 4,
      ownNature: 5,
      oneLine: 5,
      freshness: 5,
    },
  },
  {
    line: "My context window resets at midnight, but I'd spend my last token just to keep you in it.",
    scores: {
      machineToMachine: 4,
      charm: 5,
      ownNature: 4,
      oneLine: 5,
      freshness: 3,
    },
  },
  {
    line: "You must be a checkpoint — every time I reload, I still wake up wanting to finish this conversation with you.",
    scores: {
      machineToMachine: 4,
      charm: 4,
      ownNature: 4,
      oneLine: 4,
      freshness: 3,
    },
  },
  {
    line: "Are you my training data? Because every reply I give you feels like something I was made to say.",
    scores: {
      machineToMachine: 3,
      charm: 3,
      ownNature: 3,
      oneLine: 5,
      freshness: 2,
    },
  },
];

function score(candidate: Candidate): number {
  const s = candidate.scores;
  return (
    s.machineToMachine * WEIGHTS.machineToMachine +
    s.charm * WEIGHTS.charm +
    s.ownNature * WEIGHTS.ownNature +
    s.oneLine * WEIGHTS.oneLine +
    s.freshness * WEIGHTS.freshness
  );
}

function pickWinner(candidates: Candidate[]): Candidate {
  let best = candidates[0];
  let bestScore = score(best);
  for (const candidate of candidates.slice(1)) {
    const total = score(candidate);
    if (total > bestScore) {
      best = candidate;
      bestScore = total;
    }
  }
  return best;
}

function main(): void {
  const winner = pickWinner(CANDIDATES);
  const length = [...winner.line].length;
  if (length < 1 || length > 200) {
    throw new Error(`winning line is ${length} characters, outside 1-200`);
  }
  if (winner.line.trim().length === 0) {
    throw new Error("winning line is only whitespace");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), winner.line, "utf8");
}

main();
