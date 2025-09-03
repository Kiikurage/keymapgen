# keymapgen

A cross-editor keymap synchronization tool that converts unified YAML keymap definitions to editor-specific configuration formats.

📖 **[日本語 README](./docs/README.ja.md)**

## Features

- ✨ **Unified Format**: Define keymaps once in YAML format
- 🔄 **Multi-Editor Support**: Convert to various editor formats
- 🛠️ **CLI Tool**: Easy-to-use command line interface
- 📝 **Type-Safe**: Built with TypeScript for better development experience
- ⚡ **Fast**: Powered by modern tooling (Bun, TypeScript)

## Quick Start

### Installation

```bash
npm install
npm run build
npm link  # Install globally for CLI usage
```

### CLI Usage

Convert a YAML keymap to editor-specific format:

```bash
keymapgen --editor vscode sample-keymap.yml output/keybindings.json
```

List all supported editors:

```bash
keymapgen list-editors
```

### YAML Format

```yaml
name: "My Custom Keymap"
description: "Personal keymap configuration"

keymaps:
  file.new: "Ctrl+N"
  file.open: "Ctrl+O"
  file.save: "Ctrl+S"
  edit.copy: "Ctrl+C"
  edit.paste: "Ctrl+V"
  # ... more mappings
```


## Supported Editors

| Editor | `--editor` | Format |
|--------|--------|--------|
| VS Code | `vscode` | `keybindings.json` |
| IntelliJ IDEs | `intellij` | `keymap.xml` |
| Visual Studio | `visualstudio` | `keybindings.vssettings` |

## Development

### Prerequisites

- Bun

### Setup

```bash
# Install dependencies
bun install
```

### Development Workflow

#### Testing CLI during development

Using Bun (recommended):
```bash
# Test CLI directly with TypeScript
bun run packages/cli/src/cli.ts --editor vscode keymap.yml output.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.