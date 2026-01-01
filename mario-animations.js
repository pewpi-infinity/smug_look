/**
 * 🎮 Mario Animations System
 * Game-like animations for the jukebox interface
 * Following Legend color system and interactive principles
 */

class MarioAnimations {
  constructor() {
    this.particles = [];
    this.sprites = new Map();
    this.animations = new Map();
    this.canvas = null;
    this.ctx = null;
    
    // Animation state
    this.animationFrame = null;
    this.lastTime = 0;
    
    // Mario game mechanics
    this.coins = this.loadCoins();
    this.powerUps = [];
    this.questionBlocks = [];
    
    this.initialize();
  }

  /**
   * 🪐 Load coins from storage (MEMORY_NODE pattern)
   */
  loadCoins() {
    try {
      const stored = localStorage.getItem('infinity_mario_coins');
      return stored ? parseInt(stored, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * 🪐 Save coins (MEMORY_NODE: append only)
   */
  saveCoins() {
    try {
      localStorage.setItem('infinity_mario_coins', this.coins.toString());
    } catch (e) {
      console.warn('Could not save coins:', e);
    }
  }

  /**
   * ⭐ Initialize animation system (RUNTIME pattern)
   */
  initialize() {
    // Create canvas for particle effects
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'mario-particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    
    this.ctx = this.canvas.getContext('2d');
    
    // Add to DOM when ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(this.canvas);
        this.resize();
      });
    } else {
      document.body.appendChild(this.canvas);
      this.resize();
    }
    
    window.addEventListener('resize', () => this.resize());
    
    // Start animation loop
    this.startAnimationLoop();
  }

