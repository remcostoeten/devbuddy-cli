# DevBuddy CLI

A modern, scalable CLI toolbox for developers that helps streamline common development tasks. DevBuddy provides an interactive CLI experience with various utilities to speed up your development workflow.

## Features

- 🎯 **Interactive Mode**: Run `devbuddy` for a guided experience through all available tools
- 🚀 **Component Management**: Quickly scaffold and manage UI components
- 📦 **Package Helper**: Streamlined Next.js package installation and setup
- 🗄️ **Database Tools**: Turso database management and configuration
- 🔧 **Extensible Architecture**: Easy to add new modules and commands

## Available Modules

### 1. UI Component Manager
- Generate new components with best practices
- Choose from various component templates
- Automatic import/export management

### 2. Next.js Package Helper
- Interactive package installation
- Automatic configuration setup
- Common package presets

### 3. Turso Database Manager
- Create and manage Turso databases
- Token management
- Environment file updates
- Credential backups

## Extending DevBuddy

DevBuddy is designed to be modular. To create a new module:

1. Add a new directory under `src/modules/`
2. Create your module class extending the base Module class
3. Implement required methods:
   ```typescript
   export class YourModule extends BaseModule {
     public name = 'your-module';
     public description = 'What your module does';
     
     async execute(): Promise<void> {
       // Your module logic here
     }
   }
   ```
4. Register your module in `src/modules/index.ts`

For detailed development guidelines, check out our [contribution guide](CONTRIBUTING.md).

## Basic Usage

```bash
npm install -g @devbuddy/cli
# or
pnpm add -g @devbuddy/cli

# Run in interactive mode
devbuddy

# Run specific module
devbuddy <module-name>
```

## Requirements

- Node.js >= 18
- Git (for some features)
- Turso CLI (for database features)

## Publishing

To publish a new version:

```bash
# 1. Update version in package.json
npm version patch   # for bug fixes
npm version minor   # for new features
npm version major   # for breaking changes

# 2. Build the project
npm run build

# 3. Publish to npm
npm publish --access public

# Note: Make sure you're logged in to npm:
npm login
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
