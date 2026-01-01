/**
 * Mario Character Module
 * Implements Mario behaviors, animations, and interactions
 */

class MarioCharacter {
  constructor(terminal) {
    this.terminal = terminal;
    this.position = { x: 0, y: 0 };
    this.state = 'idle'; // idle, walking, jumping, star
    this.suggestions = [
      '🔌 Try the electronics bench!',
      '🧪 Check out the chemistry lab!',
      '🤖 Build something in the robot workshop!',
      '📐 Solve some equations!'
    ];
  }
  
  walk(direction = 'right') {
    this.state = 'walking';
    const animationLayer = document.getElementById('mrw-animation-layer');
    const mario = document.createElement('div');
    mario.className = 'mrw-mario mrw-mario-walking';
    mario.innerHTML = '👨🏻';
    mario.style.bottom = '50px';
    
    if (direction === 'right') {
      mario.style.left = '-50px';
      animationLayer.appendChild(mario);
      
      setTimeout(() => {
        mario.style.left = '100%';
      }, 100);
    } else {
      mario.style.left = 'calc(100% + 50px)';
      mario.style.transform = 'scaleX(-1)';
      animationLayer.appendChild(mario);
      
      setTimeout(() => {
        mario.style.left = '-50px';
      }, 100);
    }
    
    setTimeout(() => mario.remove(), 3000);
    this.state = 'idle';
  }
  
  jump(height = 100) {
    this.state = 'jumping';
    this.terminal.addOutput('🍄 Mario: Wahoo! *jump*');
    
    // Show jumping animation in terminal
    const animationLayer = document.getElementById('mrw-animation-layer');
    const mario = document.createElement('div');
    mario.className = 'mrw-mario mrw-mario-jumping';
    mario.innerHTML = '👨🏻';
    mario.style.left = '50%';
    mario.style.transform = 'translateX(-50%)';
    mario.style.bottom = '50px';
    
    animationLayer.appendChild(mario);
    
    // Animate jump using capacitor physics
    const jumpArc = this.calculateJumpArc(height);
    let frame = 0;
    const jumpInterval = setInterval(() => {
      if (frame >= jumpArc.length) {
        clearInterval(jumpInterval);
        mario.remove();
        this.state = 'idle';
        return;
      }
      
      mario.style.bottom = `${50 + jumpArc[frame]}px`;
      frame++;
    }, 16);
  }
  
  calculateJumpArc(maxHeight) {
    // Simulate capacitor discharge physics
    const frames = 60;
    const arc = [];
    
    for (let i = 0; i < frames; i++) {
      const t = i / frames;
      // Parabolic trajectory
      const y = maxHeight * (4 * t * (1 - t));
      arc.push(y);
    }
    
    return arc;
  }
  
  suggest() {
    const suggestion = this.suggestions[Math.floor(Math.random() * this.suggestions.length)];
    this.terminal.addOutput(`👨🏻 Mario: ${suggestion}`);
    
    this.showSpeechBubble(suggestion);
  }
  
  showSpeechBubble(text) {
    const animationLayer = document.getElementById('mrw-animation-layer');
    const bubble = document.createElement('div');
    bubble.className = 'mrw-speech-bubble';
    bubble.innerHTML = `
      <div class="mrw-bubble-content">
        <span class="mrw-bubble-character">👨🏻</span>
        <span class="mrw-bubble-text">${text}</span>
      </div>
    `;
    bubble.style.bottom = '150px';
    bubble.style.left = '50%';
    bubble.style.transform = 'translateX(-50%)';
    
    animationLayer.appendChild(bubble);
    
    setTimeout(() => bubble.remove(), 4000);
  }
  
  collectStar() {
    this.state = 'star';
    this.terminal.addOutput('⭐ Mario: You got a star! Keep going!');
    
    const animationLayer = document.getElementById('mrw-animation-layer');
    const star = document.createElement('div');
    star.className = 'mrw-star-collect';
    star.innerHTML = '⭐✨';
    star.style.left = '50%';
    star.style.top = '30%';
    star.style.transform = 'translate(-50%, -50%)';
    
    animationLayer.appendChild(star);
    
    setTimeout(() => {
      star.remove();
      this.state = 'idle';
    }, 2000);
  }
  
  idle() {
    if (this.state === 'idle' && Math.random() > 0.95) {
      this.wave();
    }
  }
  
  wave() {
    this.terminal.addOutput('👋 Mario: Hey! Don\'t forget to explore the lab!');
  }
  
  pointToInterest(interestName) {
    this.terminal.addOutput(`👨🏻 Mario: Look! The ${interestName} lab is really cool!`);
    this.terminal.addOutput(`👉 Try typing: ${interestName}`);
  }
}

// Export for use in terminal
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarioCharacter;
}
