# Sprite Workshop

A local, dependency-free pixel editor for Water Margin art. Open `index.html` in a browser, or serve this directory on localhost. The “Song Jiang preview” button loads a copy of the latest design preview; it is not a production sprite sheet.

## Editing

- Open PNG/JPEG/WebP files up to 2048 × 2048 pixels.
- Select crop (S), drag around one view, then Crop to selection. Numeric crop coordinates are also editable.
- Resize to your desired pixel dimensions using nearest-neighbour sampling. This is a starting point, not automatic conversion into polished game sprites. Preserve aspect ratio when choosing dimensions.
- Pencil (B), eraser (E), colour picker (I, or hold Alt), fill (F), and connected-area clearing (D).
- Increase clear tolerance carefully: dark backgrounds may connect to black outlines. Undo restores accidental changes.
- Undo/redo: Command/Ctrl+Z and Command/Ctrl+Shift+Z. Export PNG: Command/Ctrl+S.
- Grid and zoom help with individual pixels. PNG export contains only artwork, with its current transparency, never the editing grid.

Edits are held in the tab. Export before closing; there is no automatic save. Imports, crops, new canvases, and drawing are undoable. History retains up to 30 snapshots within approximately 96 MB. No external services or uploads. Original source files and game assets are not overwritten.

Core editing logic was checked for stroke continuity, connected erase boundaries, undo/redo, cropping, and restoration of canvas dimensions. Browser interaction and PNG download still require a manual smoke check.
