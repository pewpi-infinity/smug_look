/**
 * Joystick Control System
 * On-screen joystick where movements do actual work
 */

class JoystickSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.position = { x: 0, y: 0 };
    this.isActive = false;
    this.movements = [];
    this.systemCapacitor = null;
    
    this.directions = {
      up: 'scroll_docs',
      down: 'compress_code',
      left: 'navigate_files',
      right: 'open_features',
      upRight: 'research_topic',
      upLeft: 'explore_alternatives',
      downRight: 'optimize_performance',
      downLeft: 'refactor_code'
    };
    
    this.init();
  }
  
  init() {
    this.createJoystickUI();
    this.attachEventListeners();
  }
  
  createJoystickUI() {
    const joystick = document.createElement('div');
    joystick.className = 'mrw-joystick-container';
    joystick.innerHTML = `
      <div class="mrw-joystick-base">
        <div class="mrw-joystick-stick" id="mrw-joystick-stick"></div>
        <div class="mrw-joystick-directions">
          <div class="mrw-joystick-dir up">📚</div>
          <div class="mrw-joystick-dir down">🗜️</div>
          <div class="mrw-joystick-dir left">📁</div>
          <div class="mrw-joystick-dir right">✨</div>
        </div>
      </div>
      <div class="mrw-joystick-buttons">
        <button class="mrw-btn-a" data-button="A">A</button>
        <button class="mrw-btn-b" data-button="B">B</button>
        <button class="mrw-btn-x" data-button="X">X</button>
        <button class="mrw-btn-y" data-button="Y">Y</button>
      </div>
      <div class="mrw-joystick-action" id="mrw-joystick-action"></div>
    `;
    
    this.container.appendChild(joystick);
    this.stick = document.getElementById('mrw-joystick-stick');
    this.actionDisplay = document.getElementById('mrw-joystick-action');
  }
  
  attachEventListeners() {
    const base = this.container.querySelector('.mrw-joystick-base');
    
    // Mouse events
    base.addEventListener('mousedown', (e) => this.onStart(e));
    document.addEventListener('mousemove', (e) => this.onMove(e));
    document.addEventListener('mouseup', () => this.onEnd());
    
    // Touch events
    base.addEventListener('touchstart', (e) => this.onStart(e.touches[0]));
    document.addEventListener('touchmove', (e) => this.onMove(e.touches[0]));
    document.addEventListener('touchend', () => this.onEnd());
    
    // Button events
    const buttons = this.container.querySelectorAll('[data-button]');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.onButtonPress(button.dataset.button);
      });
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => this.onKeyPress(e));
  }
  
  onStart(e) {
    this.isActive = true;
    const rect = this.stick.parentElement.getBoundingClientRect();
    this.centerX = rect.left + rect.width / 2;
    this.centerY = rect.top + rect.height / 2;
  }
  
  onMove(e) {
    if (!this.isActive) return;
    
    const rect = this.stick.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let x = e.clientX - centerX;
    let y = e.clientY - centerY;
    
    // Limit stick to circle
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 40;
    
    if (distance > maxDistance) {
      x = (x / distance) * maxDistance;
      y = (y / distance) * maxDistance;
    }
    
    this.position.x = x / maxDistance;
    this.position.y = -y / maxDistance; // Invert Y
    
    this.stick.style.transform = `translate(${x}px, ${y}px)`;
    
    // Determine direction and perform work
    const direction = this.getDirection();
    this.performWork(direction);
    
    // Charge capacitor from movement
    this.chargeFromMovement(distance / maxDistance);
  }
  
  onEnd() {
    this.isActive = false;
    this.stick.style.transform = 'translate(0, 0)';
    this.position = { x: 0, y: 0 };
    this.actionDisplay.textContent = '';
  }
  
  getDirection() {
    const { x, y } = this.position;
    const threshold = 0.3;
    
    if (Math.abs(x) < threshold && Math.abs(y) < threshold) {
      return null;
    }
    
    // Cardinal and diagonal directions
    if (y > threshold && Math.abs(x) < threshold) return 'up';
    if (y < -threshold && Math.abs(x) < threshold) return 'down';
    if (x < -threshold && Math.abs(y) < threshold) return 'left';
    if (x > threshold && Math.abs(y) < threshold) return 'right';
    
    if (y > threshold && x > threshold) return 'upRight';
    if (y > threshold && x < -threshold) return 'upLeft';
    if (y < -threshold && x > threshold) return 'downRight';
    if (y < -threshold && x < -threshold) return 'downLeft';
    
    return null;
  }
  
  performWork(direction) {
    if (!direction) return;
    
    const action = this.directions[direction];
    this.actionDisplay.textContent = `${this.getDirectionIcon(direction)} ${action.replace(/_/g, ' ')}`;
    
    // Record movement
    this.movements.push({
      direction,
      action,
      timestamp: Date.now()
    });
    
    // Trigger action
    this.executeAction(action);
  }
  
  getDirectionIcon(direction) {
    const icons = {
      up: '⬆️',
      down: '⬇️',
      left: '⬅️',
      right: '➡️',
      upRight: '↗️',
      upLeft: '↖️',
      downRight: '↘️',
      downLeft: '↙️'
    };
    return icons[direction] || '🎮';
  }
  
  executeAction(action) {
    // Dispatch custom event with action
    const event = new CustomEvent('joystick-action', {
      detail: { action, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
    
    // Console feedback
    console.log(`🎮 Joystick action: ${action}`);
  }
  
  onButtonPress(button) {
    console.log(`🎮 Button pressed: ${button}`);
    
    const actions = {
      A: 'executeCurrentTask',
      B: 'cancelAndReturn',
      X: 'openQuickMenu',
      Y: 'shareProgress'
    };
    
    const action = actions[button];
    if (action) {
      this.executeAction(action);
      this.showButtonFeedback(button);
    }
  }
  
  showButtonFeedback(button) {
    const feedback = document.createElement('div');
    feedback.className = 'mrw-button-feedback';
    feedback.textContent = button;
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.fontSize = '48px';
    feedback.style.fontWeight = 'bold';
    feedback.style.color = '#FFD700';
    feedback.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    feedback.style.zIndex = '9999';
    feedback.style.pointerEvents = 'none';
    feedback.style.animation = 'mrw-button-pop 0.5s ease-out';
    
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 500);
  }
  
  onKeyPress(e) {
    const keyMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      a: 'A',
      s: 'B',
      d: 'X',
      w: 'Y'
    };
    
    const mapped = keyMap[e.key];
    if (mapped) {
      e.preventDefault();
      
      if (mapped.length === 1) {
        this.onButtonPress(mapped);
      } else {
        const action = this.directions[mapped];
        if (action) {
          this.executeAction(action);
        }
      }
    }
  }
  
  chargeFromMovement(intensity) {
    if (this.systemCapacitor) {
      const energy = intensity * 0.5; // Movement energy
      this.systemCapacitor.charge(energy / 60); // 60 FPS
    }
  }
  
  setCapacitor(capacitor) {
    this.systemCapacitor = capacitor;
  }
  
  getMovementStats() {
    return {
      totalMovements: this.movements.length,
      recentMovements: this.movements.slice(-10),
      energyGenerated: this.movements.length * 0.5
    };
  }
}

// Add CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes mrw-button-pop {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JoystickSystem;
}
