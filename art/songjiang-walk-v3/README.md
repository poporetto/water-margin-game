# Song Jiang walking v3

144 × 256 transparent sheet; 48 × 64 cells. Rows: down, left, right, up. Columns: standing, step A, step B. Playback: 0, 1, 0, 2 at 180–200 ms per frame.

Source: ../songjiang-game-preview/design.png, approved richer palette. prepare.py samples the source uniformly at 1:16. AI generated the stride variations from edit-canvas.png. pack.py applies one shared scale, a common bottom baseline, original standing frames, and exact original head pixels across each row. Moving bodies remain generated artwork and may differ slightly from the original silhouette.

checks.json records dimensions, source lockback, distinct steps, and baselines. walk-cycle.gif shows all four directions. The isolated game preview loads this sheet without changing saves or the main asset manifest.
