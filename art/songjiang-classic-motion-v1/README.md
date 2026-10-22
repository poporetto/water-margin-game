# Song Jiang — Classic movement

Uses the approved [original Classic reference](../songjiang-style-variations-v8/variant-a-original.png), with its original head proportions. The shared style and preparation rules are saved in [sprite-workflow.md](../sprite-workflow.md) and [AGENTS.md](../AGENTS.md).

## Preview

Open [the game-location preview](in-game.html) to inspect movement on the tavern interior, marsh tavern, or Liangshan courtyard backgrounds. Choose a direction, use the arrow keys to move within the preview area, or pause and step through frames. The pose selector also offers the approved original standing sprite for comparison and the single battle pose.

[Sheet preview](preview.html) · [Animated four-direction comparison](walk-cycle.gif)

## Assets

| File | Format |
| --- | --- |
| [songjiang-walking.png](songjiang-walking.png) | Transparent 288×512 sheet; 96×128 cells. Rows: down, left, right, up. Columns: stand, stride A, stride B. |
| [songjiang-battle.png](songjiang-battle.png) | Transparent 192×128 image; one static, dynamic sword pose facing left. |
| [frames.json](frames.json) | Layout, scale, timing, and source bounds. |

Walking plays columns **0 → 1 → 0 → 2** at five steps per second. The right-facing row is an exact mirror of the left-facing row. Front and back stride B were corrected mechanically from stride A to alternate the leading limbs; the front correction preserves the head and central asymmetric costume details. Small generated differences between poses remain available for visual review.

Preparation retains the source colours, uses a shared nearest-neighbour scale across walking frames, and aligns feet to the bottom of each cell. The preview uses the approved 4× drawing buffer to retain detail at the intended world size. The wider battle canvas fits the sword without squeezing the figure. Its single image is repeated only in memory for compatibility with the preview's legacy renderer.

These are review assets; production sprite manifests have not been changed.

## Generation record

- Walking: [initial prompt](walking-prompt.txt), [refinement prompt](walking-refinement-prompt.txt), [first draft](walking-first-draft.png), [latest raw source](walking-raw.png).
- Battle: [initial prompt](battle-prompt.txt), [cleanup prompt](battle-cleanup-prompt.txt), [draft](battle-draft.png), [latest raw source](battle-raw.png).
- Packaging: [prepare.cjs](prepare.cjs).

## Verification

[Image checks](validation.json) confirm dimensions, distinct stride phases, shared foot baseline, mirrored right-facing frames, and one battle frame. [Browser checks](browser-checks.json) passed all four animation phases and directions, pause/step, keyboard movement, the original standing comparison, three backgrounds, and the static left-facing battle mode, with no page errors.

Screenshots: [walking](walking-in-game.png), [battle](battle-in-game.png).
