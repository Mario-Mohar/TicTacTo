/**
 * The game rules in script.js.
 *
 * Everything here reaches into the DOM, so the tests load the real index.html
 * and the real script.js rather than a copy of the logic. The board state lives
 * in `fields`, declared with `let` and therefore not on the global object --
 * the harness's evaluate() reads it.
 */

import { describe, it, expect } from "vitest";
import { loadApp } from "./harness.js";

/** Play a sequence of field indices in order. */
function play(window, ...moves) {
  for (const move of moves) {
    window.fillFields(move);
  }
}

function state(evaluate) {
  return {
    fields: evaluate("fields"),
    winner: evaluate("winner"),
    gameOver: evaluate("gameOver"),
    currentShape: evaluate("currentShape"),
  };
}

/** Which of the eight win lines are currently drawn. */
function drawnLines(window) {
  const drawn = [];
  for (let i = 1; i <= 8; i++) {
    const transform = window.document.getElementById(`line-${i}`).style.transform;
    if (transform && transform.includes("scaleX(1)")) drawn.push(i);
  }
  return drawn;
}

describe("taking turns", () => {
  it("alternates between the two shapes", () => {
    const { window, evaluate } = loadApp();
    play(window, 0, 1, 2);
    const { fields } = state(evaluate);
    expect(fields[0]).not.toBe(fields[1]);
    expect(fields[0]).toBe(fields[2]);
  });

  it("ignores a click on a field that is already taken", () => {
    const { window, evaluate } = loadApp();
    play(window, 4);
    const first = evaluate("fields")[4];
    play(window, 4);

    expect(evaluate("fields")[4]).toBe(first);
    // The turn must not pass either, or the second player loses a move.
    play(window, 0);
    expect(evaluate("fields")[0]).not.toBe(first);
  });

  it("places the first mark as a circle, and marks player 1 inactive", () => {
    // Recorded as it is, not as it perhaps ought to be. fillFields flips
    // currentShape *before* assigning it, so although the game starts with
    // currentShape === 'cross', the first mark on the board is a circle -- and
    // at the same moment player1 is greyed out, which reads as "player 1 has
    // just moved". If player 1 is meant to be cross and to open, the flip
    // belongs after the assignment. Changing that is a gameplay decision, so
    // this test states the current behaviour rather than asserting a wish.
    const { window, evaluate } = loadApp();
    play(window, 0);

    expect(evaluate("fields")[0]).toBe("circle");
    expect(window.document.getElementById("player1").classList.contains("player-inactive")).toBe(true);
    expect(window.document.getElementById("player2").classList.contains("player-inactive")).toBe(false);
  });

  it("shows the mark that was placed", () => {
    const { window } = loadApp();
    play(window, 3);
    expect(window.document.getElementById("circle-3").classList.contains("d-none")).toBe(false);
    expect(window.document.getElementById("cross-3").classList.contains("d-none")).toBe(true);
  });

  it("accepts no further moves once the game is over", () => {
    const { window, evaluate } = loadApp();
    play(window, 0, 3, 1, 4, 2);          // top row to the opener
    expect(evaluate("gameOver")).toBe(true);

    const before = [...evaluate("fields")];
    play(window, 8);
    expect(evaluate("fields")).toEqual(before);
  });
});

