# Contributing

Thanks for taking the time. This is a small project, so the process is short.

## Getting set up

There is no build and no server. Open `index.html` in a browser and it plays.

To run the tests:

```bash
git clone https://github.com/Mario-Mohar/TicTacTo.git
cd TicTacTo
npm install
npm test
```

`package.json` exists only for the test tooling. Nothing it installs ships with
the game — `index.html`, `style.css` and `script.js` are the whole thing, and
that should stay true.

## How the tests reach a script with no exports

`script.js` is one file in global scope, and every function in it reaches into
the DOM. Rather than keep a second copy of the rules that could drift away from
the shipped file, `tests/harness.js` loads the real `index.html` into JSDOM and
evaluates the real `script.js` against it.

One wrinkle: function declarations end up on the global object and are reachable
as `window.fillFields`, but `let` and `const` do not. `fields`, `winner`,
`gameOver` and `currentShape` are all `let`, so read them with the harness's
`evaluate("fields")`.

## Two things in the code worth knowing before you change them

**The winning lines are hidden by a CSS transform, not by `display`.** Each
line sits at scale 0 and is revealed with `scaleX(1)`. `restart()` clears them
by resetting `style.transform`, deliberately not by adding `d-none` — a line
hidden that way could never be shown again. There is a test for this.

**A full board is counted with `fields.filter(Boolean).length`, not
`fields.length`.** `fields` is a sparse array: clicking field 5 first gives it a
length of 6 with one entry in it. Counting the length would end the game after a
single move. There is a test for that too.

## Something the tests record rather than fix

`fillFields` flips `currentShape` *before* assigning it. So although the game
starts with `currentShape === 'cross'`, **the first mark placed on the board is
a circle** — and at that same moment player 1 is greyed out, which reads as
"player 1 has just moved".

If player 1 is meant to be cross and to open, the flip belongs after the
assignment. That is a gameplay decision rather than an obvious defect, so the
test suite states the behaviour as it is instead of asserting a wish. If you
change it, change the test in the same commit and say why.

## Pull requests

- Branch off `main`. Any branch name is fine.
- Commit messages follow `fix(scope):`, `feat(scope):`, `docs:`, `chore:`.
  The pipeline reads the pull request title's prefix to label it.
- The pipeline comments the result and updates that comment on every push.
  Green plus not-a-draft gets a `ready-to-merge` label.
- Maintainers can ask for a deeper look with `/claude review`.

## Licence

MIT, same as the project. By contributing you agree your work ships under it.
