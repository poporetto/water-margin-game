# Song Jiang · Suikoden II sprite study

New experimental artwork based on the user's two Suikoden II references and Song Jiang's existing portrait. Generated with the built-in image generation tool.

- [Animated preview](preview.html): four directions and sword guard, pause and speed controls.
- [In-game preview](in-game.html): dedicated preview using the existing game renderer.
- [Walking PNG](songjiang-walking.png): 144 × 256, three columns and four rows (down, left, right, up).
- [Battle PNG](songjiang-battle.png): 144 × 64, three left-facing sword-guard poses.
- [Animated GIF](walk-cycle.gif): down, left, right, up, battle, in that order.

Each frame is 48 × 64. Loop order is 0, 1, 0, 2 at 200 milliseconds per pose. All feet touch row 63. Front and side figures are 54 pixels tall; back poses are 52–53 pixels tall. Battle poses crouch at 44–46 pixels. The final assets use one shared 23-colour opaque palette plus transparency. Right-facing frames exactly mirror left-facing frames.

Walking was generated as a whole sheet, followed by a correction and a separate complete side-view strip to resolve the repeated near-arm phase. Front/back opposite stride limbs were mirrored while retaining the same upper head region. Source frames were reduced with nearest-neighbour sampling at one shared scale per generated strip; head alignment and foot baselines were normalized. The original generation outputs are retained for future revisions.

This is a candidate three-pose retro walk cycle, not a higher-frame-count animation. Tiny face/costume pixel differences and the small rear-view bob can still be refined after art review. The game asset manifest has not been changed.

## Generation prompts

- [Initial walking generation](generation-prompt.txt)
- [Walking correction](walk-correction-prompt.txt)
- [Side-view correction](side-correction-prompt.txt)
- [Battle generation](battle-prompt.txt)

## Validation

Checked the final dimensions, binary transparency, shared palette limit, foot baselines, and exact left/right mirroring. See [validation.json](validation.json). The browser preview and game preview loaded with no page errors; all four direction controls and sword mode were exercised.
