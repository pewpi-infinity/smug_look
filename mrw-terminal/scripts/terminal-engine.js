/**
 * MRW Terminal Engine
 * Animated interactive terminal with typing detection and character spawning
 */

class MRWTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.typingActive = false;
    this.lastTypingTime = 0;
    this.commandHistory = [];
    this.activeAnimations = [];
    
    this.init();
  }
  
  init() {
    this.createTerminalUI();
    this.attachEventListeners();
    this.startAnimationLoop();
  }
  
  createTerminalUI() {
    this.container.innerHTML = `
      <div class="mrw-terminal-wrapper">
        <div class="mrw-terminal-header">
          <span class="mrw-terminal-title">🍄 MRW Interactive Terminal</span>
          <div class="mrw-terminal-controls">
            <button class="mrw-btn" id="mrw-clear">Clear</button>
            <button class="mrw-btn" id="mrw-interests">Interests</button>
          </div>
        </div>
        <div class="mrw-animation-layer" id="mrw-animation-layer"></div>
        <div class="mrw-terminal-body" id="mrw-terminal-body">
          <div class="mrw-output" id="mrw-output">
            <div class="mrw-welcome">
              🎮 Welcome to MRW Terminal!
              Type to see cars drive by, explore interests, and interact with Mario & Luigi!
              
              Available commands:
              - help: Show available commands
              - interests: Explore technical interests
              - mario: Summon Mario
              - luigi: Summon Luigi
              - clear: Clear terminal
            </div>
          </div>
          <div class="mrw-input-line">
            <span class="mrw-prompt">mrw:~$</span>
            <input type="text" class="mrw-input" id="mrw-input" autocomplete="off" autofocus />
          </div>
        </div>
      </div>
    `;
  }
  
  attachEventListeners() {
    const input = document.getElementById('mrw-input');
    const clearBtn = document.getElementById('mrw-clear');
    const interestsBtn = document.getElementById('mrw-interests');
    
    input.addEventListener('input', () => this.onTyping());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(input.value);
        input.value = '';
      }
    });
    
    clearBtn.addEventListener('click', () => this.clearTerminal());
    interestsBtn.addEventListener('click', () => this.showInterests());
  }
  
  onTyping() {
    this.typingActive = true;
    this.lastTypingTime = Date.now();
    
    // Random chance to spawn a car while typing
    if (Math.random() > 0.85) {
      this.spawnCar();
    }
    
    // Reset typing status after 500ms of inactivity
    setTimeout(() => {
      if (Date.now() - this.lastTypingTime >= 500) {
        this.typingActive = false;
      }
    }, 500);
  }
  
  spawnCar() {
    const cars = ['🚗', '🏎️', '🚙', '🚕', '🚐', '🚛'];
    const messages = [
      'Speeding through your code!',
      'Fast compile ahead!',
      'Delivering fresh logic!',
      'Taxi to success!'
    ];
    
    const car = cars[Math.floor(Math.random() * cars.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const direction = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';
    
    const animationLayer = document.getElementById('mrw-animation-layer');
    const carEl = document.createElement('div');
    carEl.className = `mrw-car mrw-car-${direction}`;
    carEl.innerHTML = `<span class="mrw-car-icon">${car}</span><span class="mrw-car-message">${message}</span>`;
    carEl.style.top = `${Math.random() * 80 + 10}%`;
    
    animationLayer.appendChild(carEl);
    
    setTimeout(() => carEl.remove(), 4000);
  }
  
  executeCommand(cmd) {
    const trimmedCmd = cmd.trim().toLowerCase();
    this.commandHistory.push(cmd);
    this.addOutput(`> ${cmd}`);
    
    switch(trimmedCmd) {
      case 'help':
        this.showHelp();
        break;
      case 'interests':
        this.showInterests();
        break;
      case 'mario':
        this.summonMario();
        break;
      case 'luigi':
        this.summonLuigi();
        break;
      case 'clear':
        this.clearTerminal();
        break;
      case 'electronics':
      case 'chemistry':
      case 'mathematics':
      case 'robotics':
      case 'construction':
        this.openInterest(trimmedCmd);
        break;
      default:
        if (trimmedCmd) {
          this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
    }
  }
  
  showHelp() {
    this.addOutput(`
Available Commands:
  help        - Show this help message
  interests   - Show technical interest categories
  mario       - Summon Mario to guide you
  luigi       - Summon Luigi companion
  clear       - Clear terminal output
  
Technical Interests:
  electronics - Electronics & Signal Processing Lab
  chemistry   - Chemistry & Molecular Science Lab
  mathematics - Mathematics & Equations Explorer
  robotics    - Robotics & Automation Workshop
  construction - Construction & Engineering Site
    `);
  }
  
  showInterests() {
    this.addOutput(`
🔬 Technical Interest Categories:

🔌 electronics  - Oscilloscope, signal generators, circuit design
🧪 chemistry    - Periodic table, molecular builder, reactions
📐 mathematics  - Equation solver, graph plotter, fractals
🤖 robotics     - Robot designer, automation, sensors
🏗️ construction - Blueprint editor, structure builder, materials

Type an interest name to explore!
    `);
  }
  
  summonMario() {
    this.addOutput(`👨🏻 Mario: Wahoo! Let's-a-go explore the labs!`);
    this.spawnCharacter('mario', '👨🏻', 'Check out the electronics lab!');
  }
  
  summonLuigi() {
    this.addOutput(`👨🏻‍🔧 Luigi: Hey! I'm here to help you build something great!`);
    this.spawnCharacter('luigi', '👨🏻‍🔧', 'Stay focused, everything you need is here!');
  }
  
  spawnCharacter(type, icon, message) {
    const animationLayer = document.getElementById('mrw-animation-layer');
    const charEl = document.createElement('div');
    charEl.className = `mrw-character mrw-character-${type}`;
    charEl.innerHTML = `
      <div class="mrw-character-icon">${icon}</div>
      <div class="mrw-character-bubble">${message}</div>
    `;
    charEl.style.bottom = '20px';
    charEl.style.left = '-100px';
    
    animationLayer.appendChild(charEl);
    
    // Walk across screen
    setTimeout(() => {
      charEl.style.left = '50%';
      charEl.style.transform = 'translateX(-50%)';
    }, 100);
    
    // Remove after showing
    setTimeout(() => charEl.remove(), 5000);
  }
  
  openInterest(interest) {
    this.addOutput(`🚀 Opening ${interest} lab...`);
    // Open in new page/modal
    window.location.href = `interests/${interest}/index.html`;
  }
  
  addOutput(text) {
    const output = document.getElementById('mrw-output');
    const line = document.createElement('div');
    line.className = 'mrw-output-line';
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }
  
  clearTerminal() {
    const output = document.getElementById('mrw-output');
    output.innerHTML = '';
  }
  
  startAnimationLoop() {
    setInterval(() => {
      // Check for idle state
      if (Date.now() - this.lastTypingTime > 30000) {
        // Show encouraging character after 30s idle
        if (Math.random() > 0.7) {
          this.summonMario();
        }
      }
    }, 10000);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.mrwTerminal = new MRWTerminal('mrw-terminal-container');
});
