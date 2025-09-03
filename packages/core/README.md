# @keymapgen/core

Core library for keymapgen - provides keymap conversion functionality and parsing logic.

## Overview

This package contains the core conversion engine that transforms unified YAML keymap definitions into editor-specific configuration formats. It serves as the foundation for both the CLI tool and web interface.

## Features

- ✨ **YAML Parsing**: Parse and validate keymap YAML files
- 🔄 **Multi-Format Conversion**: Convert to VS Code, IntelliJ, and Visual Studio formats
- 📝 **Type-Safe**: Built with TypeScript for better development experience
- ✅ **Validation**: Schema validation using AJV
- 🛠️ **Extensible**: Modular architecture for adding new editor support

## Supported Editors

| Editor | Format | Extension |
|--------|--------|-----------|
| VS Code | JSON | `keybindings.json` |
| IntelliJ IDEs | XML | `keymap.xml` |
| Visual Studio | XML | `keybindings.vssettings` |

## Installation

```bash
npm install @keymapgen/core
```

## Usage

### Basic conversion

```typescript
import { convertKeymap } from '@keymapgen/core';

const yamlContent = `
name: "My Keymap"
keymaps:
  file.new: "Ctrl+N"
  file.save: "Ctrl+S"
`;

const vscodeKeymap = convertKeymap(yamlContent, 'vscode');
console.log(vscodeKeymap);
```

### Load from file

```typescript
import { loadKeymapConfig } from '@keymapgen/core';

const config = loadKeymapConfig('path/to/keymap.yml');
const intellijKeymap = convertKeymap(config, 'intellij');
```

## Development

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

### Type checking

```bash
npm run typecheck
```

## Architecture

- `src/core/` - Core conversion logic
- `src/vscode/` - VS Code format converter
- `src/intellij/` - IntelliJ format converter  
- `src/visualstudio/` - Visual Studio format converter

## Dependencies

- `yaml` - YAML parsing library
- `ajv` - JSON schema validation
- `commander` - Command-line interface support