# Contributing

## Contributions are welcome

This is a small project maintained by one person in his spare time, and that is
exactly why an outside pair of eyes is worth a lot. **Finding a bug and writing
it down is a real contribution** — arguably the most useful one, because I only
ever use this on my own machine, with my own setup, and most of what is broken
is broken somewhere I never look.

Three ways to help, in the order of what they cost you:

### 1. Report something that is wrong

Open an issue with the **Bug report** template. It asks for what it does because
each field is something I would otherwise have to come back and ask for, which
costs us both a day.

What actually decides whether a report is useful:

- **What you expected, and what happened instead.** Both halves. "It does not
  work" is the one report I cannot act on.
- **The steps that get there.** If you can reproduce it, say how. If it only
  happened once, say that too — an intermittent bug is still worth knowing about,
  and "I could not reproduce it" is useful information rather than a
  disqualification.
- **Your setup**, as the template asks for it.

Do not polish it. A rough report today beats a perfect one that never gets
written. If in doubt whether something counts as a bug: open it. Deciding that
is my job, not yours.

### 2. Suggest something it should do

Open an issue with the **Feature request** template.

It asks what you are trying to *achieve* before what you want built, and that is
deliberate — not a hoop. Roughly half the time there turns out to be a simpler
answer than the one either of us had in mind, and it only surfaces if I know the
underlying situation.

A wish that gets declined is not a wasted issue. "Not now" and "not in this
project" are answers you will get quickly and with a reason.

### 3. Send a fix or a feature

Very welcome, and you do not need to ask permission for something small.

**For anything bigger than a few lines, open an issue first** — or comment on
the existing one — and say you are working on it. It costs you a sentence and
saves you the case where I fixed the same thing that evening, or where I would
have wanted it solved differently.

Because you cannot push to this repository, the route is through a fork:

```bash
# 1. Fork it on GitHub, then clone your fork
git clone https://github.com/<your-username>/TicTacTo.git
cd TicTacTo

# 2. A branch. Any name.
git switch -c fix/the-thing

# 3. Change what you came for, then run the checks below

# 4. Push to your fork and open the pull request
git push -u origin fix/the-thing
```

GitHub then offers you the pull request button. Fill in the template, and if it
closes an issue write `Fixes #12` so it closes itself on merge.

## What happens after you send it

1. **The pipeline runs** and posts a comment on your pull request with a table
   of what passed. It updates that same comment on every push, so there is one
   place to look rather than a growing pile.
2. **It labels the pull request** by size and type, and adds `ready-to-merge`
   once everything is green.
3. **On your very first contribution here, the checks wait for me to release
   them.** GitHub does that by default so that a stranger's code cannot use the
   runners unasked. If your pull request sits at "waiting for approval",
   **nothing is broken and you do not need to do anything** — I have to click
   once.
4. **I do the merging.** The default branch takes nothing that has not been
   through a pull request with green checks, and that holds for my own commits
   too.

If a check is red, the run log says which one and why. Ask in the pull request
if it is not obvious — a red pipeline is not a rejection, and quite often it is
the pipeline that is wrong rather than you.

I do this beside a job, so a reply can take a few days. It is not disinterest.

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

- Branch off `main` **in your fork** (see above). Any branch name is fine.
- Commit messages follow `fix(scope):`, `feat(scope):`, `docs:`, `chore:`.
  The pipeline reads the pull request title's prefix to label it.
- The pipeline comments the result and updates that comment on every push.
  Green plus not-a-draft gets a `ready-to-merge` label.
- Maintainers can ask for a deeper look with `/claude review`.

## Licence

MIT, same as the project. By contributing you agree your work ships under it.
