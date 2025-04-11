# Containerized Modular Monolith Framework

A comprehensive framework for building containerized modular monolith applications that support multiple cloud providers, package managers, and languages.

## Languages

- [English (this document)](./README.md)
- [日本語](./README.ja.md)

## Overview

This framework provides a structured approach to building applications that can be containerized and deployed to various cloud environments. It combines the advantages of monolithic architecture (simplicity, development speed) with the benefits of microservices (modularity, scalability) while avoiding their drawbacks.

## Documentation

Detailed documentation is available in the `docs` directory:

- [English Documentation](./docs/en/index.md)
- [Japanese Documentation](./docs/ja/index.md)

## Features

- **Cloud-Agnostic Architecture**: Support for deployment to AWS, GCP/Firebase, Azure, and on-premises
- **Multi-Package Manager Support**: Compatible with npm (default), yarn, and pnpm
- **Monorepo Management**: Turborepo integration for efficient builds
- **Multilingual Support**: Documentation and interfaces in English (default) and Japanese
- **Asset Synchronization**: Built-in `msyn` tool for asset management across modules
- **Modular Structure**: Separation of concerns through clearly defined module boundaries
- **Containerization**: Docker-based development and deployment
- **Infrastructure as Code**: Templates for each supported cloud provider

## Directory Structure

```
framework/
├── core/                         # Shared core functionality
│   ├── api/                      # API definitions and interfaces
│   ├── auth/                     # Authentication and authorization
│   ├── communication/            # Inter-module communication
│   └── utils/                    # Shared utilities
├── frontend/                     # Modularized frontend
│   ├── core/                     # Frontend core functionality
│   │   ├── web/                  # Web app frontend
│   │   │   ├── [framework-1]/    # e.g., React, Svelte, Vue, etc.
│   │   │   ├── [framework-2]/    # Another framework implementation
│   │   │   └── [framework-n]/    # Additional framework implementations
│   │   └── mobile/               # Mobile app frontend
│   │       ├── [framework-1]/    # e.g., React Native, Flutter, etc.
│   │       └── [framework-2]/    # Another framework implementation
│   └── modules/                  # Feature modules
│       ├── registry.json         # Module registration information
│       └── [module-name]/        # Each module
│           ├── metadata.json     # Module metadata
│           ├── web/              # Web module implementation
│           │   ├── [framework-1]/# Selected web framework implementation
│           │   ├── [framework-2]/# Another framework implementation (optional)
│           │   └── [framework-n]/# Additional framework implementations (optional)
│           └── mobile/           # Mobile module implementation
│               ├── [framework-1]/# Selected mobile framework implementation
│               └── [framework-2]/# Another framework implementation (optional)
├── backend/                      # Modularized backend
│   ├── api-gateway/              # API gateway
│   ├── auth-service/             # Authentication service
│   └── modules/                  # Backend modules
├── assets/                       # Shared assets
│   ├── images/                   # Original images
│   ├── images-optimized/         # Optimized images
│   ├── fonts/                    # Fonts
│   └── icons/                    # Icons
├── docs/                         # Documentation
│   ├── api/                      # API specifications
│   ├── architecture/             # Architecture design
│   ├── diagrams/                 # Diagrams
│   ├── guides/                   # Development guides
│   ├── learning/                 # Learning resources
│   └── templates/                # Templates
├── scripts/                      # Development and deployment scripts
│   └── msyn/                     # Module synchronization tool
└── infrastructure/               # Infrastructure code
    ├── aws/                      # AWS-specific configuration
    ├── gcp/                      # GCP-specific configuration
    ├── azure/                    # Azure-specific configuration
    └── on-premise/               # On-premises configuration
```

## Getting Started

### Prerequisites

- Node.js 14 or higher
- Docker and Docker Compose
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ancient0328/containerized-modular-monolith.git
cd containerized-modular-monolith

# Install dependencies with npm (default)
npm install

# Or, use yarn
yarn

# Or, use pnpm
pnpm install
```

### Setup

Run the setup wizard to configure your environment:

```bash
npm run setup
```

This wizard will guide you through:
1. Selecting a cloud provider
2. Choosing modules to include
3. Configuring your development environment

## Package Manager Support

### npm (default)

```bash
# Install dependencies
npm install

# Run scripts
npm run dev

# Add dependencies
npm install package-name
```

### Yarn

```bash
# Install dependencies
yarn

# Run scripts
yarn dev

# Add dependencies
yarn add package-name
```

### pnpm

```bash
# Install dependencies
pnpm install

# Run scripts
pnpm dev

