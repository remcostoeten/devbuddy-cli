import subprocess
import re
import argparse
import os
import sys
import platform
import json
import uuid
from typing import Dict, Optional

def check_pyperclip():
    """Check if pyperclip is installed and install if missing."""
    try:
        import pyperclip
        return True, pyperclip
    except ImportError:
        print("\n❌ pyperclip is not installed but required for clipboard functionality.")
        response = input("Would you like to install it now? (Y/n): ").lower()
        
        if response != 'y' and response != '':
            print("Continuing without clipboard functionality...")
            return False, None
            
        try:
            # Try different pip installation methods
            try:
                subprocess.check_call(["pip", "install", "pyperclip"])
            except subprocess.CalledProcessError:
                try:
                    subprocess.check_call(["pip3", "install", "pyperclip"])
                except subprocess.CalledProcessError:
                    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyperclip"])
            
            print("✅ pyperclip installed successfully!")
            import pyperclip
            return True, pyperclip
        except Exception as e:
            print(f"❌ Failed to install pyperclip: {e}")
            print("You can try installing manually with: pip install pyperclip")
            print("Continuing without clipboard functionality...")
            return False, None

# Initialize pyperclip at startup
HAS_PYPERCLIP, pyperclip_module = check_pyperclip()

def check_turso_cli():
    """Check if Turso CLI is installed."""
    try:
        subprocess.run(['turso', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def get_os():
    """Detect the operating system."""
    system = platform.system().lower()
    if system == 'darwin':
        return 'macos'
    elif system == 'linux':
        return 'linux'
    elif system == 'windows':
        return 'windows'
    return None

def install_turso(os_type=None):
    """Install Turso CLI based on the operating system."""
    if not os_type:
        print("Could not automatically detect your OS.")
        while True:
            os_choice = input("Please specify your OS (macos/linux/windows): ").lower()
            if os_choice in ['macos', 'linux', 'windows']:
                os_type = os_choice
                break
            print("Invalid choice. Please enter macos, linux, or windows.")

    try:
        if os_type == 'macos':
            subprocess.run(['brew', 'install', 'tursodatabase/tap/turso'], check=True)
        elif os_type in ['linux', 'windows']:
            subprocess.run(['curl', '-sSfL', 'https://get.tur.so/install.sh', '|', 'bash'], check=True, shell=True)
        
        print("\n✅ Turso CLI installed successfully!")
        print("\nPlease authenticate with Turso by running:")
        print("turso auth signup")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Failed to install Turso CLI: {str(e)}")
        return False

def check_turso_auth():
    """Check if the user is authenticated with Turso CLI."""
    try:
        result = subprocess.run(['turso', 'auth', 'status'], capture_output=True, text=True, check=True)
        if "You are not logged in" in result.stdout:
            return False
        return True
    except subprocess.CalledProcessError:
        return False

def prompt_for_auth():
    """Prompt user to authenticate with Turso."""
    print("\n⚠️ You are not authenticated with Turso.")
    response = input("Would you like to authenticate now? (Y/n): ").lower()
    
    if response != 'y' and response != '':
        return False
        
    try:
        print("\nLaunching Turso authentication...")
        subprocess.run(['turso', 'auth', 'login'], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Authentication failed: {str(e)}")
        return False

def run_command(command):
    """Run a shell command and return its output and error (if any)."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout.strip(), result.stderr.strip(), result.returncode

def update_env_file(file_path, new_vars):
    """Update or create an environment file with new variables."""
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist. Creating new file.")
        with open(file_path, 'w') as f:
            f.write('\n'.join(f"{k}={v}" for k, v in new_vars.items()))
        return

    with open(file_path, 'r') as f:
        lines = f.readlines()

    updated_lines = []
    updated = {key: False for key in new_vars.keys()}

    for line in lines:
        line = line.strip()
        if line.startswith('#') or not line:
            updated_lines.append(line)
            continue

        key = line.split('=')[0]
        if key in new_vars:
            if not updated[key]:
                updated_lines.append(f'# Old {line}')
                updated_lines.append(f'{key}={new_vars[key]}')
                updated[key] = True
        else:
            updated_lines.append(line)

    for key, value in new_vars.items():
        if not updated[key]:
            updated_lines.append(f'{key}={value}')

    with open(file_path, 'w') as f:
        f.write('\n'.join(updated_lines) + '\n')

def find_project_root():
    """Find the project root by looking for .git directory or pyproject.toml file."""
    current_dir = os.getcwd()
    while True:
        if os.path.exists(os.path.join(current_dir, '.git')) or \
           os.path.exists(os.path.join(current_dir, 'pyproject.toml')):
            return current_dir
        parent = os.path.dirname(current_dir)
        if parent == current_dir:
            return None
        current_dir = parent

class ConfigManager:
    CONFIG_FILE = os.path.expanduser('~/.turso-db-config.json')
    DEFAULT_CONFIG = {
        'default_database_name': None,
        'databases': {}
    }

    @classmethod
    def load_config(cls) -> Dict:
        try:
            if os.path.exists(cls.CONFIG_FILE):
                with open(cls.CONFIG_FILE, 'r') as f:
                    return json.load(f)
            return cls.DEFAULT_CONFIG.copy()
        except Exception as e:
            print(f"Error loading config: {e}")
            return cls.DEFAULT_CONFIG.copy()

    @classmethod
    def save_config(cls, config: Dict) -> None:
        try:
            with open(cls.CONFIG_FILE, 'w') as f:
                json.dump(config, f, indent=2)
        except Exception as e:
            print(f"Error saving config: {e}")

    @classmethod
    def get_default_database_name(cls) -> Optional[str]:
        config = cls.load_config()
        return config.get('default_database_name')

    @classmethod
    def set_default_database_name(cls, name: str) -> None:
        config = cls.load_config()
        config['default_database_name'] = name
        cls.save_config(config)

def get_clipboard_handler():
    """
    Get a clipboard handler that works across different platforms.
    Falls back to manual copy if clipboard access fails.
    """
    if not HAS_PYPERCLIP:
        def manual_copy(text):
            print("\nℹ️  Clipboard functionality not available. Please copy manually:")
            print(text)
        return manual_copy
    
    os_type = platform.system().lower()
    
    if os_type == 'darwin':  # macOS
        def mac_clipboard(text):
            try:
                subprocess.run(['pbcopy'], input=text.encode('utf-8'), check=True)
                return True
            except:
                return pyperclip_module.copy(text)
        return mac_clipboard
    
    elif os_type == 'windows':
        def win_clipboard(text):
            try:
                subprocess.run(['clip'], input=text.encode('utf-8'), check=True)
                return True
            except:
                return pyperclip_module.copy(text)
        return win_clipboard
    
    else:  # Linux and others
        def linux_clipboard(text):
            try:
                # Try xclip first
                subprocess.run(['xclip', '-selection', 'clipboard'], input=text.encode('utf-8'), check=True)
                return True
            except:
                try:
                    # Try xsel next
                    subprocess.run(['xsel', '--clipboard', '--input'], input=text.encode('utf-8'), check=True)
                    return True
                except:
                    # Fall back to pyperclip
                    return pyperclip_module.copy(text)
        return linux_clipboard

def create_database(db_name: str) -> bool:
    try:
        output = subprocess.check_output(['turso', 'db', 'create', db_name], 
                                      stderr=subprocess.STDOUT,
                                      text=True)
        print(output)
        return "created" in output.lower()
    except subprocess.CalledProcessError as e:
        print(f"Error creating database: {e.output}")
        return False

def get_database_url(db_name: str) -> Optional[str]:
    try:
        output = subprocess.check_output(['turso', 'db', 'show', db_name, '--url'], 
                                      text=True)
        return output.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error getting database URL: {e.output}")
        return None

def create_auth_token(db_name: str) -> Optional[str]:
    try:
        output = subprocess.check_output(['turso', 'db', 'tokens', 'create', db_name], 
                                      text=True)
        return output.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error creating auth token: {e.output}")
        return None

def copy_to_clipboard(text: str) -> bool:
    """Copy text to clipboard with fallback options."""
    if not HAS_PYPERCLIP:
        print("\nℹ️  Clipboard functionality not available. Manual copy required:")
        print(text)
        return False

    try:
        pyperclip_module.copy(text)
        return True
    except Exception as e:
        print(f"\n❌ Couldn't copy to clipboard: {e}")
        print("Manual copy required:")
        print(text)
        return False

def list_databases():
    """List all available databases."""
    try:
        output = subprocess.run(['turso', 'db', 'list'], 
                              capture_output=True, 
                              text=True, 
                              check=True)
        print("\nAvailable Databases:")
        print(output.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error listing databases: {e}")
        return False

def delete_database(db_name: str) -> bool:
    """Delete a specified database."""
    try:
        confirm = input(f"Are you sure you want to delete {db_name}? (y/N): ").lower()
        if confirm != 'y':
            print("Operation cancelled")
            return False
            
        subprocess.run(['turso', 'db', 'destroy', db_name], check=True)
        print(f"\n✅ Database {db_name} deleted successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error deleting database: {e}")
        return False

def setup_argparse():
    parser = argparse.ArgumentParser(description='Turso Database Manager')
    parser.add_argument('--overwrite', metavar='PATH', 
                       help='Path to .env or .env.local file to overwrite')
    parser.add_argument('--name', help='Specify a custom database name')
    parser.add_argument('--list', action='store_true', 
                       help='List all databases')
    parser.add_argument('--delete', metavar='DB_NAME',
                       help='Delete specified database')
    return parser

def main():
    # Check for Turso CLI installation
    if not check_turso_cli():
        print("❌ Turso CLI is not installed but required for this script.")
        response = input("Would you like to install it now? (Y/n): ").lower()
        
        if response != 'y' and response != '':
            print("Exiting script. Please install Turso CLI manually to continue.")
            sys.exit(1)
        
        os_type = get_os()
        if not install_turso(os_type):
            sys.exit(1)

    # Check for Turso authentication
    if not check_turso_auth():
        if not prompt_for_auth():
            print("Authentication required. Please run turso auth login manually.")
            sys.exit(1)

    # Set up argument parser
    parser = setup_argparse()
    args = parser.parse_args()

    # Initialize config
    config = ConfigManager.load_config()
    
    # Get database name
    db_name = ConfigManager.get_default_database_name()
    if not db_name:
        db_name = input("Enter database name: ").strip()
        if not db_name:
            print("Database name is required")
            return

    # Create database
    if not create_database(db_name):
        return

    # Get URL and create token
    db_url = get_database_url(db_name)
    auth_token = create_auth_token(db_name)

    if not db_url or not auth_token:
        print("Failed to get database URL or auth token")
        return

    # Store in config
    ConfigManager.set_default_database_name(db_name)

    # Prepare environment variables
    env_vars = {
        'DB_URL': db_url,
        'AUTH_TOKEN': auth_token
    }

    # Copy to clipboard
    env_string = " ".join(f"{k}={v}" for k, v in env_vars.items())
    if copy_to_clipboard(env_string):
        print("\n✅ Credentials copied to clipboard!")

    # Update .env if requested
    should_update = input("\nUpdate .env file? (y/N): ").lower() == 'y'
    if should_update:
        env_path = input("Enter path to .env file (default: .env): ").strip() or '.env'
        update_env_file(env_path, env_vars)
        print(f"\nUpdated {env_path}")

    # Show database details
    print(f"\nRetrieving details for database: {db_name}")
    show_output, show_error, show_code = run_command(f"turso db show {db_name}")
    
    if show_code != 0:
        print(f"Error showing database details: {show_error}")
        sys.exit(1)

    # Extract URL from show output
    url_match = re.search(r'URL:\s+(libsql://[\w.-]+)', show_output)
    db_url = url_match.group(1) if url_match else "URL not found"

    # Create a new token
    print(f"\nCreating token for database: {db_name}")
    token_output, token_error, token_code = run_command(f"turso db tokens create {db_name}")
    
    if token_code != 0:
        print(f"Error creating token: {token_error}")
        sys.exit(1)

    auth_token = token_output.strip()

    # Generate environment variables
    new_vars = {"DB_URL": db_url, "AUTH_TOKEN": auth_token}
    env_vars = f"DB_URL={db_url}\nAUTH_TOKEN={auth_token}"

    print("\nGenerated Environment Variables:")
    print(env_vars)

    # Save to env file if specified
    project_root = find_project_root()
    if args.overwrite and project_root:
        update_env_file(os.path.join(project_root, args.overwrite), new_vars)
        print(f"\nEnvironment variables have been updated in {args.overwrite}")
    elif args.overwrite:
        print("Could not find project root to update environment file.")

    # Cross-platform clipboard handling
    clipboard_handler = get_clipboard_handler()
    clipboard_handler(env_vars)
    print("Environment variables have been copied to clipboard.")

    print("\nMuch love xxx remcostoeten")

if __name__ == "__main__":
    main()