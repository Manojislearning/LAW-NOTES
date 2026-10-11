# Brain Branch Integration Guide

Your existing Brain Branches project can exchange files with Obsidian:

- **To Obsidian:** export one `.canvas` per subject/unit and one `.md` file per concept, preserving `[[links]]`, relevant case nodes and source URLs.
- **From Obsidian:** scan subject folders, frontmatter `type`, `unit` and wikilinks; generate a connected Brain Branches view.
- Use **stable filenames** or permanent concept IDs to prevent duplicates during later updates.
- Keep the **exam answer text authoritative in the Markdown file**, not in text-only canvas cards; Canvas is a navigation layer.
- For future automation, map repository import/export to a single named folder and prefer sync strategies that detect conflicts rather than silently overwriting study edits.

The included `First-Year Brain Branches.canvas` shows the pattern. It is a static example, **not a live integration with your GitHub repository**.
