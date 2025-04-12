# Framework-Agnostic Modular Architecture (FAMA)

A comprehensive architecture for building modular applications that support multiple frameworks, cloud providers, package managers, and languages.

## Languages

- [English (this document)](./README.md)
- [日本語](./README.ja.md)

## Overview

FAMA (Framework-Agnostic Modular Architecture) provides a structured approach to building applications that can be containerized and deployed across various cloud environments. It combines the advantages of monolithic architectures (simplicity, development speed) and microservices (modularity, scalability) while avoiding their respective drawbacks.

The core philosophy of FAMA is "framework independence," allowing teams to choose the most optimal technology for each module based on specific requirements without being constrained to a single technology stack.

### Why FAMA?

- **Framework-Agnostic**: Flexibility without being tied to a specific framework
- **Modular**: Design philosophy of dividing functionality into independent modules
- **Architecture**: Indicating this is a design pattern, not just a tool or library

The name offers the following benefits:
- Concise and memorable (FAMA acronym works well)
- Not presuming containerization, making it more broadly applicable
- The word "Architecture" conveys it's a design philosophy, not a specific implementation
- Immediately communicates the core value of technical flexibility

## Documentation

Detailed documentation is available in the `docs` directory:

- [English Documentation](./docs/en/index.md)
- [Japanese Documentation](./docs/ja/index.md)

## Features

