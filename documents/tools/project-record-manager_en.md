# Project Record Manager for CMM

## Overview

Project Record Manager (PRM) is a tool for managing development records in Containerized Modular Monolith (CMM) projects. It helps document architecture decisions, implementation details, and change history in a consistent format, enhancing project transparency and maintainability.

## Features

- **Module Support**: Record management tailored to each CMM module
- **Consistent Format**: Standardized templates for record creation
- **Multiple Package Manager Support**: Compatible with npm, yarn, and pnpm
- **Turborepo Integration**: Seamless integration with pnpm-turbo template
- **Automatic Configuration**: Self-configuring based on project structure

## Installation

CMM templates include a setup script for easy integration of Project Record Manager.

```bash
# Set up PRM
node scripts/setup-prm.js
```

This command performs the following:

1. Automatic detection of package manager (npm/yarn/pnpm)
2. Installation of Project Record Manager
3. Addition of scripts to package.json
4. Initial configuration for CMM projects
5. Detection of module structure and directory setup

## Basic Usage

### Creating Records

```bash
# With npm
npm run prm:create

# With yarn
yarn prm:create

# With pnpm
pnpm prm:create
```

Follow the interactive prompts to enter:

- Title: Record title
- Description: Detailed description of the record
- Directory: Directory to save the record (module name)

### Changing Configuration

```bash
npm run prm:config
```

Configurable options:

- Naming pattern
- Directory structure
- Record template
- Default directory

## CMM-Specific Features

### Automatic Module Structure Detection

Project Record Manager automatically detects the module structure of CMM projects and configures document directories for each module.

```
documents/
└── architecture/
    ├── core/         # Core functionality records
    ├── api-gateway/  # API Gateway records
    └── modules/
        ├── module-a/ # Module A records
        ├── module-b/ # Module B records
        └── ...
```

### CMM-Optimized Template

An optimized record template for CMM projects is provided.

```markdown
# {title}

## Overview

{description}

## Module Details

- **Module**: {module}
- **Dependencies**: 

## Implementation Details

- 

## Architecture Decisions

- 

## Notes

- 

## References

- 
```

## Advanced Usage

### Validating Records

Validate that existing records follow the correct format.

```bash
npm run prm -- validate
```

### Generating Summaries

Generate a summary of records in the project.

```bash
npm run prm -- summary
```

### Listing Directories

Display a list of configured directories.

```bash
npm run prm -- list
```

## Turborepo Integration

In the pnpm-turbo template, integration with Turborepo is automatically configured. PRM-related pipelines are added to `turbo.json`, enabling consistent record management across the entire workspace.

```json
{
  "pipeline": {
    "prm": {
      "cache": false,
      "dependsOn": []
    }
  }
}
```

## Best Practices

### When to Create Records

We recommend creating records at the following times:

- When making important architectural decisions
- When adding new modules
- When making significant changes to existing modules
- When fixing critical bugs
- When introducing new technologies or libraries

### Record Content

Effective records should include the following elements:

- **Clear Title**: A title that immediately indicates what the record is about
- **Detailed Description**: Background information and purpose
- **Module Details**: Affected modules and dependencies
- **Implementation Details**: Technical implementation methods
- **Architecture Decisions**: Why the design was chosen
- **References**: Related documents or resources

## Troubleshooting

### Setup Failures

- Ensure Node.js version is v14.0.0 or higher
- Verify you're running the command from the project root directory
- For manual installation, run:

```bash
npm install project-record-manager
npx project-record-manager setup-cmm
```

### Record Creation Failures

- Check that the configuration file was generated correctly
- Verify that the `.prm-config.json` file exists
- If permission issues occur, check directory access rights

## Customization

### Template Customization

To use your own template, change the configuration with:

```bash
npm run prm -- config template
```

Follow the prompts to enter a new template.

### Naming Pattern Customization

To change the naming pattern for record files:

```bash
npm run prm -- config pattern
```

## References

- [Project Record Manager GitHub Repository](https://github.com/ancient0328/project-record-manager)
- [CMM Template Documentation](https://github.com/ancient0328/containerized-modular-monolith)
