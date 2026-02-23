const vscode = require('vscode');

let decorationTypes = [];
let isHighlightActive = false;
let debounceTimer;
let outputChannel;

const DEFAULT_PALETTE = [
    'rgba(255, 0, 0, 0.2)',
    'rgba(0, 128, 255, 0.2)',
    'rgba(255, 165, 0, 0.2)',
    'rgba(0, 200, 100, 0.2)',
    'rgba(180, 0, 255, 0.2)',
    'rgba(255, 255, 0, 0.2)',
    'rgba(0, 200, 200, 0.2)',
    'rgba(255, 100, 150, 0.2)',
];

function createDecorationTypes() {
    decorationTypes.forEach((d) => d.dispose());
    const palette = vscode.workspace
        .getConfiguration('duplicateLineHighlighter')
        .get('highlightColors', DEFAULT_PALETTE);
    decorationTypes = palette.map((color) =>
        vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
            isWholeLine: true,
        }),
    );
}

function activate(context) {
    outputChannel = vscode.window.createOutputChannel(
        'Duplicate Line Highlighter',
    );
    createDecorationTypes();

    context.subscriptions.push(
        outputChannel,
        vscode.commands.registerCommand(
            'duplicate-line-highlighter.toggleDuplicateLineHighlight',
            () => {
                isHighlightActive = !isHighlightActive;
                if (isHighlightActive) {
                    highlightDuplicateLines();
                    outputChannel.appendLine(
                        'Duplicate Line Highlighter is now active.',
                    );
                } else {
                    clearDecorations();
                    outputChannel.appendLine(
                        'Duplicate Line Highlighter is now disabled.',
                    );
                }
            },
        ),
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && isHighlightActive) highlightDuplicateLines();
        }),
        vscode.workspace.onDidChangeTextDocument((event) => {
            if (
                isHighlightActive &&
                event.document === vscode.window.activeTextEditor?.document
            ) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(highlightDuplicateLines, 250);
            }
        }),
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (
                event.affectsConfiguration(
                    'duplicateLineHighlighter.highlightColors',
                )
            ) {
                createDecorationTypes();
                if (isHighlightActive) highlightDuplicateLines();
            }
        }),
    );
}

function clearDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (editor) decorationTypes.forEach((d) => editor.setDecorations(d, []));
}

function highlightDuplicateLines() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const doc = editor.document;
    const lineMap = new Map();

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text.trim();
        if (!text) continue;
        const indices = lineMap.get(text);
        if (indices) indices.push(i);
        else lineMap.set(text, [i]);
    }

    const groups = [];
    for (const indices of lineMap.values()) {
        if (indices.length > 1) groups.push(indices);
    }

    // Build per-decoration-type range arrays
    const rangesByType = decorationTypes.map(() => []);
    groups.forEach((indices, gi) => {
        const typeIdx = gi % decorationTypes.length;
        for (const i of indices) {
            rangesByType[typeIdx].push({ range: doc.lineAt(i).range });
        }
    });

    decorationTypes.forEach((d, i) =>
        editor.setDecorations(d, rangesByType[i]),
    );
}

function deactivate() {
    clearTimeout(debounceTimer);
    decorationTypes.forEach((d) => d.dispose());
}

module.exports = { activate, deactivate };
