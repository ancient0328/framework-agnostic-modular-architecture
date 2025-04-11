# Deployment Guide

## Overview

This guide covers the deployment process for applications built with the Containerized Modular Monolith Framework. The framework supports multiple deployment strategies and cloud providers.

## Deployment Strategies

### Single Container Deployment

The simplest deployment strategy is to package the entire application in a single container:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t my-app:latest .
   ```

3. **Run the container**:
   ```bash
   docker run -p 8080:8080 my-app:latest
   ```

### Multi-Container Deployment

For more complex applications, you can deploy each module in its own container:

1. **Build all modules**:
   ```bash
   npm run build:all
   ```

2. **Build Docker images for each module**:
   ```bash
   docker-compose build
   ```

3. **Deploy the containers**:
   ```bash
   docker-compose up -d
   ```

## Cloud Provider Deployments

### AWS Deployment

#### Prerequisites
- AWS CLI installed and configured
- ECR repository created
- ECS cluster configured

#### Deployment Steps

1. **Build and tag the Docker image**:
   ```bash
   docker build -t my-app:latest .
   ```

2. **Login to ECR**:
   ```bash
   aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com
   ```

3. **Tag the image for ECR**:
   ```bash
   docker tag my-app:latest 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
   ```

4. **Push the image to ECR**:
   ```bash
   docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
   ```

5. **Update the ECS service**:
   ```bash
   aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment
   ```

### GCP Deployment

#### Prerequisites
- Google Cloud SDK installed and configured
- GCR repository access
- GKE cluster configured

#### Deployment Steps

1. **Build and tag the Docker image**:
   ```bash
   docker build -t my-app:latest .
   ```

2. **Tag the image for GCR**:
   ```bash
   docker tag my-app:latest gcr.io/my-project/my-app:latest
   ```

3. **Push the image to GCR**:
   ```bash
   docker push gcr.io/my-project/my-app:latest
   ```

4. **Deploy to GKE**:
   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   ```

### Azure Deployment

#### Prerequisites
- Azure CLI installed and configured
- Azure Container Registry access
- AKS cluster configured

#### Deployment Steps

1. **Build and tag the Docker image**:
   ```bash
   docker build -t my-app:latest .
   ```

2. **Login to ACR**:
   ```bash
   az acr login --name myregistry
   ```

3. **Tag the image for ACR**:
   ```bash
   docker tag my-app:latest myregistry.azurecr.io/my-app:latest
   ```

4. **Push the image to ACR**:
   ```bash
   docker push myregistry.azurecr.io/my-app:latest
   ```

5. **Deploy to AKS**:
   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   ```

## Environment Configuration

### Environment Variables

Configure environment variables for different deployment environments:

1. **Development**:
   - Create a `.env.development` file
   - Set development-specific variables

2. **Production**:
   - Create a `.env.production` file
   - Set production-specific variables

3. **Loading environment variables**:
   ```javascript
   // In your application
   require('dotenv').config({
     path: `.env.${process.env.NODE_ENV}`
   });
   ```

### Secrets Management

For sensitive information, use the cloud provider's secrets management:

- **AWS**: AWS Secrets Manager
- **GCP**: Google Secret Manager
- **Azure**: Azure Key Vault

## Continuous Deployment

### GitHub Actions

Example GitHub Actions workflow for continuous deployment:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: myregistry.azurecr.io/my-app:latest
          
      - name: Deploy to AKS
        uses: azure/k8s-deploy@v1
        with:
          manifests: kubernetes/deployment.yaml
```

## Monitoring and Logging

### Monitoring

Set up monitoring for your deployed application:

- **AWS**: CloudWatch
- **GCP**: Cloud Monitoring
- **Azure**: Azure Monitor

### Logging

Configure centralized logging:

- **AWS**: CloudWatch Logs
- **GCP**: Cloud Logging
- **Azure**: Azure Log Analytics

## Scaling

### Horizontal Scaling

Configure auto-scaling for your application:

- **Kubernetes**: Horizontal Pod Autoscaler
- **AWS**: ECS Service Auto Scaling
- **GCP**: GKE Cluster Autoscaler
- **Azure**: AKS Cluster Autoscaler

### Vertical Scaling

Adjust resource allocation as needed:

- Increase CPU and memory allocations
- Upgrade instance types

## Troubleshooting

### Common Deployment Issues

#### Container Startup Failures

If containers fail to start:
1. Check container logs
2. Verify environment variables
3. Ensure ports are correctly mapped

#### Network Issues

If services can't communicate:
1. Check network policies
2. Verify service discovery configuration
3. Test connectivity between services

#### Resource Constraints

If the application is slow or crashing:
1. Check resource utilization
2. Increase resource limits
3. Consider scaling horizontally
