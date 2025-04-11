# Framework-Agnostic Modular Architecture (FAMA)

A comprehensive architecture for building modular applications that support multiple frameworks, cloud providers, package managers, and languages.

## Languages

- [English (this document)](./README.md)
- [日本語](./README.ja.md)

## Overview

FAMA (Framework-Agnostic Modular Architecture) provides a structured approach to building applications that can be containerized and deployed to various cloud environments. It combines the advantages of monolithic architecture (simplicity, development speed) with the benefits of microservices (modularity, scalability) while avoiding their drawbacks.

The core philosophy of FAMA is framework independence - allowing teams to select the optimal technology for each module based on specific requirements rather than being locked into a single technology stack.

### Why FAMA?

- **Framework-Agnostic**: Not tied to any specific framework, providing flexibility in technology choices
- **Modular**: Divides functionality into independent modules with clear boundaries
- **Architecture**: Represents a design pattern rather than just a tool or library

This name offers several benefits:
- Concise and memorable (with the FAMA acronym)
- Not limited to containerization, making it more broadly applicable
- Clearly communicates that it's a design philosophy rather than a specific implementation
- Immediately conveys the core value of technical flexibility

## Documentation

Detailed documentation is available in the `docs` directory:

- [English Documentation](./docs/en/index.md)
- [Japanese Documentation](./docs/ja/index.md)

## Features

- **Framework Independence**: Freedom to choose the best framework for each module
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
└── infrastructure/               # Infrastructure code
    ├── aws/                      # AWS-specific configuration
    ├── gcp/                      # GCP-specific configuration
    ├── azure/                    # Azure-specific configuration
    └── on-premise/               # On-premises configuration
```

### Directory Structure Explanation

The FAMA architecture separates concerns through a carefully designed directory structure. Here are some key distinctions:

#### Core vs Implementation

- **Core directories** (`framework/core/*`): Contain framework-agnostic interfaces, types, and utilities that can be shared across all implementations.
- **Implementation directories** (like `framework/frontend/core/web/[framework]`): Contain specific implementations for a particular framework.

#### Key Directory Distinctions

##### Authentication Components

- **`core/auth/`**: Contains shared authentication interfaces, types, and utilities that are framework-agnostic. This includes token validation logic, authentication state types, and common authentication helpers that can be used by both frontend and backend.

- **`backend/auth-service`**: Contains the actual implementation of the authentication service as a backend microservice. This includes user authentication API endpoints, OAuth/OIDC integration, user database connections, and JWT token issuance/validation logic.

The relationship is that `backend/auth-service` implements the interfaces defined in `core/auth/`, allowing for consistent authentication interfaces across frontend and backend while maintaining separation of concerns.

##### API Components

- **`core/api/`**: Contains API contracts, interface definitions, and type definitions that are shared between frontend and backend.

- **`backend/api-gateway`**: Contains the implementation of the API gateway that routes requests to appropriate backend services.

This separation allows for clear boundaries between shared specifications and actual implementations, making the system more maintainable and adaptable to different frameworks.

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

## Asset Synchronization with msyn

FAMA includes a powerful asset synchronization tool called `msyn` that helps manage assets across different framework implementations.

### Features

- **Automatic Asset Synchronization**: Keeps assets in sync across all enabled modules
- **Image Optimization**: Automatically optimizes images for web and mobile
- **Watch Mode**: Monitors for changes and syncs in real-time
- **Multilingual Interface**: Japanese and English interfaces

### Installation

msyn is available as an official npm package:

```bash
# Using npm
npm install msyn --save-dev

# Using yarn
yarn add msyn --dev

# Using pnpm
pnpm add msyn --save-dev
```

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
# Synchronize assets
npx msyn sync

# Watch for changes
npx msyn watch

# Optimize images
npx msyn optimize

# Show help
npx msyn help

# Change language
npx msyn lang ja  # Japanese
npx msyn lang en  # English
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

This architecture supports implementation across multiple frontend frameworks. Depending on your project requirements, you can choose from frameworks such as:

- **Web**: React, Svelte, Vue, Angular, and other modern web frameworks
- **Mobile**: React Native, Flutter, and other cross-platform frameworks

Each module can provide implementations for each framework adopted in the project. The module metadata (`metadata.json`) describes the supported frameworks and their implementation paths.

The application shell (dashboard) references the module registry (`registry.json`) to discover available modules and dynamically load the appropriate framework implementation. This allows users to seamlessly access modules implemented in different frameworks through a consistent interface.

### Framework Selection Freedom

This architecture provides flexibility in choosing frameworks without being locked into a single technology. For example:

- Web using SvelteKit, mobile using Capacitor
- Web using Next.js, mobile using Flutter
- Web using Nuxt.js, mobile using Swift/Kotlin

You can freely select the optimal combination based on your project and team needs. Furthermore, you can adopt different frameworks for different modules.

What's important is the "capability to support" various frameworks, not "the need to implement everything simultaneously."

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

## Integration Points

Integration between different frameworks is achieved through:

1. **Common API interfaces**: Standardized API contracts for communication
2. **Event bus**: For cross-framework event propagation
3. **Asset synchronization tools**: Like `msyn` for sharing assets across implementations
4. **Shared configuration**: Common configuration for consistent behavior

This approach allows each part of your application to use the most appropriate technology while maintaining cohesion across the system.

## Business Value

This flexibility not only allows selecting the optimal technology for each feature but also enables:

- Rapid adaptation to market changes and emerging technologies
- Leveraging team expertise in different frameworks
- Progressive migration from legacy systems
- Optimizing performance by using specialized frameworks where needed

## License

MIT

---
