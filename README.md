# DevBuddy CLI

A modern, scalable CLI toolbox for developers that helps streamline common development tasks.

## Features

- 🚀 Interactive UI Component Management
- 📦 Next.js Package Installation Helper
- 🗄️ Turso Database Manager
- 🔧 More tools coming soon!

## Installation

```bash
npm install -g @devbuddy/cli
# or
pnpm add -g @devbuddy/cli
# or
yarn global add @devbuddy/cli
```

## Usage

Run the CLI in interactive mode:
```bash
devbuddy
```

Or use specific commands:
```bash
devbuddy help                # Show help menu
devbuddy interactive        # Start interactive mode
devbuddy turso-db-manager  # Manage Turso databases
```

### Turso Database Manager

The Turso DB manager helps you quickly create and manage Turso databases. Features include:

- Create new Turso databases with a single command
- Automatically generate and manage authentication tokens
- Update .env files with database credentials
- Backup old credentials when updating .env files

Requirements:
- Turso CLI installed (`brew install tursodatabase/tap/turso`)
- Authenticated with Turso (`turso auth login`)

## Requirements

- Node.js >= 18
- Git (for some features)
- Turso CLI (for database features)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
