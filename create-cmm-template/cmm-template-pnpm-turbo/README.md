# Containerized Modular Monolith Architecture Documentation

This documentation explains the overview, design principles, and implementation guidelines for the Containerized Modular Monolith Architecture.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Principles](#design-principles)
3. [Directory Structure](#directory-structure)
4. [Module Development Guide](#module-development-guide)
5. [API Gateway](#api-gateway)
6. [Authentication & Authorization](#authentication--authorization)
7. [Frontend Development](#frontend-development)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Containerized Modular Monolith Architecture is a design approach that combines the benefits of monolithic and microservice architectures.

### Key Features

- **Modularity**: Separate module structure for each functionality
- **Containerization**: Consistent environment using Docker
- **Single Repository**: Integrated code management with monorepo
- **Independent Deployment**: Ability to deploy modules individually

### Benefits

1. **Development Efficiency**
   - Integrated code management with monorepo
   - Efficient use of shared code and libraries
   - Fast builds and caching with pnpm and Turborepo

2. **Gradual Scaling**
   - Initial development as a monolith
   - Ability to convert specific modules to microservices as needed
   - Individual scaling based on traffic

3. **Simplified Operations**
   - Unified development and deployment process
   - Consistent monitoring and logging
   - Utilization of container orchestration

## Design Principles

### 1. Clear Module Boundaries

Each module has clearly defined responsibilities and minimizes dependencies on other modules.

### 2. API First

Communication between modules is only done through clearly defined APIs. Internal implementation details are hidden.

### 3. Independent Data Stores

Each module has its own data store and does not directly access other modules' data stores.

### 4. Unified Authentication & Authorization

Authentication and authorization are managed centrally and applied consistently across all modules.

### 5. Gradual Scaling

Modules can be scaled out individually based on traffic and development team size.

## Directory Structure

```
containerized-modular-monolith/
├── api-gateway/         # API Gateway
├── auth/                # Authentication Service
├── frontend/            # Frontend
│   ├── web/             # Web Frontend
│   └── mobile/          # Mobile App Frontend
├── modules/             # Functional Modules
│   ├── _template_/      # Module Template
│   ├── module-a/        # Module A
│   └── module-b/        # Module B
├── shared/              # Shared Code
│   ├── utils/           # Utility Functions
│   ├── components/      # Common Components
│   ├── types/           # Common Type Definitions
│   └── constants/       # Constants
├── assets/              # Shared Assets
│   ├── images/          # Images
│   ├── fonts/           # Fonts
│   └── icons/           # Icons
├── config/              # Configuration Files
├── scripts/             # Utility Scripts
├── docs/                # Documentation
│   ├── api/             # API Specifications
│   ├── architecture/    # Architecture Design
│   ├── diagrams/        # Diagrams
│   ├── guides/          # Development Guides
│   ├── learning/        # Learning Resources
│   └── templates/       # Templates
├── docker-compose.yml   # Docker Compose Configuration
├── package.json         # Project Configuration
└── README.md            # Project Overview
```

## Module Development Guide

### Module Structure

Each module has the following structure:

```
module-a/
├── src/
│   ├── api/             # API Endpoints
│   ├── controllers/     # Controllers
│   ├── services/        # Business Logic
│   ├── models/          # Data Models
│   ├── repositories/    # Data Access
│   ├── utils/           # Utilities
│   └── index.ts         # Entry Point
├── tests/               # Tests
├── Dockerfile           # Dockerfile
├── package.json         # Dependencies
└── README.md            # Module Description
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
3. gRPC (for performance-critical cases)

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

## Frontend Development

Frontend development supports both web applications and mobile applications.

### Web Development

- Frameworks like React/Vue/Svelte
- Type safety with TypeScript
- Utility-first CSS with TailwindCSS

### Mobile Development

- React Native
- Capacitor
- Flutter

### Asset Management

Shared assets are placed in the `assets/` directory and automatically synchronized to each module:

```bash
# Synchronize assets
pnpm run sync-assets

# Synchronize to specific modules only
pnpm run sync-assets -- --modules=module-a,module-b
```

## Deployment Guide

### Development Environment

```bash
# Start development server
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
pnpm build

# Build and push container images
docker-compose build
docker-compose push
```

### CI/CD

Supports continuous integration and deployment using GitHub Actions, Jenkins, CircleCI, etc.

## Troubleshooting

### Common Issues and Solutions

1. **Inter-Module Communication Errors**
   - Check API Gateway configuration
   - Verify network connectivity

2. **Build Errors**
   - Clear Turborepo cache: `pnpm dlx turbo clean`
   - Reinstall dependencies: `pnpm install`

3. **Container Startup Errors**
   - Check logs: `docker-compose logs -f <service-name>`
   - Check for port conflicts

4. **Performance Issues**
   - Optimize Turborepo configuration: `pnpm optimize`
   - Review caching strategy
