#!/bin/bash

# Framework-Agnostic Modular Architecture (FAMA) Directory Structure Creation Script

# Project name (from argument, default is fama-project)
PROJECT_NAME=${1:-fama-project}

# Create project directory
mkdir -p $PROJECT_NAME

# Create basic directory structure
mkdir -p $PROJECT_NAME/framework/assets/{fonts,icons,images,images-optimized}
mkdir -p $PROJECT_NAME/framework/backend/{api-gateway,auth-service,modules}
mkdir -p $PROJECT_NAME/framework/core/{api,auth,communication,utils}
mkdir -p $PROJECT_NAME/framework/docs/{api,architecture,diagrams,guides,learning,templates}
mkdir -p $PROJECT_NAME/framework/frontend/core/{web,mobile}
mkdir -p $PROJECT_NAME/framework/frontend/modules
mkdir -p $PROJECT_NAME/framework/infrastructure/{aws,azure,gcp,on-premise}
mkdir -p $PROJECT_NAME/framework/scripts

# Create basic README files
echo "# Framework-Agnostic Modular Architecture (FAMA)

This is the root directory for the FAMA project structure." > $PROJECT_NAME/framework/README.md

echo "# Assets

Shared assets for all modules and frameworks." > $PROJECT_NAME/framework/assets/README.md

echo "# Backend

Backend services and modules." > $PROJECT_NAME/framework/backend/README.md

echo "# Core

Shared core functionality across all modules and frameworks." > $PROJECT_NAME/framework/core/README.md

echo "# Documentation

Project documentation and guides." > $PROJECT_NAME/framework/docs/README.md

echo "# Frontend

Frontend modules and implementations." > $PROJECT_NAME/framework/frontend/README.md

echo "# Infrastructure

Infrastructure configuration for different cloud providers." > $PROJECT_NAME/framework/infrastructure/README.md

echo "# Scripts

Utility scripts for development and deployment." > $PROJECT_NAME/framework/scripts/README.md

# Create package.json file
cat > $PROJECT_NAME/package.json << EOL
{
  "name": "${PROJECT_NAME}",
  "version": "0.1.0",
  "description": "A project built with Framework-Agnostic Modular Architecture (FAMA)",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "fama",
    "framework-agnostic",
    "modular",
    "architecture"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {}
}
EOL

# Create .msyn.json file
cat > $PROJECT_NAME/.msyn.json << EOL
{
  "version": "1.0.0",
  "language": "en",
  "sourceDir": "framework/assets/images",
  "optimizedDir": "framework/assets/images-optimized",
  "modules": [
    {
      "name": "framework/frontend/core/web/svelte",
      "targetDir": "static/images",
      "enabled": false
    },
    {
      "name": "framework/frontend/core/web/react",
      "targetDir": "public/images",
      "enabled": false
    },
    {
      "name": "framework/frontend/core/web/vue",
      "targetDir": "public/images",
      "enabled": false
    },
    {
      "name": "framework/frontend/core/mobile/react-native",
      "targetDir": "src/assets/images",
      "enabled": false
    },
    {
      "name": "framework/frontend/core/mobile/flutter",
      "targetDir": "assets/images",
      "enabled": false
    }
  ],
  "options": {
    "autoOptimize": true,
    "watchDelay": 2000
  }
}
EOL

# Completion message
echo "✅ FAMA project structure created in '$PROJECT_NAME' directory"
echo "📁 Change to the project directory: cd $PROJECT_NAME"
echo ""
echo "🔄 For asset synchronization, we recommend installing msyn:"
echo "   npm install msyn --save-dev"
echo "   # or"
echo "   yarn add msyn --dev"
echo "   # or"
echo "   pnpm add msyn --save-dev"
echo ""
echo "📚 Basic msyn usage:"
echo "   npx msyn sync    # Synchronize assets"
echo "   npx msyn watch   # Watch for changes"
echo "   npx msyn help    # Show help"