- **Framework Independence**: Freely select the most appropriate framework for each module
- **Cloud-Agnostic Architecture**: Deployment support for AWS, GCP/Firebase, Azure, on-premises
- **Multiple Package Manager Support**: Compatible with npm (default), yarn, pnpm
- **Monorepo Management**: Turborepo integration for efficient builds
- **Multilingual Support**: Documentation and interface in English (default) and Japanese
- **Asset Synchronization**: Built-in `msyn` tool for asset management between modules
- **Modular Structure**: Separation of concerns with clearly defined module boundaries
- **Containerization**: Docker-based development and deployment
- **Infrastructure as Code**: Templates for supported cloud providers

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
│   │   │   ├── [framework-1]/    # E.g., React, Svelte, Vue, etc.
│   │   │   ├── [framework-2]/    # Alternative framework implementation
│   │   │   └── [framework-n]/    # Additional framework implementations
│   │   └── mobile/               # Mobile app frontend
│   │       ├── [framework-1]/    # E.g., React Native, Flutter, etc.
│   │       └── [framework-2]/    # Alternative framework implementation
│   └── modules/                  # Functional modules
│       ├── registry.json         # Module registration information
│       └── [module-name]/        # Each module
│           ├── metadata.json     # Module metadata
│           ├── web/              # Web module implementation
│           │   ├── [framework-1]/# Selected web framework implementation
│           │   ├── [framework-2]/# Alternative framework implementation (optional)
│           │   └── [framework-n]/# Additional framework implementations (optional)
│           └── mobile/           # Mobile module implementation
│               ├── [framework-1]/# Selected mobile framework implementation
│               └── [framework-2]/# Alternative framework implementation (optional)
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
│   ├── architecture/             # Architecture diagrams and explanations
│   ├── diagrams/                 # Visual diagrams
│   ├── guides/                   # User guides
│   ├── learning/                 # Learning resources
│   └── templates/                # Templates
├── scripts/                      # Development and deployment scripts
```

### Directory Structure Explanation

The FAMA architecture separates concerns through a carefully designed directory structure. Here are some important distinctions:

#### Distinction between Core and Implementation

- **Core Directory** (`framework/core/*`): Contains framework-independent interfaces, types, and utilities that can be shared across all implementations.
- **Implementation Directories** (e.g., `framework/frontend/core/web/[framework]`): Contain concrete implementations for specific frameworks.

#### Key Directory Distinctions

##### Authentication Components

- **`core/auth/`**: Contains framework-independent shared authentication interfaces, types, and utilities. This includes token validation logic, authentication state type definitions, and common authentication helpers usable in both frontend and backend.

- **`backend/auth-service`**: Contains the actual implementation of authentication as a backend microservice. This includes user authentication API endpoints, OAuth/OIDC integration, user database connections, and JWT token issuance/validation logic.

This relationship allows maintaining a consistent authentication interface between frontend and backend by having `backend/auth-service` implement the interfaces defined in `core/auth/`.

##### API Components

- **`core/api/`**: Contains API contracts, interface definitions, and type definitions shared between frontend and backend.

- **`backend/api-gateway`**: Contains the implementation of an API gateway that routes requests to appropriate backend services.

This separation creates a clear boundary between shared specifications and actual implementations, making the system more maintainable and adaptable to various frameworks.

## Asset Synchronization Tool (msyn)

FAMA includes a powerful synchronization tool "msyn" for managing assets between different framework implementations.

### Key Features

- **Automatic Asset Synchronization**: Synchronize assets between all enabled modules
- **Image Optimization**: Automatically optimize images for web and mobile
- **Watch Mode**: Monitor and synchronize changes in real-time
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

msyn supports recommended paths for common frameworks (examples):

- **Svelte Kit**: `static/images/`
- **Next.js**: `public/images/`
- **React Native**: `src/assets/images/`
- **Flutter**: `assets/images/`
- **Angular**: `src/assets/images/`
- **Vue.js**: `public/images/`

These are general examples and can be customized to match project structure.

### Basic msyn Usage

```bash
# Synchronize assets
npx msyn sync

# Watch for changes
npx msyn watch

# Optimize images
npx msyn optimize

# Display help
npx msyn help

# Change language
npx msyn lang ja  # Japanese
npx msyn lang en  # English
```

### Configuration File

Configuration is saved in `.msyn.json` in the project root and can be manually edited as needed.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm, yarn, or pnpm
- Git

### Installation

You can create a new project with the complete directory structure using the following simple shell script:

```bash
# Clone the repository
git clone https://github.com/ancient0328/framework-agnostic-modular-architecture.git

# Create a new project (replace 'my-project' with your project name)
./framework-agnostic-modular-architecture/create-structure.sh my-project

# Navigate to your new project
cd my-project
```

The script will create all necessary directories and basic README files for each section, along with a basic package.json and .msyn.json configuration.

After creating your project structure, we recommend installing msyn for asset synchronization:

```bash
# Using npm
npm install msyn --save-dev

# Using yarn
yarn add msyn --dev

# Using pnpm
pnpm add msyn --save-dev
```

Alternatively, you can create the directory structure manually:

```bash
# Create project directory
mkdir -p my-project/framework/assets/{fonts,icons,images,images-optimized}
mkdir -p my-project/framework/backend/{api-gateway,auth-service,modules}
mkdir -p my-project/framework/core/{api,auth,communication,utils}
mkdir -p my-project/framework/docs/{api,architecture,diagrams,guides,learning,templates}
mkdir -p my-project/framework/frontend/core/{web,mobile}
mkdir -p my-project/framework/frontend/modules
mkdir -p my-project/framework/infrastructure/{aws,azure,gcp,on-premise}
mkdir -p my-project/framework/scripts
```

### Package Managers

The framework supports multiple package managers:

### Setup

Run the setup wizard to configure your environment:

```bash
npm run setup
```

The wizard will help you:
1. Select cloud providers
2. Choose modules to include
3. Configure development environment

## Package Manager Support

### npm (Default)

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

- **AWS**: CloudFormation templates and CDK configuration
- **GCP/Firebase**: Terraform configuration and Firebase setup
- **Azure**: ARM templates and Azure DevOps pipelines
- **On-premises**: Docker Compose and Kubernetes configuration

You can select your preferred provider during setup or manually configure later.

## Turborepo Integration

The framework is integrated with Turborepo for efficient monorepo management:

```bash
# Run scripts across all workspaces
npx turbo run dev

# Run scripts for a specific framework implementation
npx turbo run build --filter=frontend/core/web/[framework-1]

# Run scripts for a specific module
npx turbo run build --filter=frontend/modules/[module-name]/web/[framework-2]
```

## Development Workflow

1. **Create New Modules**: Use templates from the `templates/` directory
2. **Local Development**: Run with Docker Compose
3. **Asset Synchronization**: Use msyn tool to sync shared assets to each framework implementation
4. **Testing**: Run tests for individual modules or the entire application
5. **Deployment**: Use cloud-specific deployment scripts

## Multi-Framework Support

This framework supports implementations across multiple frontend frameworks. You can choose from frameworks such as:

- **Web**: React, Svelte, Vue, Angular, and other modern web frameworks
- **Mobile**: React Native, Flutter, and other cross-platform frameworks

Each module can provide implementations for the frameworks adopted in the project. Module metadata (`metadata.json`) describes the corresponding frameworks and their implementation paths.

The application shell (dashboard) references the module registry (`registry.json`) to detect available modules and dynamically load appropriate framework implementations. This allows users to seamlessly access modules implemented in different frameworks through a consistent interface.

### Framework Selection Freedom

This architecture provides flexibility without being tied to specific frameworks. For example:

- Web in SvelteKit, Mobile in Capacitor
- Web in Next.js, Mobile in Flutter
- Web in Nuxt.js, Mobile in Swift/Kotlin

You can freely choose combinations that best suit project or team needs. Moreover, you can adopt different frameworks for different modules.

The key is "capability," not "the need to implement everything simultaneously."

### Technical Selection Flexibility

This architecture is not dependent on specific frameworks, allowing you to select optimal technologies based on project requirements and team skill sets. For example:

- Use Svelte for performance-critical sections
- Use React for complex UI components
- Use Flutter for mobile apps

You can select the most appropriate framework for each module.

### Implementation Strategies

Developing in a multi-framework environment is effective with these strategies:

1. **Standardize Inter-Module Communication**: Use standard communication protocols like RESTful APIs or GraphQL
2. **Define Common Interfaces**: Clearly define interfaces that each module should implement
3. **Metadata-Driven Approach**: Describe module functionality and dependencies through metadata
4. **Leverage Micro-Frontend Techniques**: Use technologies like WebComponents or Module Federation
5. **Shared State Management**: Provide mechanisms for sharing state across frameworks

These strategies enable an integrated environment where modules implemented in different frameworks can work together.

## Integration Points

Integration between different frameworks is achieved through:

1. **Common API Interfaces**: Communication through standardized API contracts
2. **Event Bus**: Event propagation across frameworks
3. **Asset Synchronization Tools**: Tools like `msyn` for sharing assets between implementations
4. **Shared Configurations**: Common configurations for consistent behavior

This approach allows using the most appropriate technology for each part of the application while maintaining overall system consistency.

## Business Value

This flexibility not only allows selecting the most optimal technology for each feature but also enables:

- Rapid adaptation to market changes and emerging technologies
- Leveraging team's expertise in different frameworks
- Gradual migration from legacy systems
- Using specialized frameworks where needed to optimize performance

## License

MIT

---
