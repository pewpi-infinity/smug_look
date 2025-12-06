# mongoose.os - Infinity Portal

Trick bike Freestyle BMX scripting meets AI-powered ecosystem development.

## Rogers AI Console

An interactive AI console with voice capabilities, token-based rewards, and GitHub integration.

### Quick Start

#### Frontend Only (Testing)
1. Open `rogers-ai-console.html` in your web browser
2. Enable "Force enable" checkbox to test without backend
3. Interact with the console UI

#### With Backend
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the backend server:
   ```bash
   python rogers_backend.py
   ```

3. Open `rogers-ai-console.html` in your browser
4. The console should connect automatically to `http://127.0.0.1:5000`

### Features

- **Interactive Chat Interface**: Clean, modern UI with blue buttons and dark theme
- **Token System**: Color-coded interactive tokens for different actions
  - 🟡 Yellow: Applications/Clickable items
  - 🟣 Purple: Published/Public content
  - 🔵 Blue: Input prompts
  - 🟢 Green: Completed tasks
  - 🟠 Orange: Warnings/Risks
  - 🔴 Red: Errors
- **Voice Support**: Built-in TTS capability
- **GitHub Integration**: Code search and commit operations
- **Encryption**: Dual-AI encryption for sensitive data
- **Token Wallet**: Earn and spend tokens for interactions

### Files

- `rogers-ai-console.html` - Main UI interface
- `rogers_backend.py` - Python Flask backend
- `infinity-utils.js` - JavaScript utilities for encryption, GitHub, and authentication
- `INFINITY_CONFIG.md` - Complete ecosystem configuration and documentation
- `requirements.txt` - Python dependencies

### Infinity Ecosystem

This is part of a larger vision for the Infinity Portal ecosystem, which includes:

- **Core Apps**: Wallet, Idea Cloud, Market, Voice, Builder
- **Media District**: Times, Science Journal, Magazines, Investigates
- **Music & Cinema**: Instrument Lab, Soundcloud, Players, Cinema
- **Governance**: Operation Trident, Vision Hub, Horizon Mapper
- **Engineering**: Machinist Tools, Boundary Control

See `INFINITY_CONFIG.md` for complete details.

### Configuration

#### Voice UI (ElevenLabs)
To enable advanced voice synthesis, add your ElevenLabs API key to the configuration.

#### GitHub Integration
1. Generate a GitHub Personal Access Token (PAT)
2. Store it securely in your browser's session storage
3. Use the `setToken()` function in `infinity-utils.js`

### Development

The codebase follows these principles:
- **Minimal changes**: Surgical, precise modifications
- **Security first**: Encryption and secure token handling
- **User experience**: Clean, intuitive interface
- **Extensibility**: Modular design for future enhancements

### Contributing

This is an experimental platform combining AI, voice interaction, and gamification. Contributions welcome!
# mongoose.os
Trick bike Freestyle BMX scripting

## Logged Octave Shell

This repository provides a logged wrapper for GNU Octave that captures all inputs and outputs with timestamps.

### Files

- **`run_octave_logged.py`** - Main script to run Octave with logging
- **`log_server.py`** - HTTP server to view logs via web interface
- **`index.html`** - Web UI for log viewing
- **`logs/txt.log`** - Log file (created automatically)

### Installation

1. Install GNU Octave:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install octave
   
   # macOS
   brew install octave
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/pewpi-infinity/mongoose.os.git
   cd mongoose.os
   ```

### Usage

#### Running the Logged Octave Shell

```bash
python3 run_octave_logged.py
```

**Behavior:**
- Every user input is logged as `[TIMESTAMP] [IN] ...`
- Every Octave response is logged as `[TIMESTAMP] [OUT] ...`
- Logs are saved to `logs/txt.log`

**Example:**
```
octave> x = 5
x = 5
octave> y = x * 2
y = 10
octave> quit
```

This will create log entries like:
```
[2025-12-06 02:05:41] [IN] x = 5
[2025-12-06 02:05:41] [OUT] x = 5
[2025-12-06 02:05:45] [IN] y = x * 2
[2025-12-06 02:05:45] [OUT] y = 10
[2025-12-06 02:05:48] [IN] quit
```

#### Viewing Logs via Web Interface

In a separate terminal, start the log server:

```bash
python3 log_server.py
```

Then open your browser to: `http://localhost:8000/`

**Features:**
- Real-time log viewing
- Auto-refresh option (every 5 seconds)
- Syntax highlighting for inputs/outputs
- Clear logs functionality
- Responsive dark theme interface

### Mathematical Context

This tool is designed to help explore complex mathematical problems and equations, including:

1. **Three-body problem** - Gravitational interactions
2. **Navier-Stokes equations** - Fluid dynamics
3. **Yang-Mills theory** - Quantum field theory
4. **Riemann hypothesis** - Number theory
5. **And many more...**

The logged shell allows you to experiment with numerical solutions and maintain a complete history of your computational experiments.

### API Endpoints

The log server provides the following API endpoints:

- `GET /` - Serves the web interface
- `GET /api/logs` - Returns log content as JSON
- `GET /api/clear` - Clears the log file

### Development

To contribute or modify:

1. Fork the repository
2. Make your changes
3. Test with Octave installed
4. Submit a pull request

### License

See repository license for details.
