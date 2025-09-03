# @keymapgen/web

Web interface for keymapgen - a browser-based tool for keymap conversion.

## Overview

This package provides a web-based interface for keymapgen, allowing users to convert YAML keymap definitions to editor-specific formats directly in their browser. Built with Vite for fast development and optimized builds.

## Features

- 🌐 **Browser-Based**: No installation required, works in any modern browser
- ⚡ **Fast**: Powered by Vite for instant development and optimized production builds
- 📝 **Interactive**: Real-time keymap conversion and preview
- 🔄 **Multi-Editor Support**: Convert to VS Code, IntelliJ, and Visual Studio formats
- 📱 **Responsive**: Works on desktop and mobile devices

## Development

### Prerequisites

- Node.js (latest LTS recommended)
- npm or bun

### Setup

From the project root:

```bash
npm install
```

### Development server

```bash
cd packages/web
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Type checking

```bash
npm run typecheck
```

## Usage

1. Open the web interface in your browser
2. Paste or type your YAML keymap configuration
3. Select the target editor format (VS Code, IntelliJ, or Visual Studio)
4. Copy the generated configuration or download it as a file

### Example YAML input

```yaml
name: "My Custom Keymap"
description: "Personal keymap configuration"

keymaps:
  file.new: "Ctrl+N"
  file.open: "Ctrl+O"
  file.save: "Ctrl+S"
  edit.copy: "Ctrl+C"
  edit.paste: "Ctrl+V"
```

## Architecture

- Built with vanilla TypeScript and Vite
- Uses `@keymapgen/core` for conversion logic
- Responsive design for cross-device compatibility
- Client-side only - no server required

## Dependencies

- `@keymapgen/core` - Core conversion library
- `yaml` - YAML parsing library
- `vite` - Build tool and development server
- `typescript` - Type checking and compilation