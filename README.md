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

### License

See repository license for details.
