# Detailed continuous cliff faces
Generated with the built-in image generator; source and exact prompt are saved here.
Rebuild using tools/build-cliff-tiles.js (also called by build-seasonal-tiles.js).
Each seasonal panel is 128×64 pixels, containing eight native 32px cells sampled continuously by map coordinates. The three panels cover green, autumn and snow palettes. Outer repeat borders match; interior tile boundaries sample the same uninterrupted source. Each panel uses 24 colours. The renderer adds fine irregular perimeter caps rather than broad rectangular bands. Map collision is unchanged.
Verified with tools/test-seasonal-tiles.js, including cliff solidity and browser screenshots.
