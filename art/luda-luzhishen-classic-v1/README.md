# Lu Da → Lu Zhishen · Classic design candidates

Created on 22 October 2026 after the user approved Lin Chong's v3 walking sprites and requested his integration, followed by work on Lu Da and Lu Zhishen.

These are the same man in two story identities. Lu Da is the broad, powerful, full-bearded Major of Weizhou, in muted olive garrison clothing and a wrapped cloth cap. Lu Zhishen retains his face, beard and massive build after taking monastic vows: bald scalp, large wooden prayer beads, ochre robe and dark floral tattoos. His anatomical right shoulder stays bare and tattooed: viewer-left in front, visible in the left-facing profile, viewer-right from behind. His left shoulder stays robed. Portrait identity comes from assets/portraits/luda-expressions.png and luzhishen-expressions.png; character details follow js/data/chars.js and the project sprite brief.

The approved original Song Jiang Classic artwork supplies the sprite style and proportions. The new man is broader and a little taller, as specified for the larger characters. The Lu Zhishen generation references the new Lu Da sprite directly to retain identity across the costume change.

Open in-game.html to compare Song Jiang (left), Lu Da (centre) and Lu Zhishen (right) at the actual game size in three locations. Front, left and back are available. compare.html provides enlarged frames and the retained original turnarounds.

Generated with the built-in image generation tool. Exact prompts: luda-prompt.txt and luzhishen-prompt.txt. Native source images: luda-original.png and luzhishen-original.png. No palette reduction or tone remapping was applied. pack.cjs uses one proportional scale across both native sources, a single nearest-neighbour reduction, 192 × 256 transparent cells, and a shared foot baseline. packing.json records the crop bounds and scale. Frame grids are packed as raw RGBA to avoid compositing colour shifts. Faint background residue outside the padded opaque figure bounds is excluded by the crop.

These are standing design candidates, not approved walking assets. Review sheets repeat the static frames only for compatibility with the game renderer; the right-facing row is deliberately blank. In particular, the monk's asymmetric robe and tattoos need a separately drawn right-facing view. Future movement should preserve the approved neutral frames and match colour/shadow distributions across the entire loop. Both future battle sprites use one static dynamic left-facing pose: fists for Lu Da, Iron Chan Staff for Lu Zhishen. Neither new design has been installed as a production override.

Browser verification covers all three directions and all three game backgrounds, density 8, equal logical cell size, and loaded detail images. See browser-checks.json.

The user subsequently requested Lu Zhishen animation from this design. His four-direction walking review is in [luzhishen-classic-motion-v1](../luzhishen-classic-motion-v1/in-game.html). Lu Da remains at the standing-design stage.
