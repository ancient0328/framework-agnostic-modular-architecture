# create-cmm-template

Containerized Modular Monolith Architecture Template Creation Tool

[日本語](./README_ja.md)

## Overview

`create-cmm-template` is a template creation tool for easily starting with the Containerized Modular Monolith Architecture. With this tool, you can quickly set up a project with a modular structure and efficient development environment.

## Features

- **Flexible Package Manager Support**: Choose from npm, yarn, or pnpm
- **Multiple Templates**: pnpm-turbo (fast builds) and flexible (adaptable configuration)
- **Modular Structure**: Module design separated by functionality
- **Containerization**: Consistent development and production environments with Docker
- **Easy Initial Setup**: Interactive configuration process
- **Project Documentation**: Integrated project record management for architecture decisions and implementation details

## Installation

```bash
# Global installation
npm install -g create-cmm-template

# Or direct execution
npx create-cmm-template my-app
```

## Usage

### Basic Usage

```bash
# Create a new project
npx create-cmm-template my-app

# Specify a template
npx create-cmm-template my-app --template=pnpm-turbo

# Specify a package manager
npx create-cmm-template my-app --use-npm
npx create-cmm-template my-app --use-yarn
npx create-cmm-template my-app --use-pnpm
```

### Options

| Option | Description |
|--------|-------------|
| `--template=<template-name>` | Specify template (pnpm-turbo, flexible) |
| `--use-npm` | Use npm |
| `--use-yarn` | Use yarn |
| `--use-pnpm` | Use pnpm |
| `--skip-install` | Skip package installation |
| `--verbose` | Show detailed logs |

## Templates

### pnpm-turbo

A template featuring fast builds and efficient dependency management using pnpm and Turborepo. Ideal for large-scale projects.

**Features**:
- Efficient package management with pnpm
- Fast builds and caching with Turborepo
- Optimized monorepo configuration

### flexible

A flexible template supporting various package managers and frontend frameworks. Ideal when you need to adapt to existing projects or specific technology stacks.

**Features**:
- Support for multiple package managers (npm, yarn, pnpm)
- Support for various frontend frameworks
- Customizable configuration

## Development Tools

The template includes several development tools to enhance productivity and maintainability:

### Asset Synchronization

A system that automatically copies shared assets to each module's appropriate directory, ensuring consistency while maintaining module independence.

```bash
# Sync all assets
node scripts/sync-assets.js
```

### Project Record Management

The template integrates with Project Record Manager (PRM) to document architecture decisions and implementation details in a consistent format.

```bash
# Set up Project Record Manager
node scripts/setup-prm.js

# Create a new record
npm run prm:create
```

This helps maintain comprehensive documentation of your project's development history, which is especially valuable in a modular architecture.

For detailed documentation, see [Project Record Manager for CMM](../documents/tools/project-record-manager_en.md).

## Project Structure

The generated project has the following structure:

```
my-app/
├── api-gateway/         # API Gateway
├── auth/                # Authentication Service
├── frontend/            # Frontend
│   ├── web/             # Web Frontend
│   └── mobile/          # Mobile App Frontend
├── modules/             # Functional Modules
│   ├── _template_/      # Module Template
│   ├── module-a/        # Module A
│   └── module-b/        # Module B
├── assets/              # Shared Assets
├── scripts/             # Utility Scripts
├── docs/                # Documentation
├── docker-compose.yml   # Docker Compose Configuration
└── package.json         # Project Configuration
```

## Initial Setup

After creating the project, you can perform initial setup with the following command:

```bash
cd my-app
npm run init  # or yarn run init, pnpm run init
```

This script allows you to configure:
- Project name, description, version, and author
- Modules to use
- Frontend configuration

## Turborepo Optimization

With the pnpm-turbo template, you can optimize Turborepo settings with the following command:

```bash
npm run optimize  # or yarn run optimize, pnpm run optimize
```

This script allows you to configure:
- Optimization based on project size
- Performance settings
- Caching strategy
- Module structure optimization

## Asset Management

Shared assets are placed in the `assets/` directory and can be synchronized to each module with the following command:

```bash
npm run sync-assets  # or yarn run sync-assets, pnpm run sync-assets
```

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Architecture Overview](./docs/architecture.md)
- [Module Development Guide](./docs/module-development.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

## License

MIT

## Author

古川和博 (Kazuhiro Furukawa)

## Contributing

Contributions are welcome! See [CONTRIBUTING_EN.md](./CONTRIBUTING_EN.md) for details.
