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

### Prerequisites

1. Create an npm account at https://www.npmjs.com/signup
2. Create the `@devbuddy` organization/scope:
   ```bash
   npm org create devbuddy
   ```
   Or create it manually at https://www.npmjs.com/org/create

3. Add yourself to the organization:
   ```bash
   npm org add @devbuddy <your-npm-username>
   ```

### Publishing Steps

```bash
# 1. Make sure you're authenticated with npm
npm adduser     # If you've never logged in before
# OR
npm login       # If you already have an account

# 2. Fix any package.json issues
npm pkg fix     # Fixes common package.json errors

# 3. Update version in package.json
npm version patch   # for bug fixes
npm version minor   # for new features
npm version major   # for breaking changes

# 4. Build the project
npm run build

# 5. Publish to npm
npm publish --access public
```

Note: If you get scope-related errors:
1. Make sure the `@devbuddy` organization exists on npm
2. Verify you're a member of the organization (`npm org ls @devbuddy`)
3. Ensure you have publish rights (`npm access ls-collaborators @devbuddy/cli`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
