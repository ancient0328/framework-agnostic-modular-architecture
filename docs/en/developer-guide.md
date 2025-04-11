# Developer Guide

## Getting Started

This guide will help you set up your development environment and understand how to work with the Containerized Modular Monolith Framework.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- Docker and Docker Compose
- Git

## Setting Up Your Development Environment

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/containerized-modular-monolith.git
cd containerized-modular-monolith
```

### 2. Run the Setup Script

The framework provides an interactive setup script that will guide you through the initial configuration:

```bash
node setup/init.js
```

During setup, you'll be prompted to:
- Select your preferred language
- Enter a project name
- Choose which modules to include
- Select frontend and backend frameworks
- Choose a package manager
- Select a cloud provider (if applicable)

### 3. Install Dependencies

After the setup script completes, install the dependencies using your chosen package manager:

```bash
# If using npm
npm install

# If using yarn
yarn

# If using pnpm
pnpm install
```

## Development Workflow

### Module Development

Each module in the framework is designed to be developed independently:

1. **Navigate to the module directory**:
   ```bash
   cd modules/frontend/react-app
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Make your changes**: The development server includes hot reloading for a smooth development experience.

### Working with Multiple Modules

When working with multiple modules, you can use Docker Compose to run the entire application:

```bash
docker-compose up
```

This will start all the modules in separate containers and set up the necessary networking between them.

## Testing

### Unit Tests

Run unit tests for a specific module:

```bash
cd modules/backend/api
npm test
```

### Integration Tests

Run integration tests that verify the interaction between modules:

```bash
npm run test:integration
```

### End-to-End Tests

Run end-to-end tests that simulate user interactions:

```bash
npm run test:e2e
```

## Building for Production

### Building Modules

Build a specific module:

```bash
cd modules/frontend/react-app
npm run build
```

### Building the Entire Application

Build all modules:

```bash
npm run build
```

This will create optimized production builds for all modules.

## Deployment

Refer to the [Deployment Guide](./deployment.md) for detailed instructions on deploying your application to various environments.

## Troubleshooting

### Common Issues

#### Module Communication Problems

If modules are having trouble communicating:
1. Check that all containers are running (`docker ps`)
2. Verify network configuration in Docker Compose
3. Check API endpoints and ports

#### Build Failures

If you encounter build failures:
1. Ensure all dependencies are installed
2. Check for compatibility issues between packages
3. Verify that environment variables are correctly set

## Contributing

We welcome contributions to the framework! Please see our [Contributing Guide](./contributing.md) for more information on how to get involved.
