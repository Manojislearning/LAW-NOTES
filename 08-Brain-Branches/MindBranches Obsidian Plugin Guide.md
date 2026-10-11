# MindBranches in Obsidian — Desktop and Phone

**Law Notes MindBranches v1.1** is a vault-local Obsidian plugin. It displays colored, foldable topic branches directly from the existing KSLU law-study Markdown notes. **It is not a plugin from the public Obsidian directory**, so searching the online plugin browser for its name will not find it.

## Desktop — make the Map option appear

1. Close Obsidian.
2. Update the local `LAW-NOTES` Git repository. In GitHub Desktop choose **Fetch origin → Pull origin**, or open a terminal in `LAW-NOTES` and run:
   ```powershell
   git pull --ff-only origin main
   ```
3. Confirm these files are present in the **same vault you opened in Obsidian**:
   - `.obsidian/plugins/law-mindbranches/manifest.json`
   - `.obsidian/plugins/law-mindbranches/main.js`
   - `.obsidian/plugins/law-mindbranches/styles.css`
4. Start Obsidian. In **Settings → Community plugins**, allow community plugins if prompted. Under installed plugins, enable **Law Notes MindBranches**. The GitHub vault has a `.obsidian/community-plugins.json` entry, but your local settings or restricted mode may still require manual enabling.
5. Open a unit note. Press **Ctrl+P**, type **MindBranches**, and select **Open unit MindBranches**. There is also a branch icon in the desktop left ribbon, and **Open MindBranches** in the file's right-click menu.

If **Git pull** says the untracked file `.obsidian/community-plugins.json` would be overwritten, **do not delete your original settings**. Back it up and merge `"law-mindbranches"` into the existing enabled-plugin ID list, or enable the plugin manually in Obsidian after a selective update.

## Phone — install the same plugin files locally

1. Make sure your phone opens a local copy of the **same LAW-NOTES vault**, not just a browser view of GitHub. A GitHub push or PC pull **does not automatically update the vault stored on your phone**.
2. Synchronize/copy the entire `.obsidian/plugins/law-mindbranches/` folder and the Markdown notes to your phone. If you use Obsidian Sync, configure it to synchronize **installed community plugins** and **active community plugin list** where supported, then let it finish. If you use another syncing system, ensure hidden folders like `.obsidian` are included.
3. Fully close and reopen Obsidian mobile. Open **Settings → Community plugins**. Allow community plugins if required and enable **Law Notes MindBranches**. Do not search the public community directory; it is installed from the vault's files.
4. Open a note in `01-Semester-1`. Use the mobile command palette and search **MindBranches**, or **long-press a note in the file explorer** and choose **Open MindBranches**.
5. On the map, use **+** and **−** to zoom (touchscreen-friendly), **Fit** to center, and tap a colored circle to expand/collapse. Tap a title to open its note in a mobile tab.

If the plugin **does not appear under Installed plugins** on mobile, the phone does not yet have the plugin's `manifest.json` and `main.js` inside its local vault, or community plugins are restricted. Fix the sync/copy step before troubleshooting the map.

## Available maps

- **This note**: note headings and lists.
- **Unit**: the syllabus unit's topic files and their content headings.
- **Subject**: the subject's units and linked topic notes.
- **Semester**: subject → unit → topic structure.

The 16/20/24/28 px setting changes branch text size. Labels stay on one line by default, with an optional **Wrap text** control. Pan by dragging the blank canvas; on desktop, **Ctrl+wheel** zooms. All note editing remains in the original Markdown files.

## Troubleshooting

- **No menu or command at all**: Check the plugin is enabled in Settings → Community plugins, the vault directory is correct, and restart Obsidian.
- **Empty map**: Open a note inside a Semester I unit folder first. Use **This note** for an individual note outside the syllabus folders.
- **The phone shows notes but no plugin**: Your sync is copying Markdown but not the hidden `.obsidian/plugins` folder.
- **Text looks very small**: Use **+** or select 24/28 px. Choose **Unit** rather than **Semester** for a smaller, easier-to-read map.
- **Plugin still fails to load**: Temporarily disable it and use the standard `.canvas` maps in `08-Brain-Branches/Notes-Maps`. This custom plugin has passed syntax and simulated opening/navigation tests, but not a real Obsidian desktop/phone runtime test.

The original Canvas maps and all existing unit notes remain unchanged. The map does not itself synchronize files between devices and does not require a paid API.
