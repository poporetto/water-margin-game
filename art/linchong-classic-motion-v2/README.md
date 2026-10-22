# Lin Chong tone revision — work in progress

The user reported tone changes in the instructor front, exile left and exile back walking loops. Only the six stride frames in those rows are in scope. Approved neutral frames and the other five rows remain exact copies of motion v1.

Image-generation edits and their prompts are retained here. Several passes improved hair/trouser values, but later targeted mantle edits also shifted unrelated tones. These generated candidates are NOT a confirmed fix and are not installed in production. Do not treat the current `*-raw.png` or preview as approved.

`check-tones.cjs` measures 10th/50th/90th luminance percentiles by approximate material and body region. Unlike the previous median-cloth check, this exposes the lighter hair and trousers. These are diagnostics, not proof of perceptual colour matching; the region-based skin sample in back views is especially limited.

The user explicitly authorized deterministic colour-only correction on 22 October 2026. That correction is in `../linchong-classic-motion-v3/`, starting from the six ORIGINAL v1 stride frames. This folder retains superseded imagegen experiments.

Source generation used the built-in image tool. Input canvases: `*-edit.png`; prompts: `*-prompt.txt`; retained passes: `*-tone-first.png`, `*-shadow-pass.png`, `*-cool-pass.png`, `*-balance-pass.png` where applicable. `pack.cjs` prepares provisional candidates only. `tone-comparison.json` records remaining mismatches.
