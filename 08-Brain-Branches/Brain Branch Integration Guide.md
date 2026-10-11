# Brain Branch Integration Guide

Your existing Brain Branches project can exchange files with Obsidian:

- **To Obsidian:** export one `.canvas` per subject/unit and one `.md` file per concept, preserving `[[links]]`, relevant case nodes and source URLs.
- **From Obsidian:** scan subject folders, frontmatter `type`, `unit` and wikilinks; generate a connected Brain Branches view.
- Use **stable filenames** or permanent concept IDs to prevent duplicates during later updates.
- Keep the **exam answer text authoritative in the Markdown file**, not in text-only canvas cards; Canvas is a navigation layer.
- For future automation, map repository import/export to a single named folder and prefer sync strategies that detect conflicts rather than silently overwriting study edits.

The included `First-Year Brain Branches.canvas` shows the pattern. It is a static example, **not a live integration with your GitHub repository**.

## KSLU unit maps (GitHub-backed)

Each unit should have one dedicated `.canvas` navigation map and a link from the unit's Markdown index. Example:

- [[01-Semester-1/Constitutional-Law-I/Unit-01 - Constitution and Preamble|Constitutional Law I — Unit 1]] → [[08-Brain-Branches/Constitutional-Law-I/Unit-01 - Constitution and Preamble|Open Unit 1 Brain Branches]]
- [[08-Brain-Branches/Constitutional-Law-I/Unit-01 - Branch Outline|Unit 1 text branches]]

The Unit 1 Canvas uses file cards (with heading `subpath` where useful) so branches point to the **same** topic notes, rather than creating duplicate copies. The topic notes remain the source of truth; verify statutes and case citations before exam use. This map was prepared from syllabus checklist notes in this vault; it is **not** a live copy of any unsaved browser session in the Brain Branches app.

To view your exact expanded branches from the Brain Branches app instead, open its **Knowledge Branch → To Obsidian** option and import/export that map separately. This is still a one-way export; changes made in Obsidian do not automatically update the map app.
