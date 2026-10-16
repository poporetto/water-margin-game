# Northern Song object source — batch 1

Generated with the built-in image-generation tool on 2026-10-15. Original source preserved in objects-source.png. Normalization is reproducible with tools/build-remaining-tiles.js and requires sharp.

Prompt specification: one transparent 8-column × 6-row source atlas for a Northern Song China RPG circa 1120; top-down three-quarter perspective; earthy, muted, detailed pixel art; isolated objects with no captions or modern objects. Closed ordinary house double door with framed panels, upper lattice, central seam, bronze ring pulls and stone threshold. No black open doorway. No Japanese torii or later imperial yellow roofs.

The 48 subjects, in requested order, are recorded in assets/tiles/32/objects-index.json. They cover two closed doors, poplar, willows, bamboo, dead tree, boulders, three stalls, lantern, banners, wine flag, notice board, stele, grave, tent, rowboat, sampan, guardian lion, tables, counter, curtained bed, shelves, jar, altar, cushion, column, Buddhist and Daoist statues and altars, screen, dais, official chair, judge desk, reeds and cliff samples.

The generator used uneven spacing for some wide objects. The exporter records explicit source bounds, normalizes proportions to existing game footprints, quantizes to 16 colours and thresholds alpha to 0/255. Runtime configuration preserves interaction and collision semantics. The wine flag contains 酒; the yellow banner has no readable motto at this size and is supplied as a variant rather than replacing the story banner automatically.
