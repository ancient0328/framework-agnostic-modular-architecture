# msyn - Module Synchronization Tool

A comprehensive asset management and synchronization tool for Containerized Modular Monolith architecture. Efficiently manage assets across multiple frameworks and modules.

## Features

- **Asset Synchronization**: Sync assets from common directory to framework-specific locations
- **Differential Synchronization**: Efficiently sync only changed files
- **SVG Optimization**: Optimize SVGs for React Native compatibility
- **Watch Mode**: Automatically detect and sync file changes
- **Interactive Configuration**: User-friendly setup wizard
- **Multi-language Support**: English and Japanese interfaces

## Installation

```bash
# Global installation with npm
npm install -g msyn

# Or, install as a project dependency
npm install --save-dev msyn
```

## Usage

### Initial Setup

When using for the first time, run the configuration wizard:

```bash
msyn config
```

This interactive wizard will guide you through:
- Setting source and target directories
- Selecting modules to synchronize
- Configuring SVG optimization options
- Setting watch mode parameters

### Asset Synchronization

```bash
# Basic synchronization
msyn sync

# Detailed output
msyn sync --verbose

# Force overwrite
msyn sync --force

# Sync specific modules only
msyn sync --modules=dashboard/web-svelte,dashboard/mobile-flutter
```

### Watch Mode

```bash
# Start watch mode
msyn watch

# With detailed output
msyn watch --verbose
```

### SVG Optimization

```bash
# Optimize SVG files
msyn optimize

# Force re-optimization
msyn optimize --force
```

### Configuration Management

```bash
# Run configuration wizard
msyn config

# View current configuration
msyn config --list

# Reset configuration
msyn config --reset
```

### Language Settings

```bash
# Change language interactively
msyn lang

# Set language directly
msyn lang en  # English
msyn lang ja  # Japanese

# Use specific language for a single command
msyn sync --lang ja
```

## Configuration File

Configuration is stored in `.msyn.json` in your project root. You can edit it manually if needed:

```json
{
  "version": "1.0.0",
  "language": "en",
  "sourceDir": "assets/images",
  "optimizedDir": "assets/images-optimized",
  "modules": [
    {
      "name": "dashboard/web-svelte",
      "targetDir": "static/images",
      "enabled": true
    },
    {
      "name": "dashboard/mobile-flutter",
      "targetDir": "assets/images",
      "enabled": true
    }
  ],
  "options": {
    "autoOptimize": true,
    "watchDelay": 2000
  }
}
```

## Framework-specific Target Paths

msyn supports these recommended paths for various frameworks:

- **Svelte Kit**: `static/images/`
- **Next.js**: `public/images/`
- **React Native**: `src/assets/images/`
- **Flutter**: `assets/images/`
- **Angular**: `src/assets/images/`
- **Vue.js**: `public/images/`

## Environment Variables

- `MSYN_LANG`: Set language (en/ja)

## Dependencies

- Node.js 14 or higher
- chokidar (file watching)
- svgo (SVG optimization)
- inquirer (interactive interface)
- commander (command line parsing)

## License

MIT

---

[日本語版のREADMEはこちら](./README.ja.md)
