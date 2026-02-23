# Changelog

All notable changes to "Duplicate Line Highlighter" will be documented in this file.

## [1.0.1] - 2026-02-23

### Added 

- Converted Javascript to Typescript

## [1.0.0] - 2026-02-23

### Added

- Toggle duplicate line highlighting via command palette or keybinding
- O(n) duplicate detection comparing trimmed lines
- Highlights all instances of duplicated lines
- Blank lines ignored
- Live updates with debounced text change handling
- Configurable highlight color (`duplicateLineHighlighter.highlightColor`)
- Default keybinding: `Ctrl+Shift+D` / `Cmd+Shift+D`
