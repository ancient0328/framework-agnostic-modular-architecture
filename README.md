# Containerized Modular Monolith Architecture

[日本語](./README_ja.md)

## Overview

This repository provides implementation templates and tools for the Containerized Modular Monolith Architecture. You can easily get started with a design approach that combines the benefits of monolithic and microservice architectures.

## Repository Structure

This repository includes the following components:

1. **[create-cmm-template](./create-cmm-template/)** - Template creation tool (npm package)
2. **[cmm-template-pnpm-turbo](./cmm-template-pnpm-turbo/)** - Template for fast builds using pnpm and Turborepo
3. **[cmm-template-flexible](./cmm-template-flexible/)** - Template supporting flexible package managers and frontend frameworks
4. **[cmm-template-comparison.md](./cmm-template-comparison.md)** - Template comparison document

## Features

- **Modularity**: Separate module structure for each functionality
- **Containerization**: Consistent environment using Docker
- **Single Repository**: Integrated code management with monorepo
- **Independent Deployment**: Ability to deploy modules individually
- **Flexibility**: Support for various package managers and frontend frameworks

## Usage

### Installing the Template Creation Tool

```bash
# Global installation
npm install -g create-cmm-template

# Or direct execution
npx create-cmm-template my-app
```

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

### Direct Template Usage

You can also use the templates directly:

```bash
# Using the pnpm-turbo template
git clone https://github.com/ancient0328/containerized-modular-monolith.git
cd containerized-modular-monolith/cmm-template-pnpm-turbo
pnpm install
pnpm run init
```

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

## Architecture

The Containerized Modular Monolith Architecture is based on the following design principles:

1. **Clear Module Boundaries**: Each module has clearly defined responsibilities and minimizes dependencies on other modules.
2. **API First**: Communication between modules is only done through clearly defined APIs.
3. **Independent Data Stores**: Each module has its own data store.
4. **Unified Authentication & Authorization**: Authentication and authorization are managed centrally.
5. **Gradual Scaling**: Modules can be scaled out individually based on traffic and development team size.

Detailed architecture documentation is available in the `docs/` directory of each template.

## Documentation

Each template includes detailed documentation:

- [pnpm-turbo Template Documentation](./cmm-template-pnpm-turbo/docs/README_EN.md)
- [flexible Template Documentation](./cmm-template-flexible/docs/README_EN.md)
- [Template Comparison](./cmm-template-comparison.md)

## Contributing

Contributions are welcome! See [CONTRIBUTING_EN.md](./create-cmm-template/CONTRIBUTING_EN.md) for details.

## License

MIT

## Author

Kazuhiro Furukawa
