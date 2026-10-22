# Song Jiang walking v4

Updated v3 with a one-pixel downward translation of head, neck and torso on each stride, keeping foot placement unchanged. No resizing is applied. All four directions retain the same head shape as their idle frames.

The built-in image generator corrected the front-facing right-eye artifact. Only its registered eye region is composited into the original sprite and mapped back to the original palette. Source output: eye-edit.png. All other face pixels are retained.

Prompt: Correct only the black tear-like vertical extensions below Song Jiang’s eyes; clean rectangular eyes with white glints and skin beneath. Preserve the pixel grid, face shape, head covering, hair, eyebrows, moustache, beard, red-gold outfit, framing and gray background. No smoothing or redesign.

Outputs: songjiang-walking.png (144 × 256), 48 × 64 cells, rows down/left/right/up, columns idle/step A/step B; playback 0,1,0,2. walk-cycle.gif provides the enlarged preview. checks.json verifies head translation and planted-foot baseline.
