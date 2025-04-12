# msyn - Multi-Framework Asset Synchronization Tool

A comprehensive asset management and synchronization tool for multi-framework projects. Efficiently manage and optimize assets across web, mobile, and native applications.

## Features

- **Automatic Framework Detection**: Automatically detects frameworks in your project
- **Multiple Asset Types**: Supports images, icons, fonts, and custom asset types
- **Asset Synchronization**: Syncs assets from common directories to framework-specific locations
- **SVG Optimization**: Optimizes SVGs for better compatibility and performance
- **Watch Mode**: Automatically detects and syncs file changes
- **Interactive Configuration**: User-friendly setup wizard with smart defaults
- **Multi-language Support**: English and Japanese interfaces

## Installation

```bash
# Global installation with npm
npm install -g msyn

# Or, install as a project dependency
npm install --save-dev msyn

# With pnpm
pnpm install --save-dev msyn
```

## Usage

### Initial Setup

When using for the first time, run the configuration wizard:

```bash
npx msyn config
```

This interactive wizard will guide you through:
- Setting up asset directories (images, icons, fonts)
- Detecting and configuring frameworks
- Setting watch mode parameters

### Asset Synchronization

```bash
# Basic synchronization
npx msyn sync

# Detailed output
npx msyn sync --verbose

# Force overwrite
npx msyn sync --force
```

### Watch Mode

```bash
# Start watch mode
npx msyn watch

# With detailed output
npx msyn watch --verbose
```

## Configuration

### Asset Directory Structure

msyn v1.1.0 uses a standardized asset directory structure:

```
assets/
  ├── images/
  │   └── .optimized/  (automatically created)
  ├── icons/
  │   └── .optimized/  (automatically created)
  └── fonts/
```

These directories are automatically created during configuration and used for synchronization. Optimization directories are created for image assets only.

### Framework Detection

msyn automatically detects frameworks in your project by analyzing:
- Package dependencies
- Configuration files
- Directory structures

Supported frameworks include:

**Web Frameworks**:
- Next.js
- React
- Remix
- Vue
- Nuxt.js
- Angular
- Svelte
- SvelteKit
- SolidJS
- Astro

**Mobile Frameworks**:
- React Native
- Expo
- Flutter
- Ionic
- Capacitor

**Native Frameworks**:
- Swift (iOS)
- Kotlin (Android)
- Xamarin

### Default Asset Paths

msyn uses these recommended paths for various frameworks:

- **Next.js/React/Remix**: `public/images/`, `public/icons/`, `public/fonts/`
- **SvelteKit**: `static/images/`, `static/icons/`, `static/fonts/`
- **Angular**: `src/assets/images/`, `src/assets/icons/`, `src/assets/fonts/`
- **React Native**: `src/assets/images/`, `src/assets/icons/`, `src/assets/fonts/`
- **Flutter**: `assets/images/`, `assets/icons/`, `assets/fonts/`
- **Swift**: `Resources/Images/`, `Resources/Icons/`, `Resources/Fonts/`
- **Kotlin**: `res/drawable/`, `res/drawable/`, `res/font/`

### Configuration File

Configuration is stored in `.msyn.json` in your project root. Example:

```json
{
  "version": "1.1.0",
  "language": "en",
  "assets": {
    "images": {
      "source": "assets/images/",
      "optimized": "assets/images/.optimized/"
    },
    "icons": {
      "source": "assets/icons/",
      "optimized": "assets/icons/.optimized/"
    },
    "fonts": {
      "source": "assets/fonts/",
      "optimized": null
    }
  },
  "targets": [
    {
      "framework": "nextjs",
      "type": "web",
      "destination": "/path/to/nextjs/public/images",
      "formats": ["webp", "jpg", "png", "svg"],
      "assetType": "images"
    },
    {
      "framework": "reactnative",
      "type": "mobile",
      "destination": "/path/to/reactnative/src/assets/images",
      "formats": ["png", "jpg", "webp"],
      "assetType": "images"
    }
  ],
  "watch": true,
  "optimize": true,
  "watchDelay": 2000
}
```

## Environment Variables

- `MSYN_LANG`: Set language (en/ja)

## Dependencies

- Node.js 14 or higher
- chokidar (file watching)
- svgo (SVG optimization)
- inquirer (interactive interface)
- commander (command line parsing)
- glob (file pattern matching)

## License

MIT

---

[日本語版のREADMEはこちら](./README.ja.md)
