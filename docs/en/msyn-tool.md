# Asset Synchronization Tool (msyn)

## Overview

The `msyn` tool is designed to efficiently manage and synchronize assets across different frontend framework implementations in the Containerized Modular Monolith Framework. It ensures that images, fonts, icons, and other resources are consistently available across all frontend modules.

## Features

- **Differential Synchronization**: Only synchronizes files that have changed
- **SVG Optimization**: Automatically optimizes SVG files during synchronization
- **Watch Mode**: Monitors for changes and synchronizes in real-time
- **Interactive Configuration**: Easy setup through interactive prompts
- **Multi-language Support**: Supports internationalization of assets
- **Framework-specific Paths**: Automatically maps assets to the correct paths for each framework

## Installation

The `msyn` tool is included with the Containerized Modular Monolith Framework. No additional installation is required.

## Configuration

### Configuration File

The tool uses a `.msyn.json` configuration file in the project root. Here's an example configuration:

```json
{
  "sourceDir": "assets",
  "targets": [
    {
      "name": "react-app",
      "path": "modules/frontend/react-app/public/assets",
      "frameworks": ["react"]
    },
    {
      "name": "svelte-app",
      "path": "modules/frontend/svelte-app/static/assets",
      "frameworks": ["svelte"]
    },
    {
      "name": "vue-app",
      "path": "modules/frontend/vue-app/public/assets",
      "frameworks": ["vue"]
    },
    {
      "name": "flutter-app",
      "path": "modules/frontend/flutter-app/assets",
      "frameworks": ["flutter"]
    }
  ],
  "options": {
    "optimizeSvg": true,
    "watchMode": false,
    "verbose": true
  }
}
```

### Creating a Configuration

To create a new configuration file, run:

```bash
npx msyn init
```

This will guide you through an interactive setup process.

## Usage

### Basic Synchronization

To synchronize assets to all target frameworks:

```bash
npx msyn sync
```

### Watch Mode

To continuously monitor for changes and synchronize automatically:

```bash
npx msyn watch
```

### Selective Synchronization

To synchronize assets to specific targets:

```bash
npx msyn sync --targets react-app,vue-app
```

### Synchronizing Specific Files

To synchronize only specific files or directories:

```bash
npx msyn sync --files images/logo.png,fonts
```

## Framework-specific Paths

The tool automatically maps assets to the correct paths for each framework:

- **React/Next.js**: `public/assets`
- **Svelte Kit**: `static/assets`
- **Vue.js**: `public/assets`
- **Flutter**: `assets`
- **React Native**: `assets`

These paths can be customized in the configuration file.

## Best Practices

- **Organize Assets Logically**: Group assets by type (images, fonts, icons)
- **Use Consistent Naming**: Adopt a consistent naming convention
- **Optimize Before Sync**: Pre-optimize large assets before adding them
- **Regular Synchronization**: Run synchronization regularly during development
- **Version Control**: Include the configuration file in version control

## Troubleshooting

### Common Issues

#### Files Not Synchronizing

If files aren't synchronizing:
1. Check file permissions
2. Verify the paths in the configuration file
3. Ensure the source files exist

#### Performance Issues

If synchronization is slow:
1. Reduce the number of assets
2. Disable SVG optimization for development
3. Use selective synchronization

## Advanced Configuration

### Custom Transformations

You can add custom transformations to process assets during synchronization:

```json
{
  "transformations": [
    {
      "pattern": "*.jpg",
      "command": "imagemin --quality=80"
    }
  ]
}
```

### Environment-specific Configurations

You can create environment-specific configurations:

```bash
npx msyn sync --config .msyn.dev.json
```

## Contributing

Contributions to improve the `msyn` tool are welcome. Please see the [Contributing Guide](./contributing.md) for more information.