describe("winning lines", () => {
  // Each entry: the three fields of the line, and the line element it draws.
  const lines = [
    { name: "top row", cells: [0, 1, 2], line: 1 },
    { name: "middle row", cells: [3, 4, 5], line: 2 },
    { name: "bottom row", cells: [6, 7, 8], line: 3 },
    { name: "left column", cells: [0, 3, 6], line: 4 },
    { name: "middle column", cells: [1, 4, 7], line: 5 },
    { name: "right column", cells: [2, 5, 8], line: 6 },
    { name: "top-left diagonal", cells: [0, 4, 8], line: 7 },
    { name: "top-right diagonal", cells: [2, 4, 6], line: 8 },
  ];

  /** Fill the board directly so a line can be tested without a legal game. */
  function board(evaluate, assignments) {
    for (const [index, shape] of Object.entries(assignments)) {
      evaluate(`fields[${index}] = ${JSON.stringify(shape)}`);
    }
  }

  it.each(lines)("recognises the $name and draws line $line", ({ cells, line }) => {
    const { window, evaluate } = loadApp();
    board(evaluate, Object.fromEntries(cells.map((c) => [c, "cross"])));
    window.checkForWin();

    expect(evaluate("winner")).toBe("cross");
    expect(evaluate("gameOver")).toBe(true);
    expect(drawnLines(window)).toContain(line);
  });

  it("draws only the line that was actually won", () => {
    const { window, evaluate } = loadApp();
    board(evaluate, { 0: "cross", 1: "cross", 2: "cross" });
    window.checkForWin();
    expect(drawnLines(window)).toEqual([1]);
  });

  it("does not see a win in three empty cells", () => {
    // Every comparison is guarded by a truthiness check on the first cell,
    // because undefined === undefined would otherwise be a winning row.
    const { window, evaluate } = loadApp();
    window.checkForWin();

    expect(evaluate("winner")).toBeNull();
    expect(evaluate("gameOver")).toBe(false);
    expect(drawnLines(window)).toEqual([]);
  });

  it("does not see a win in a partly filled line", () => {
    const { window, evaluate } = loadApp();
    board(evaluate, { 0: "cross", 1: "cross" });
    window.checkForWin();
    expect(evaluate("winner")).toBeNull();
  });

  it("does not see a win in a mixed line", () => {
    const { window, evaluate } = loadApp();
    board(evaluate, { 0: "cross", 1: "circle", 2: "cross" });
    window.checkForWin();
    expect(evaluate("winner")).toBeNull();
  });
});

describe("a drawn game", () => {
  it("ends when all nine fields are taken and nobody has three", () => {
    const { window, evaluate } = loadApp();
    // circle o, cross x, in placement order:
    //  o x o
    //  o x x
    //  x o o
    evaluate(`fields[0] = "circle"; fields[1] = "cross"; fields[2] = "circle";
              fields[3] = "circle"; fields[4] = "cross"; fields[5] = "cross";
              fields[6] = "cross";  fields[7] = "circle"; fields[8] = "circle";`);
    window.checkForWin();

    expect(evaluate("winner")).toBeNull();
    expect(evaluate("gameOver")).toBe(true);
  });

  it("counts filled fields rather than the array length", () => {
    // fields is sparse: clicking field 5 first leaves length 6 with one entry.
    // Counting length would call that a full board.
    const { window, evaluate } = loadApp();
    play(window, 5);

    expect(evaluate("fields").length).toBe(6);
    expect(evaluate("gameOver")).toBe(false);
  });
});

describe("restart", () => {
  it("clears the board, the winner and the turn", () => {
    const { window, evaluate } = loadApp();
    play(window, 0, 3, 1, 4, 2);
    expect(evaluate("gameOver")).toBe(true);

    window.restart();
    const after = state(evaluate);
    expect(after.fields).toEqual([]);
    expect(after.winner).toBeNull();
    expect(after.gameOver).toBe(false);
    expect(after.currentShape).toBe("cross");
  });

  it("takes the winning line off the board", () => {
    const { window } = loadApp();
    play(window, 0, 3, 1, 4, 2);
    expect(drawnLines(window).length).toBeGreaterThan(0);

    window.restart();
    expect(drawnLines(window)).toEqual([]);
  });

  it("hides every mark again", () => {
    const { window } = loadApp();
    play(window, 0, 1, 2);
    window.restart();

    for (let i = 0; i < 9; i++) {
      expect(window.document.getElementById(`circle-${i}`).classList.contains("d-none")).toBe(true);
      expect(window.document.getElementById(`cross-${i}`).classList.contains("d-none")).toBe(true);
    }
  });

  it("clears the lines by transform, never by display", () => {
    // The lines are invisible through a CSS scale of 0, not through d-none.
    // Hiding one with d-none would mean it could never be shown again.
    const { window } = loadApp();
    play(window, 0, 3, 1, 4, 2);
    window.restart();

    for (let i = 1; i <= 8; i++) {
      const line = window.document.getElementById(`line-${i}`);
      expect(line.classList.contains("d-none")).toBe(false);
      expect(line.style.transform).toBe("");
    }
  });

  it("lets a new game be played after a finished one", () => {
    const { window, evaluate } = loadApp();
    play(window, 0, 3, 1, 4, 2);
    window.restart();
    play(window, 8);

    expect(evaluate("fields")[8]).toBeDefined();
    expect(evaluate("gameOver")).toBe(false);
  });
});
