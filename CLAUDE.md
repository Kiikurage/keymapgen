# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is keymapgen, a cross-editor keymap synchronization tool that allows users to define keyboard shortcuts in a unified format and generate editor-specific configuration files. The project converts custom YAML keymap definitions into configuration files for various development editors (VS Code, Vim, IntelliJ IDEA, etc.).

## Technology Stack

- **Language**: TypeScript/Node.js
- **Build Tool**: TypeScript compiler with npm scripts
- **Input Format**: YAML-based keymap definitions
- **Development Stage**: Basic structure and type definitions implemented

## Project Architecture

### Core Components (To Be Implemented)
- **Keymap Parser**: Reads and validates YAML keymap definitions
- **Converter Engine**: Transforms unified keymap format to editor-specific formats
- **Output Generators**: Creates configuration files for target editors
- **CLI Interface**: Command-line tool for running conversions

### Keymap Structure
The input YAML format uses flat action ID and keystroke pairs:
- Action IDs follow dot notation (e.g., `file.save`, `edit.copy`, `navigation.goToDefinition`)
- Each action maps directly to a keystroke combination
- Categories include: `file`, `edit`, `navigation`, `code`, `debug`, `terminal`

## Development Status

**Current State**: Project structure exists but core implementation is not yet started.

**Key Files**:
- `TASK.md`: Project tasks and requirements (in Japanese)
- `sample-keymap.yml`: Example keymap configuration structure
- `src/types/keymap.ts`: Type definitions for keymap data structures
- `src/converters/`: Base classes and interfaces for editor converters
- `package.json`: Node.js project configuration and dependencies

## Development Setup

**Prerequisites**:
- Node.js (LTS version recommended)
- npm or yarn package manager

**Available Commands**:
- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Run development version with ts-node
- `npm run test`: Run Jest tests
- `npm run lint`: Run ESLint on source files
- `npm run typecheck`: Type-check without emitting files

**Testing**: Jest configured for unit testing

## Implementation Priority

1. ✅ Set up TypeScript build system with npm
2. ✅ Define type definitions for keymap data structures  
3. ✅ Create converter interface and base classes
4. Implement YAML keymap parser with validation
5. Add support for first target editor (VS Code recommended)
6. Implement CLI interface
7. Add comprehensive testing
8. Expand to additional editor formats