# Add dependencies
pnpm add package-name
```

## Cloud Provider Support

The framework anticipates configurations for multiple cloud providers:

- **AWS**: CloudFormation templates and CDK configurations
- **GCP/Firebase**: Terraform configurations and Firebase setup
- **Azure**: ARM templates and Azure DevOps pipelines
- **On-premises**: Docker Compose and Kubernetes configurations

You can select your preferred provider during setup or configure it manually later.

## Module Synchronization Tool (msyn)

This framework includes a built-in asset synchronization tool called "msyn" for managing assets across modules. This tool automatically synchronizes resources such as images, fonts, and icons from the central `assets/` directory to the appropriate directories in each frontend implementation (React, Svelte, Vue, Flutter, etc.).

### Key Features of msyn

- **Asset Synchronization**: Sync assets from a common directory to each framework's recommended location
- **Differential Sync**: Efficiently sync only files that have changed
- **SVG Optimization**: React Native-compatible SVG optimization
- **Watch Mode**: Detect file changes and sync automatically
- **Interactive Configuration**: User-friendly configuration wizard
- **Multilingual Interface**: Japanese and English interfaces

### Recommended Paths by Framework

msyn can accommodate recommended paths for common frameworks (examples):

- **Svelte Kit**: `static/images/`
- **Next.js**: `public/images/`
- **React Native**: `src/assets/images/`
- **Flutter**: `assets/images/`
- **Angular**: `src/assets/images/`
- **Vue.js**: `public/images/`

These are common examples and can be customized to match your project structure.

### Basic Usage of msyn

```bash
# Run the configuration wizard
node scripts/msyn/bin/msyn.js config

# Synchronize assets
node scripts/msyn/bin/msyn.js sync

# Verbose output
node scripts/msyn/bin/msyn.js sync --verbose

# Force overwrite
node scripts/msyn/bin/msyn.js sync --force

# Sync only specific modules
node scripts/msyn/bin/msyn.js sync --modules=frontend/core/web/[framework-1],frontend/modules/[module-name]/web/[framework-2]

# Watch for changes
node scripts/msyn/bin/msyn.js watch

# Optimize SVG files
node scripts/msyn/bin/msyn.js optimize

# Change language
node scripts/msyn/bin/msyn.js lang ja  # Japanese
node scripts/msyn/bin/msyn.js lang en  # English
```

### Configuration File

Configuration is stored in `.msyn.json` at the project root. You can edit it manually if needed:

```json
{
  "version": "1.0.0",
  "language": "en",
  "sourceDir": "assets/images",
  "optimizedDir": "assets/images-optimized",
  "modules": [
    {
      "name": "frontend/core/web/[framework-1]",
      "targetDir": "public/images",
      "enabled": true
    },
    {
      "name": "frontend/modules/[module-name]/web/[framework-2]",
      "targetDir": "static/images",
      "enabled": true
    },
    {
      "name": "frontend/core/mobile/[framework-3]",
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

For detailed usage, refer to the [msyn documentation](./scripts/msyn/README.md).

## Turborepo Integration

The framework is integrated with Turborepo for efficient monorepo management:

```bash
# Run scripts in all workspaces
npx turbo run dev

# Run scripts in a specific framework implementation
npx turbo run build --filter=frontend/core/web/[framework-1]

# Run scripts in a specific module
npx turbo run build --filter=frontend/modules/[module-name]/web/[framework-2]
```

## Development Workflow

1. **Create a new module**: Use templates from the `templates/` directory
2. **Local development**: Run with Docker Compose
3. **Asset synchronization**: Use the msyn tool to sync shared assets to each framework implementation
4. **Testing**: Run tests for individual modules or the entire application
5. **Deployment**: Use cloud-specific deployment scripts

## Multi-Framework Support

This framework supports implementation across multiple frontend frameworks. Depending on your project requirements, you can choose from frameworks such as:

- **Web**: React, Svelte, Vue, Angular, and other modern web frameworks
- **Mobile**: React Native, Flutter, and other cross-platform frameworks

Each module can provide implementations for each framework adopted in the project. The module metadata (`metadata.json`) describes the supported frameworks and their implementation paths.

The application shell (dashboard) references the module registry (`registry.json`) to discover available modules and dynamically load the appropriate framework implementation. This allows users to seamlessly access modules implemented in different frameworks through a consistent interface.

### Flexibility in Technology Selection

This architecture is not dependent on any specific framework, allowing you to select the optimal technology based on your project requirements and team skill set. For example:

- Use Svelte for performance-critical parts
- Use React for complex UI components
- Use Flutter for mobile apps

You can choose the optimal framework for each module.

### Implementation Strategies

The following strategies are effective for development in a multi-framework environment:

1. **Standardize inter-module communication**: Use standard communication protocols such as RESTful APIs or GraphQL
2. **Define common interfaces**: Clearly define interfaces that each module should implement
3. **Metadata-driven approach**: Describe module functionality and dependencies in metadata
4. **Leverage micro-frontend techniques**: Use technologies such as Web Components or module federation
5. **Common state management**: Provide mechanisms for sharing state across frameworks

These strategies enable an integrated environment where modules implemented in different frameworks work together.

## License

MIT

---
