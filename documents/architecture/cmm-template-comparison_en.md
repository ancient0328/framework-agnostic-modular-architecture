# Containerized Modular Monolith Architecture Template Comparison

## Overview

| Feature | pnpm & Turborepo Version | Flexible Version |
|---------|--------------------------|------------------|
| **Package Manager** | Fixed to pnpm | Flexible support for npm/yarn/pnpm |
| **Build Tool** | Fixed to Turborepo | Standard tools from package managers |
| **Frontend** | Fixed configuration | Multiple framework support |
| **Directory Structure** | `dashboard/`, `shared/` | `frontend/`, no shared code |
| **Node.js Requirement** | 18.x or higher | 14.x or higher |
| **Initialization Process** | Manual setup | Interactive script |
| **Project Record Management** | Supported | Supported |

## Structural Comparison

| Feature | pnpm & Turborepo Version | Flexible Version |
|---------|--------------------------|------------------|
| **Directory Structure** | `dashboard/`, `documents/`, `shared/` | `frontend/`, `docs/`, no shared directory |
| **Package Management** | Fixed to pnpm | Flexible support for npm/yarn/pnpm |
| **Frontend** | Assumes specific framework | Multiple framework support |
| **Module Interaction** | Shared code (`shared/`) | API-based loose coupling |
| **Documentation Management** | Structured documentation | Simple documentation |

## Functional Comparison

| Feature | pnpm & Turborepo Version | Flexible Version |
|---------|--------------------------|------------------|
| **Initialization Process** | Manual setup | Interactive script |
| **Asset Synchronization** | Depends on Turborepo | Independent script |
| **Development Workflow** | Based on pnpm/Turbo | Package manager neutral |
| **Extensibility** | Fixed structure | Plugin-like extensions |
| **Project Records** | Integrated PRM | Integrated PRM |

## Adoption Comparison

| Feature | pnpm & Turborepo Version | Flexible Version |
|---------|--------------------------|------------------|
| **Learning Curve** | High (requires specific tool knowledge) | Low (can use existing knowledge) |
| **Implementation Cost** | High (complex environment setup) | Low (interactive setup) |
| **Customizability** | Limited | High |
| **Community Compatibility** | Limited | Broad |

## Overall Evaluation

**pnpm & Turborepo Version**:
- Optimized for projects using pnpm and Turborepo
- Advanced build optimization with Turborepo
- Consistent development environment for quality control
- Performance improvements for large-scale projects

**Advantages of Flexible Version**:
- Supports diverse development environments and technology stacks
- Significantly reduces implementation and learning costs
- Flexible customization and extensibility
- Compatible with a wide range of developer communities
- Rapid development for small to medium-sized projects

## Development Tools

Both templates provide the following development tools:

### Asset Synchronization

A system that automatically copies shared assets to each module's appropriate directory.

### Project Record Management

Uses Project Record Manager (PRM) to document architecture decisions and implementation details in a consistent format.

For detailed documentation, see [Project Record Manager for CMM](../tools/project-record-manager_en.md).
