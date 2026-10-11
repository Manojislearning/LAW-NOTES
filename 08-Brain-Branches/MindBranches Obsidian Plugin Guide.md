# MindBranches for Obsidian — LAW-NOTES

This vault includes a **local Obsidian plugin** called **Law Notes MindBranches**, inspired by [MindBranches](https://github.com/Teamonics/mindbranches).

It reads your existing KSLU LL.B. Markdown notes directly. It does **not** replace or duplicate the notes, change your syllabus folders, or overwrite the existing Obsidian Canvas maps.

## Enable on your computer

1. Get the current `main` branch into the local `LAW-NOTES` vault folder. With GitHub Desktop: **Fetch origin → Pull origin**. With PowerShell inside that folder: `git pull --ff-only origin main`.
2. Open that **LAW-NOTES** folder as a vault in **Obsidian**.
3. Go to **Settings → Community plugins**. If Restricted Mode is enabled, turn it off. Then enable **Law Notes MindBranches** from the installed plugins.
4. If the plugin is not shown, fully restart Obsidian. Confirm these three files exist: `.obsidian/plugins/law-mindbranches/manifest.json`, `main.js`, and `styles.css`.
5. Open one of your Semester I unit notes and click the **branch** icon in the Obsidian left ribbon. Alternatively press **Ctrl+P** and run **Open unit MindBranches**.

## Study the notes

- **This note** converts Markdown headings and indented numbered/bulleted lists into branches. Wikilinks stay connected to their corresponding note files.
- **Unit** displays each topic file in that unit, with expandable content headings inside each topic.
- **Subject** displays the five syllabus units and their topics.
- **Semester** displays all available subjects, units, and topics for the current semester.
- Click a **colored circle** to fold or unfold. Click the **title of a linked note** to open the original editable Markdown note in a split pane.
- Drag empty space to move the map; hold **Ctrl + mouse wheel** to zoom; choose **Fit** to reframe.
- The map uses **20 px text** by default. Choose 16, 24, or 28 px from the text-size dropdown. Long labels remain **on one line** unless you select **Wrap text**.

## Notes and limits

The Markdown note is the source of truth. Edit the Markdown, then click **Refresh**; the plugin also listens for changes within the vault. Folder, note and unit maps are generated locally and need no paid API, Ollama, or internet connection. This is an Obsidian-only feature, separate from the **Manoj Mind Map** app; it is not continuous two-way GitHub sync.

The Obsidian Canvas maps in `08-Brain-Branches` remain unchanged. This plugin was added as vault files, but its actual operation still needs to be checked in the Obsidian desktop app after enabling it.
