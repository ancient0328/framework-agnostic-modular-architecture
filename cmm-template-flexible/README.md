# Containerized Modular Monolith Architecture Documentation

This documentation explains the overview, design principles, and implementation guidelines for the Containerized Modular Monolith Architecture with flexible package manager and frontend framework support.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Principles](#design-principles)
3. [Directory Structure](#directory-structure)
4. [Package Managers](#package-managers)
5. [Frontend Frameworks](#frontend-frameworks)
6. [Module Development Guide](#module-development-guide)
7. [API Gateway](#api-gateway)
8. [Authentication & Authorization](#authentication--authorization)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Containerized Modular Monolith Architecture is a design approach that combines the benefits of monolithic and microservice architectures. This flexible template supports various package managers and frontend frameworks.

### Key Features

- **Modularity**: Separate module structure for each functionality
- **Containerization**: Consistent environment using Docker
- **Single Repository**: Integrated code management with monorepo
- **Independent Deployment**: Ability to deploy modules individually
- **Flexibility**: Support for various package managers and frontend frameworks

### Benefits

1. **Development Efficiency**
   - Integrated code management with monorepo
   - Efficient use of shared resources
   - Flexible design that respects existing development environments and habits

2. **Gradual Scaling**
   - Initial development as a monolith
   - Ability to convert specific modules to microservices as needed
   - Individual scaling based on traffic

3. **Simplified Operations**
   - Unified development and deployment process
   - Consistent monitoring and logging
   - Utilization of container orchestration

## Design Principles

### 1. Flexibility and Compatibility

Support various development environments and technology stacks, and be easily applicable to existing projects.

### 2. Clear Module Boundaries

Each module has clearly defined responsibilities and minimizes dependencies on other modules.

### 3. API First

Communication between modules is only done through clearly defined APIs. Internal implementation details are hidden.

### 4. Independent Data Stores

Each module has its own data store and does not directly access other modules' data stores.

### 5. Gradual Adoption

Design to allow module-by-module adoption for easy integration into existing projects.

## Directory Structure

```
containerized-modular-monolith/
├── api-gateway/        # API Gateway
├── auth/               # Authentication Service
├── frontend/           # Frontend
│   ├── web/            # Web Application
│   └── mobile/         # Mobile Application
├── modules/            # Functional Modules
│   ├── _template_/     # Template for new modules
│   │   ├── backend/    # Backend
│   │   └── frontend/   # Frontend (if needed)
│   ├── module-a/       # Module A
│   └── module-b/       # Module B
├── assets/             # Shared Assets
├── scripts/            # Utility Scripts
├── docs/               # Documentation
├── docker-compose.yml  # Docker configuration
└── package.json        # Project configuration
```

## Package Managers

This template supports multiple package managers:

- npm
- yarn
- pnpm

### Selecting a Package Manager

You can select your preferred package manager during project initialization:

```bash
# Select a package manager
node package-manager.js --select
```

Or you can use automatic detection:

```bash
# Auto-detect existing package manager
node package-manager.js --detect
```

### Package Manager Configuration File

The selected package manager is saved in the `.package-manager.json` file:

```json
{
  "packageManager": "npm",
  "installCommand": "npm install",
  "runCommand": "npm run"
}
```

## Frontend Frameworks

This template supports various frontend frameworks:

- React
- Vue
- Svelte
- Angular
- Next.js

### Selecting a Frontend Framework

You can select your preferred frontend framework during project initialization:

```bash
# Select a frontend framework
node frontend-config.js --select
```

### Frontend Configuration File

The selected frontend framework is saved in the `.frontend-framework.json` file:

```json
{
  "framework": "react",
  "version": "18.2.0",
  "typescript": true,
  "cssFramework": "tailwindcss"
}
```

## Module Development Guide

### Module Structure

Each module has the following structure:

```
module-a/
├── backend/
│   ├── src/
│   │   ├── api/             # API Endpoints
│   │   ├── controllers/     # Controllers
│   │   ├── services/        # Business Logic
│   │   ├── models/          # Data Models
│   │   ├── repositories/    # Data Access
│   │   ├── utils/           # Utilities
│   │   └── index.ts         # Entry Point
│   ├── tests/               # Tests
│   ├── Dockerfile           # Dockerfile
│   └── package.json         # Dependencies
├── frontend/                # Module-specific frontend (if needed)
│   ├── src/
│   │   ├── components/      # Components
│   │   ├── hooks/           # Custom Hooks
│   │   ├── pages/           # Pages
│   │   └── index.ts         # Entry Point
│   ├── tests/               # Tests
│   └── package.json         # Dependencies
└── README.md                # Module Description
```

### Adding a New Module

1. Copy the `_template_` directory
2. Update the module name and package name
3. Add the service to `docker-compose.yml`
4. Update the API Gateway configuration

### Inter-Module Communication

Communication between modules is done through the API Gateway:

1. RESTful API
2. GraphQL
3. WebSocket (for real-time communication)

## API Gateway

The API Gateway is responsible for routing client requests to the appropriate modules.

### Main Features

- Routing
- Authentication & Authorization
- Rate Limiting
- Request/Response Transformation
- Caching
- Logging

### Implementation

Example implementation using Express.js and http-proxy-middleware:

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Authentication Middleware
const authMiddleware = require('./middleware/auth');

// Proxy to Module A
app.use('/api/module-a', 
  authMiddleware,
  createProxyMiddleware({ 
    target: 'http://module-a:40300',
    pathRewrite: {'^/api/module-a': ''},
  })
);

// Proxy to Module B
app.use('/api/module-b', 
  authMiddleware,
  createProxyMiddleware({ 
    target: 'http://module-b:40310',
    pathRewrite: {'^/api/module-b': ''},
  })
);

app.listen(40200, () => {
  console.log('API Gateway started: http://localhost:40200');
});
```

## Authentication & Authorization

The Authentication & Authorization service centrally manages user authentication and permission control.

### Main Features

- User Registration & Login
- JWT Token Issuance
- Role-Based Access Control
- OAuth2.0 Support

### Implementation

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // User Authentication Logic
  // ...
  
  // Issue JWT Token
  const token = jwt.sign(
    { id: user.id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});

app.listen(40250, () => {
  console.log('Authentication Service started: http://localhost:40250');
});
```

## Deployment Guide

### Development Environment

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Start with Docker Compose
docker-compose up -d
```

### Production Environment

1. Build container images
2. Push to container registry
3. Deploy to Kubernetes/ECS/GKE

```bash
# Build
npm run build
# or
yarn build
# or
pnpm build

# Build and push container images
docker-compose build
docker-compose push
```

### CI/CD

Supports continuous integration and deployment using GitHub Actions, Jenkins, CircleCI, etc.

## Troubleshooting

### Common Issues and Solutions

1. **Package Manager Issues**
   - Check the `.package-manager.json` file
   - Run `node package-manager.js --detect` to re-detect

2. **Frontend Framework Issues**
   - Check the `.frontend-framework.json` file
   - Run `node frontend-config.js --select` to reconfigure

3. **Inter-Module Communication Errors**
   - Check API Gateway configuration
   - Verify network connectivity

4. **Container Startup Errors**
   - Check logs: `docker-compose logs -f <service-name>`
   - Check for port conflicts

5. **Asset Synchronization Issues**
   - Run `npm run sync-assets` to re-synchronize assets
