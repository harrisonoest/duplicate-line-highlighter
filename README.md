# Duplicate Line Highlighter

Highlights all duplicate lines in the active editor so you can spot repeated content at a glance.

## Features

- Highlights **all** instances of duplicated lines (not just the second occurrence)
- Compares lines after trimming whitespace, so `"  hello"` and `"hello"` are treated as duplicates
- Blank lines are ignored
- Live updates as you type (debounced for performance)
- Configurable highlight color

## Usage

Open the Command Palette (`Ctrl+Shift+P`) and run:

> **Toggle Duplicate Line Highlight**

Or use the keyboard shortcut:

| OS      | Shortcut         |
|---------|------------------|
| Windows/Linux | `Ctrl+Shift+D`  |
| macOS   | `Cmd+Shift+D`   |

Run the command again to turn highlighting off.

## Extension Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `duplicateLineHighlighter.highlightColors` | 8-color palette | Array of CSS colors. Each group of duplicates gets a distinct color, cycling through the list. |

## Known Issues

None at this time.

## Release Notes

### 1.0.0

Initial release.
