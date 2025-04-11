/**
 * English localization for setup wizard
 */
module.exports = {
  welcome: {
    title: "Containerized Modular Monolith Framework Setup Wizard",
    description: "This wizard will guide you through the initial setup of the Containerized Modular Monolith Framework.",
    instructions: "Answer each question to customize your project configuration."
  },
  project: {
    namePrompt: "Enter project name: ",
    nameConfirm: "Project name: "
  },
  modules: {
    frontendPrompt: "Do you want to use frontend modules? (y/n): ",
    backendPrompt: "Do you want to use backend modules? (y/n): "
  },
  frontend: {
    title: "Select a frontend framework:",
    option1: "1. Svelte",
    option2: "2. React",
    option3: "3. Vue",
    prompt: "Select (1-3): ",
    confirm: "Selected framework: "
  },
  backend: {
    title: "Select a backend framework:",
    option1: "1. Express",
    option2: "2. NestJS",
    option3: "3. Fastify",
    prompt: "Select (1-3): ",
    confirm: "Selected framework: "
  },
  packageManager: {
    title: "Select a package manager:",
    option1: "1. npm (default)",
    option2: "2. yarn",
    option3: "3. pnpm",
    prompt: "Select (1-3): ",
    confirm: "Selected package manager: "
  },
  cloudProvider: {
    title: "Select a cloud provider:",
    option1: "1. None (local development only)",
    option2: "2. AWS",
    option3: "3. GCP/Firebase",
    option4: "4. Azure",
    prompt: "Select (1-4): ",
    confirm: "Selected cloud provider: "
  },
  confirmation: {
    title: "Confirm Setup",
    projectName: "Project name: ",
    frontend: "Frontend: ",
    frontendYes: "Yes",
    frontendNo: "No",
    frontendFramework: "- Framework: ",
    backend: "Backend: ",
    backendYes: "Yes",
    backendNo: "No",
    backendFramework: "- Framework: ",
    packageManager: "Package manager: ",
    cloudProvider: "Cloud provider: ",
    prompt: "Proceed with this configuration? (y/n): "
  },
  initialization: {
    title: "Project Initialization",
    configSaved: "Configuration saved: containerized-modular-monolith.config.json",
    creatingDirectories: "Creating necessary directories...",
    setupFrontend: "Setting up frontend modules...",
    setupBackend: "Setting up backend modules...",
    installingDependencies: "Installing dependencies..."
  },
  completion: {
    title: "Setup Complete!",
    message: "The Containerized Modular Monolith Framework setup is complete.",
    startInstructions: "You can start your project with the following commands:",
    frontendStart: "  npm run dev:frontend",
    backendStart: "  npm run dev:backend",
    documentation: "For detailed documentation, please refer to the docs/ directory."
  },
  errors: {
    setupCancelled: "Setup cancelled. Run the script again to reconfigure.",
    generalError: "An error occurred: "
  }
};