  /**
   * ⭐ Resize canvas (RUNTIME pattern)
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * ⭐ Animation loop (RUNTIME pattern)
   */
  startAnimationLoop() {
    const animate = (timestamp) => {
      const deltaTime = timestamp - this.lastTime;
      this.lastTime = timestamp;
      
      this.update(deltaTime);
      this.render();
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }

  /**
   * ⭐ Update particles and animations (RUNTIME pattern)
   */
  update(deltaTime) {
    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      particle.x += particle.vx * deltaTime / 16;
      particle.y += particle.vy * deltaTime / 16;
      particle.vy += 0.5; // Gravity
      
      return particle.life > 0;
    });
  }

  /**
   * 🎨 Render particles (visual output)
   */
  render() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render particles
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life / particle.maxLife;
      this.ctx.font = `${particle.size}px Arial`;
      this.ctx.fillText(particle.emoji, particle.x, particle.y);
      this.ctx.restore();
    });
  }

  /**
   * 🎮 Create particle effect (interactive feedback)
   */
  createParticles(x, y, emoji, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        emoji,
        size: 20 + Math.random() * 10,
        life: 1000 + Math.random() * 500,
        maxLife: 1000
      });
    }
  }

  /**
   * 💰 Collect coin animation (🟨 YELLOW: navigation/collection)
   */
  collectCoin(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Particle effect
    this.createParticles(x, y, '🪙', 8);
    
    // Increment coins
    this.coins++;
    this.saveCoins();
    
    // Flash element
    this.flashElement(element, '#EAB308'); // YELLOW
    
    // Sound effect (if available)
    this.playSoundEffect('coin');
    
    // Emit event
    this.emitEvent('coinCollected', { coins: this.coins });
  }

  /**
   * 🍄 Power-up animation (power-up collected)
   */
  powerUp(element, type = 'mushroom') {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const emojis = {
      mushroom: '🍄',
      fire: '🔥',
      star: '⭐',
      leaf: '🍃'
    };
    
    this.createParticles(x, y, emojis[type] || '🍄', 12);
    
    // Flash element
    this.flashElement(element, '#10B981'); // GREEN (input/record)
    
    // Sound effect
    this.playSoundEffect('powerup');
    
    // Store power-up
    this.powerUps.push({
      type,
      timestamp: Date.now()
    });
    
    this.emitEvent('powerUpCollected', { type, powerUps: this.powerUps });
  }

  /**
   * ❓ Question block animation
   */
  questionBlock(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Random reward
    const rewards = [
      { type: 'coin', emoji: '🪙' },
      { type: 'star', emoji: '⭐' },
      { type: 'mushroom', emoji: '🍄' },
      { type: 'note', emoji: '🎵' }
    ];
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    // Animate reward popping out
    this.createParticles(x, y, reward.emoji, 1);
    
    // Jump animation for element
    this.jumpElement(element);
    
    // Flash element
    this.flashElement(element, '#EAB308'); // YELLOW
    
    this.emitEvent('questionBlockHit', reward);
    
    return reward;
  }

  /**
   * 🎮 Jump animation for element
   */
  jumpElement(element) {
    element.style.transition = 'transform 0.3s ease-out';
    element.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      element.style.transform = 'translateY(0)';
    }, 150);
  }

  /**
   * 🎨 Flash element with color
   */
  flashElement(element, color) {
    const originalBg = element.style.backgroundColor;
    element.style.transition = 'background-color 0.1s';
    element.style.backgroundColor = color;
    
    setTimeout(() => {
      element.style.backgroundColor = originalBg;
    }, 200);
  }

  /**
   * 🎮 Button press animation (interactive feedback)
   */
  buttonPress(element) {
    element.style.transition = 'transform 0.1s';
    element.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 100);
  }

  /**
   * 🌊 Warp pipe animation (navigation)
   */
  warpPipe(element, callback) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Swirl particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.createParticles(x, y, '🌀', 3);
      }, i * 50);
    }
    
    // Fade element
    element.style.transition = 'opacity 1s, transform 1s';
    element.style.opacity = '0';
    element.style.transform = 'scale(0.5)';
    
    setTimeout(() => {
      if (callback) callback();
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, 1000);
  }

  /**
   * 🔴 Enemy defeat animation (RED: output/action)
   */
  defeatEnemy(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Poof effect
    this.createParticles(x, y, '💨', 15);
    
    // Spin and fade
    element.style.transition = 'transform 0.5s, opacity 0.5s';
    element.style.transform = 'rotate(720deg) scale(0)';
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.style.transform = 'rotate(0deg) scale(1)';
      element.style.opacity = '1';
    }, 500);
  }

  /**
   * 🎵 Music note animation (track playing)
   */
  musicNotes(x, y) {
    const notes = ['🎵', '🎶', '🎼', '🎹'];
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.particles.push({
          x: x + (Math.random() - 0.5) * 50,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: -3 - Math.random() * 2,
          emoji: note,
          size: 20 + Math.random() * 10,
          life: 2000,
          maxLife: 2000
        });
      }, i * 200);
    }
  }

  /**
   * 💫 Star collection effect (STAR favorite system)
   */
  collectStar(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Big star burst
    this.createParticles(x, y, '⭐', 20);
    this.createParticles(x, y, '✨', 15);
    
    // Flash element
    this.flashElement(element, '#EAB308'); // YELLOW
    
    // Rotate effect
    element.style.transition = 'transform 0.5s';
    element.style.transform = 'rotate(360deg) scale(1.2)';
    
    setTimeout(() => {
      element.style.transform = 'rotate(0deg) scale(1)';
    }, 500);
    
    this.emitEvent('starCollected');
  }

  /**
   * 🔊 Play sound effect (simplified - would integrate with audio engine)
   */
  playSoundEffect(type) {
    // This would integrate with the LegendAudioEngine
    this.emitEvent('soundEffect', { type });
  }

  /**
   * 🔀 Emit event (FLOW pattern)
   */
  emitEvent(eventName, data) {
    const event = new CustomEvent(`marioAnimation:${eventName}`, {
      detail: data
    });
    window.dispatchEvent(event);
  }

  /**
   * 🧹 Cleanup
   */
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  /**
   * 👑 Get current state (CROWN_INDEX: catalog only)
   */
  getState() {
    return {
      coins: this.coins,
      powerUps: this.powerUps.length,
      particles: this.particles.length
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarioAnimations;
}
