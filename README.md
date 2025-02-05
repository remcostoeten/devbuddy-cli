# DevBuddy CLI

A modern, scalable CLI toolbox for developers that helps streamline common development tasks. DevBuddy provides an interactive CLI experience with various utilities to speed up your development workflow.

## Installation

```bash
npm install -g @devbuddy/cli
# or
pnpm add -g @devbuddy/cli
```

## Quick Start

```bash
# Run in interactive mode
devbuddy

# Run specific feature
devbuddy <feature-name>
```

## Features

- 🎯 **Interactive Mode**: Run `devbuddy` for a guided experience through all available tools
- 🚀 **Component Management**: Quickly scaffold and manage UI components
- 📦 **Package Helper**: Streamlined Next.js package installation and setup
- 🗄️ **Database Tools**: Turso database management and configuration
- 🔧 **Extensible Architecture**: Easy to add new features and commands

## Requirements

- Node.js >= 18
- Git (for some features)
- Turso CLI (for database features)

## Available Features

### 1. UI Component Manager
- Generate new components with best practices
- Choose from various component templates
- Automatic import/export management

### 2. Next.js Package Helper
- Interactive package installation
- Automatic configuration setup
- Common package presets

### 3. Turso Database Manager
Powerful database management for Turso, featuring:

#### Features
- 🚀 Database Operations
  - Create new databases with automatic credential generation
  - List and manage existing databases
  - Delete databases with safety confirmations
  - Set default databases for quick access
  - Show detailed database information

- 🔐 Credential Management
  - Generate and store database URLs and auth tokens
  - Automatic .env file management
  - Secure credential backup
  - Clipboard integration for quick access

#### Usage
```bash
# Interactive mode
devbuddy
# Then select "Turso DB Manager"

# Direct commands
devbuddy db create          # Create a new database
devbuddy db list           # List all databases
devbuddy db show [name]    # Show database details
devbuddy db delete [name]  # Delete a database
devbuddy db --help         # Show help menu
```

#### Environment Management
The tool manages these environment variables:
- `DB_URL`: Database connection URL
- `AUTH_TOKEN`: Authentication token
- `TURSO_DB_NAME`: Database name

#### Configuration
- Stores settings in `~/.turso-db-config.json`
- Manages default database preferences
- Preserves database configurations
- Automatic CLI installation and auth management

## Extending DevBuddy

DevBuddy is designed to be modular. To create a new plugin:

1. Add a new file under `src/plugins/`
2. Export your plugin object implementing the Plugin interface
3. Implement required properties and action function:
   ```typescript
   export const yourPlugin: Plugin = {
     name: 'your-plugin',
     description: 'What your plugin does',
     category: 'Your Category',
     
     async action() {
       // Your plugin logic here
     }
   }
   ```
4. Register your plugin in `src/plugins/index.ts`

### Plugin Structure

Each plugin should have:
- `name`: Unique identifier
- `description`: Clear explanation of functionality
- `category`: Group for organization (optional)
- `action`: Main function that runs when plugin is executed

### Example Plugin

```typescript
import { Plugin } from '../types/plugin'
import { logger } from '../utils/logger'

export const examplePlugin: Plugin = {
  name: 'example',
  description: 'An example plugin',
  category: 'Examples',
  
  async action() {
    logger.info('Hello from example plugin!')
    // Add your plugin logic here
  }
}
```

### Best Practices

- Keep plugins focused on a single responsibility
- Use utility functions from `src/utils`
- Add proper error handling
- Include helpful logging
- Document your plugin's usage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- [Turso](https://turso.tech/) - For their excellent database service
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) - For the interactive CLI interface
- [Chalk](https://github.com/chalk/chalk) - For beautiful terminal styling

# Turso Database Scripts

This collection of scripts helps manage and interact with Turso databases across different projects. It provides tools for both local development and production database management.

## Features

- Database creation and management
- Connection string handling
- Cross-platform support
- Multiple language implementations (Python, etc.)

## Structure
