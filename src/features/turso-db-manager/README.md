# Turso DB Manager

A powerful database management feature for Turso databases, integrated into DevBuddy CLI. This feature provides a seamless interface for managing your Turso databases, including creation, configuration, and maintenance.

## Features

- 🚀 Easy database creation and management
- 🔐 Automatic authentication handling
- 🔄 Environment variable management
- 📋 Database URL and auth token generation
- 🗑️ Database deletion capabilities
- 📝 Configuration persistence
- 📋 Clipboard integration for credentials

## Prerequisites

- Turso CLI (automatically installed if not present)
- Node.js and npm/yarn/pnpm

## Usage

The Turso DB Manager can be used through the DevBuddy CLI interface. Here are the main operations available:

### Creating a New Database

```bash
devbuddy db create [name]
```

This will:
1. Check for Turso CLI installation
2. Verify authentication status
3. Create a new database
4. Generate database URL and auth token
5. Update your .env file with the credentials

### Managing Existing Databases

You can:
- List all databases
- Show database details
- Delete databases
- Set default database
- Copy credentials to clipboard

### Environment Variables

The feature automatically manages the following environment variables:
- `TURSO_DB_URL`: Your database connection URL
- `TURSO_DB_AUTH_TOKEN`: Authentication token for database access

### Configuration

The feature maintains a configuration file at `~/.turso-db-config.json` which stores:
- Default database name
- Database configurations
- User preferences

## Error Handling

The feature includes comprehensive error handling for:
- CLI installation issues
- Authentication failures
- Database operation errors
- Environment file updates
- Configuration management

## Security

- Credentials are stored securely in your .env file
- Authentication tokens are generated securely through Turso's official CLI
- Configuration file permissions are properly managed

## Troubleshooting

If you encounter issues:

1. Verify Turso CLI installation: `turso --version`
2. Check authentication: `turso auth status`
3. Ensure proper permissions for configuration files
4. Check your .env file for correct variable format

## Contributing

Feel free to submit issues and enhancement requests!
