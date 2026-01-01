/**
 * Capacitor Physics Model
 * TRUE MARIO JUMP PHYSICS using RC circuit model
 * Capacitor charge/discharge determines jump behavior
 */

class CapacitorPhysics {
  constructor() {
    // Capacitor properties
    this.capacitance = 100; // Farads (game units)
    this.maxCharge = 100; // Maximum charge
    this.charge = 0; // Current charge
    this.voltage = 0; // Potential
    
    // Resistor properties
    this.resistance = 10; // Ohms (game units)
    
    // Charging rate
    this.chargingRate = 50; // Charge per second when button held
    
    // Conversion factor
    this.chargeToForce = 2.0; // Jump force per unit charge
  }
  
  /**
   * Charge the capacitor while button is held
   * @param {number} deltaTime - Time in seconds
   */
  charge(deltaTime) {
    this.charge = Math.min(
      this.maxCharge,
      this.charge + (deltaTime * this.chargingRate)
    );
    
    this.voltage = this.charge / this.capacitance;
    
    return {
      charge: this.charge,
      voltage: this.voltage,
      percentCharged: (this.charge / this.maxCharge) * 100
    };
  }
  
  /**
   * Discharge capacitor through resistor to create jump
   * @returns {Object} Jump parameters
   */
  discharge() {
    const spark = this.voltage; // Spark energy
    const jumpForce = spark * this.chargeToForce;
    
    // RC time constant determines jump curve
    const tau = this.resistance * (this.capacitance / 1000);
    
    // Reset charge
    const initialCharge = this.charge;
    this.charge = 0;
    this.voltage = 0;
    
    return {
      initialForce: jumpForce,
      timeConstant: tau,
      energy: initialCharge,
      // Exponential decay curve
      curve: (t) => jumpForce * Math.exp(-t / tau)
    };
  }
  
  /**
   * Calculate complete jump trajectory
   * @param {number} holdTime - How long button was held (seconds)
   * @returns {Object} Jump trajectory data
   */
  calculateJump(holdTime) {
    // Charge capacitor
    this.charge(holdTime);
    
    // Discharge creates spark
    const discharge = this.discharge();
    
    // Calculate jump height by integrating force curve
    const jumpHeight = this.integrateForce(discharge);
    
    // Generate parabolic trajectory
    const arc = this.generateParabolicArc(jumpHeight, discharge.initialForce);
    
    return {
      height: jumpHeight,
      velocity: discharge.initialForce,
      arc: arc,
      energy: discharge.energy,
      timeConstant: discharge.timeConstant
    };
  }
  
  /**
   * Integrate force curve to get total displacement
   * @param {Object} discharge - Discharge parameters
   * @returns {number} Jump height
   */
  integrateForce(discharge) {
    // Numerical integration of exponential decay
    const dt = 0.016; // 60 FPS
    const maxTime = discharge.timeConstant * 5; // 5 time constants
    let height = 0;
    let velocity = discharge.initialForce;
    
    for (let t = 0; t < maxTime; t += dt) {
      const force = discharge.curve(t);
      velocity = velocity + (force - 9.8) * dt; // Subtract gravity
      
      if (velocity < 0) break; // Stop at peak
      
      height += velocity * dt;
    }
    
    return height;
  }
  
  /**
   * Generate parabolic arc for jump animation
   * @param {number} maxHeight - Peak height
   * @param {number} initialVelocity - Starting velocity
   * @returns {Array} Array of y positions
   */
  generateParabolicArc(maxHeight, initialVelocity) {
    const frames = 60;
    const arc = [];
    
    for (let i = 0; i < frames; i++) {
      const t = i / frames;
      // Parabolic trajectory: y = h * 4t(1-t)
      const y = maxHeight * (4 * t * (1 - t));
      arc.push(y);
    }
    
    return arc;
  }
  
  /**
   * Get charge percentage (for UI display)
   * @returns {number} Percentage 0-100
   */
  getChargePercent() {
    return (this.charge / this.maxCharge) * 100;
  }
  
  /**
   * Reset capacitor to empty
   */
  reset() {
    this.charge = 0;
    this.voltage = 0;
  }
  
  /**
   * Get visual representation of charge
   * @returns {string} Visual bar
   */
  getChargeBar() {
    const percent = this.getChargePercent();
    const filled = Math.floor(percent / 10);
    const empty = 10 - filled;
    
    return '█'.repeat(filled) + '░'.repeat(empty) + ` ${percent.toFixed(0)}%`;
  }
}

/**
 * Jump Controller
 * Manages button press timing and jump execution
 */
class JumpController {
  constructor(capacitorPhysics) {
    this.physics = capacitorPhysics;
    this.isCharging = false;
    this.chargeStartTime = 0;
    this.onJumpCallback = null;
  }
  
  /**
   * Start charging (button press)
   */
  startCharge() {
    if (this.isCharging) return;
    
    this.isCharging = true;
    this.chargeStartTime = Date.now();
    this.physics.reset();
    
    // Start charging animation
    this.chargeLoop = setInterval(() => {
      const elapsed = (Date.now() - this.chargeStartTime) / 1000;
      this.physics.charge(0.016); // 60 FPS update
      
      // Show charge indicator
      this.updateChargeIndicator();
    }, 16);
  }
  
  /**
   * Release and jump (button release)
   */
  releaseAndJump() {
    if (!this.isCharging) return;
    
    this.isCharging = false;
    clearInterval(this.chargeLoop);
    
    // Calculate hold time
    const holdTime = (Date.now() - this.chargeStartTime) / 1000;
    
    // Execute jump
    const jumpData = this.physics.calculateJump(holdTime);
    
    // Callback with jump data
    if (this.onJumpCallback) {
      this.onJumpCallback(jumpData);
    }
    
    this.hideChargeIndicator();
    
    return jumpData;
  }
  
  updateChargeIndicator() {
    let indicator = document.getElementById('mrw-charge-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'mrw-charge-indicator';
      indicator.className = 'mrw-charge-indicator';
      document.body.appendChild(indicator);
    }
    
    indicator.innerHTML = `
      <div class="mrw-charge-bar">
        ${this.physics.getChargeBar()}
      </div>
      <div class="mrw-charge-label">Hold to charge jump!</div>
    `;
  }
  
  hideChargeIndicator() {
    const indicator = document.getElementById('mrw-charge-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  onJump(callback) {
    this.onJumpCallback = callback;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CapacitorPhysics, JumpController };
}
