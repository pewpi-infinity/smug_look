// MRW Terminal Engine - Interactive Animated Terminal System
// 🍄👲🏻🏰👸🏼🐢💗⚡⚡⚡🌟👻🎮🕹️👾

class MRWTerminalEngine {
  constructor() {
    this.terminalOutput = document.getElementById('terminalOutput');
    this.terminalInput = document.getElementById('terminalInput');
    this.executeBtn = document.getElementById('executeBtn');
    this.themeSelect = document.getElementById('themeSelect');
    this.mario = document.getElementById('mario');
    this.luigi = document.getElementById('luigi');
    this.powerupIndicator = document.getElementById('powerupIndicator');
    
    this.currentTheme = 'mario';
    this.powerupActive = false;
    this.typingSpeed = 0;
    this.lastTypingTime = Date.now();
    this.coins = 0;
    this.commandHistory = [];
    
    // Configuration constants
    this.TYPING_SPEED_THRESHOLD = 10; // Typing speed to trigger car animation
    this.MOUSE_TRACKING_PROBABILITY = 0.1; // 10% chance to react to mouse
    
    this.init();
  }
  
  init() {
    // Event listeners
    this.executeBtn.addEventListener('click', () => this.executeCommand());
    this.terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.executeCommand();
      this.trackTypingSpeed();
    });
    
    this.themeSelect.addEventListener('change', (e) => {
      this.switchTheme(e.target.value);
    });
    
    // Joystick controls
    document.querySelectorAll('.joystick-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => this.handleJoystick(btn.dataset.action));
    });
    
    document.querySelectorAll('.action-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
    });
    
    // Character interactions
    this.mario.addEventListener('click', () => this.marioSpeak());
    this.luigi.addEventListener('click', () => this.luigiSpeak());
    
    // Mouse tracking for character following
    document.addEventListener('mousemove', (e) => this.trackMouse(e));
    
    // Initial animations
    this.marioWalkIn();
    setTimeout(() => this.luigiWalkIn(), 2000);
    
    // Random mushroom spawner
    setInterval(() => this.trySpawnMushroom(), 15000);
    
    // Welcome message
    setTimeout(() => this.marioSpeak(), 1000);
  }
  
  // Command Execution
  executeCommand() {
    const command = this.terminalInput.value.trim();
    if (!command) return;
    
    this.addOutput(`> ${command}`);
    this.commandHistory.push(command);
    this.terminalInput.value = '';
    
    // Show car arriving
    this.showCar();
    
    // Process command
    this.processCommand(command);
    
    // Earn coins
    this.earnCoins(1);
  }
  
  processCommand(command) {
    const cmd = command.toLowerCase();
    
    if (cmd === 'infinity-show' || cmd.startsWith('infinity-show')) {
      this.marioSpeak();
      this.addOutput('🍄 Mario shows you around the repos!');
      this.addOutput('📦 Available repos: smug_look, mongoose.os');
      this.addOutput('✨ All repos have Legend integration and token formulas!');
      this.marioJump();
    }
    else if (cmd === 'infinity-help') {
      this.luigiSpeak();
      this.addOutput('🟢 Luigi explains the commands:');
      this.addOutput('  • infinity-show - View available repos');
      this.addOutput('  • infinity-help - Show this help');
      this.addOutput('  • infinity-boost - Activate mushroom power-up');
      this.addOutput('  • infinity-theme [name] - Switch theme');
      this.addOutput('  • infinity-search [term] - Search repos');
      this.addOutput('  • infinity-build - Build and celebrate');
      this.addOutput('  • infinity-navigate - Open joystick demo');
    }
    else if (cmd === 'infinity-boost') {
      this.activatePowerup();
      this.addOutput('🍄 POWER-UP ACTIVATED! Your progress is doubled! ✨');
      this.addOutput('💫 You jumped it loose! 🍄✨');
      this.spawnMushroom(300, 200);
    }
    else if (cmd.startsWith('infinity-theme')) {
      const theme = cmd.split(' ')[1] || 'mario';
      this.switchTheme(theme);
      this.addOutput(`🎨 Theme switched to: ${theme}`);
    }
    else if (cmd.startsWith('infinity-search')) {
      const term = cmd.substring('infinity-search'.length).trim();
      this.showCar();
      this.addOutput(`🚗 Car pulls up with search results for: "${term}"`);
      this.addOutput('🔍 Searching across all repos...');
      setTimeout(() => {
        this.addOutput(`✅ Found 42 results in 3 repos!`);
        this.earnCoins(5);
      }, 1500);
    }
    else if (cmd === 'infinity-build') {
      this.addOutput('🔨 Building repos...');
      this.marioJump();
      setTimeout(() => {
        this.luigiJump();
      }, 300);
      setTimeout(() => {
        this.addOutput('✅ Build successful! All characters celebrate! 🎉');
        this.createCelebration();
        this.earnCoins(10);
      }, 2000);
    }
    else if (cmd === 'infinity-navigate') {
      this.addOutput('🕹️ Joystick controls active!');
      this.addOutput('  ⬆️ Up: Scroll up / Mario jumps');
      this.addOutput('  ⬇️ Down: Scroll down');
      this.addOutput('  ⬅️ Left: Mario walks left');
      this.addOutput('  ➡️ Right: Mario walks right');
      this.addOutput('  🅰️ A Button: Execute command');
      this.addOutput('  🅱️ B Button: Luigi appears');
    }
    else if (cmd === 'clear' || cmd === 'cls') {
      this.clearOutput();
    }
    else {
      this.addOutput(`⚠️ Unknown command: ${command}`);
      this.addOutput('💡 Type "infinity-help" for available commands');
    }
  }
  
  // Output Management
  addOutput(text) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = text;
    this.terminalOutput.appendChild(line);
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
  }
  
  clearOutput() {
    this.terminalOutput.innerHTML = '';
    this.addOutput('🍄 Terminal cleared! 🎮');
  }
  
  // Theme Switching
  switchTheme(theme) {
    document.body.className = `theme-${theme}`;
    this.currentTheme = theme;
    this.themeSelect.value = theme;
    
    // Theme-specific messages
    const messages = {
      mario: '🍄 Mario World theme activated!',
      rock: '🎸 Rock & Roll theme activated!',
      jazz: '🎷 Jazz Lounge theme activated!',
      edm: '🎵 EDM Arena theme activated!',
      classical: '🎻 Classical Symphony theme activated!',
      hiphop: '🎤 Hip Hop Studio theme activated!',
      electronics: '🔌 Electronics Lab theme activated! Build your signal generator!',
      chemistry: '🧪 Chemistry Lab theme activated! Formula your code compounds!',
      math: '📐 Mathematics Realm activated! Calculate your theorems!',
      construction: '🏗️ Construction Site theme activated! Blueprint your architecture!',
      robotics: '🤖 Robotics Factory theme activated! Automate your systems!'
    };
    
    this.marioSpeak();
    this.earnCoins(10);
  }
  
  // Character Animations
  marioWalkIn() {
    this.mario.style.left = '-100px';
    setTimeout(() => {
      this.mario.style.transition = 'left 2s ease';
      this.mario.style.left = '50px';
    }, 100);
  }
  
  luigiWalkIn() {
    this.luigi.style.right = '-100px';
    setTimeout(() => {
      this.luigi.style.transition = 'right 2s ease';
      this.luigi.style.right = '50px';
    }, 100);
  }
  
  marioJump() {
    this.mario.style.animation = 'none';
    setTimeout(() => {
      this.mario.style.animation = 'bounce 0.5s 1';
      setTimeout(() => {
        this.mario.style.animation = 'bounce 1s infinite';
      }, 500);
    }, 10);
    this.earnCoins(2);
  }
  
  luigiJump() {
    this.luigi.style.animation = 'none';
    setTimeout(() => {
      this.luigi.style.animation = 'bounce 0.5s 1';
      setTimeout(() => {
        this.luigi.style.animation = 'bounce 1s infinite 0.5s';
      }, 500);
    }, 10);
  }
  
  marioSpeak() {
    const phrases = [
      "Let's-a-go build repos! 🍄",
      "Wahoo! Great commit! ⭐",
      "Mamma mia! That's-a nice code! 👨‍💻",
      "Here we go! 🎮"
    ];
    this.showSpeechBubble(this.mario, phrases[Math.floor(Math.random() * phrases.length)]);
  }
  
  luigiSpeak() {
    const phrases = [
      "Stay here! Check this out! 🟢",
      "Luigi number one! 💚",
      "Don't-a forget about me! 👋",
      "This feature is-a better! ✨"
    ];
    this.showSpeechBubble(this.luigi, phrases[Math.floor(Math.random() * phrases.length)]);
  }
  
  showSpeechBubble(character, text) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = text;
    
    const rect = character.getBoundingClientRect();
    bubble.style.position = 'fixed';
    bubble.style.bottom = (window.innerHeight - rect.top + 20) + 'px';
    bubble.style.left = (rect.left - 50) + 'px';
    
    document.body.appendChild(bubble);
    
    setTimeout(() => {
      bubble.remove();
    }, 3000);
  }
  
  // Car Animations
  showCar() {
    const car = document.createElement('div');
    car.className = 'car arriving';
    car.textContent = '🚗';
    car.style.bottom = '150px';
    car.style.left = '-100px';
    
    document.body.appendChild(car);
    
    setTimeout(() => {
      car.classList.remove('arriving');
      car.classList.add('departing');
      car.style.right = '-100px';
      car.style.left = 'auto';
    }, 2500);
    
    setTimeout(() => {
      car.remove();
    }, 5000);
  }
  
  // Mushroom Power-ups
  spawnMushroom(x, y) {
    const mushroom = document.createElement('div');
    mushroom.className = 'mushroom';
    mushroom.textContent = '🍄';
    mushroom.style.left = x + 'px';
    mushroom.style.top = y + 'px';
    
    mushroom.addEventListener('click', () => {
      mushroom.classList.add('collected');
      this.activatePowerup();
      this.addOutput('🍄 You jumped it loose! Power-up collected! ✨');
      setTimeout(() => mushroom.remove(), 600);
    });
    
    document.body.appendChild(mushroom);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (mushroom.parentElement) mushroom.remove();
    }, 10000);
  }
  
  trySpawnMushroom() {
    if (Math.random() < 0.3) { // 30% chance
      const x = Math.random() * (window.innerWidth - 100);
      const y = Math.random() * (window.innerHeight - 200) + 50;
      this.spawnMushroom(x, y);
    }
  }
  
  activatePowerup() {
    this.powerupActive = true;
    this.powerupIndicator.classList.add('active');
    
    setTimeout(() => {
      this.powerupActive = false;
      this.powerupIndicator.classList.remove('active');
      this.addOutput('⚠️ Power-up expired!');
    }, 30000); // 30 seconds
  }
  
  // Joystick Controls
  handleJoystick(action) {
    this.addOutput(`🕹️ Joystick: ${action.toUpperCase()}`);
    
    switch(action) {
      case 'up':
        this.mario.style.transform = 'translateY(-30px)';
        setTimeout(() => this.mario.style.transform = '', 300);
        this.terminalOutput.scrollTop -= 100;
        break;
      case 'down':
        this.terminalOutput.scrollTop += 100;
        break;
      case 'left':
        this.moveMario(-50);
        break;
      case 'right':
        this.moveMario(50);
        break;
    }
    
    this.earnCoins(2);
  }
  
  handleAction(action) {
    this.addOutput(`🎮 Action: ${action.toUpperCase()} button pressed!`);
    
    if (action === 'a') {
      this.executeCommand();
      this.marioJump();
    } else if (action === 'b') {
      this.luigiSpeak();
      this.luigiJump();
    }
    
    this.earnCoins(2);
  }
  
  moveMario(deltaX) {
    const currentLeft = parseInt(this.mario.style.left || '50');
    this.mario.style.left = Math.max(0, Math.min(window.innerWidth - 100, currentLeft + deltaX)) + 'px';
  }
  
  // Coin System
  earnCoins(amount) {
    const multiplier = this.powerupActive ? 2 : 1;
    const earned = amount * multiplier;
    this.coins += earned;
    
    // Show coin animation
    this.showCoin(earned);
    
    // Play sound effect (visual representation)
    this.addOutput(`💰 +${earned} INF ${this.powerupActive ? '(2X!)' : ''} | Total: ${this.coins}`);
  }
  
  showCoin(amount) {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.textContent = '🪙';
    
    const rect = this.mario.getBoundingClientRect();
    coin.style.position = 'fixed';
    coin.style.left = rect.left + 'px';
    coin.style.top = rect.top + 'px';
    
    document.body.appendChild(coin);
    
    setTimeout(() => coin.remove(), 600);
  }
  
  // Celebration Effects
  createCelebration() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.createParticle();
      }, i * 50);
    }
  }
  
  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = ['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)];
    particle.style.fontSize = '24px';
    
    particle.style.left = (Math.random() * window.innerWidth) + 'px';
    particle.style.top = (Math.random() * window.innerHeight) + 'px';
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
  }
  
  // Typing Speed Tracker
  trackTypingSpeed() {
    const now = Date.now();
    const delta = now - this.lastTypingTime;
    
    if (delta < 1000) {
      this.typingSpeed++;
      
      // Fast typing triggers car
      if (this.typingSpeed > this.TYPING_SPEED_THRESHOLD) {
        this.showCar();
        this.typingSpeed = 0;
      }
    } else {
      this.typingSpeed = 0;
    }
    
    this.lastTypingTime = now;
  }
  
  // Mouse Tracking
  trackMouse(e) {
    // Characters subtly follow the mouse
    if (Math.random() < this.MOUSE_TRACKING_PROBABILITY) { // Configurable probability
      const marioRect = this.mario.getBoundingClientRect();
      const luigiRect = this.luigi.getBoundingClientRect();
      
      if (e.clientX < window.innerWidth / 2) {
        // Mouse on left, Mario reacts
        if (Math.abs(e.clientY - marioRect.top) < 100) {
          this.marioJump();
        }
      } else {
        // Mouse on right, Luigi reacts
        if (Math.abs(e.clientY - luigiRect.top) < 100) {
          this.luigiJump();
        }
      }
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mrwTerminal = new MRWTerminalEngine();
  });
} else {
  window.mrwTerminal = new MRWTerminalEngine();
}

console.log('🍄🍄👲🏻🏰🏰👸🏼🍄🐢💗⚡⚡⚡🌟👻🎮🕹️👾');
console.log('MRW Animated Terminal System Loaded!');
