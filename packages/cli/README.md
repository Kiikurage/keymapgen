# @keymapgen/cli

Command-line interface for keymapgen - a cross-editor keymap synchronization tool.

## Overview

This package provides the CLI tool that allows you to convert unified YAML keymap definitions to editor-specific configuration formats from the command line.

## Installation

From the project root:

```bash
npm install
npm run build
npm link  # Install globally for CLI usage
```

## Usage

### Convert keymap to editor format

```bash
keymapgen --editor vscode sample-keymap.yml output/keybindings.json
```

### List supported editors

```bash
keymapgen list-editors
```

### Available editors

- `vscode` - VS Code keybindings.json format
- `intellij` - IntelliJ IDE keymap.xml format  
- `visualstudio` - Visual Studio keybindings.vssettings format

## Development

### Build

```bash
npm run build
```

### Development mode

```bash
npm run dev:cli
```

### Testing during development

Using Bun (recommended):
```bash
bun run src/cli.ts --editor vscode keymap.yml output.json
```

## Dependencies

- `@keymapgen/core` - Core conversion library
- `commander` - Command-line interface framework
- `yaml` - YAML parsing library