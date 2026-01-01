/**
 * Mushroom Physics & Code Compression System
 * Mushroom power-ups optimize and compress code
 */

class MushroomSystem {
  constructor() {
    this.mushroomsPower = 0;
    this.compressionRatio = 1.0;
    this.optimizationLevel = 0;
  }
  
  /**
   * Bump mushroom loose from block
   * @param {string} code - Current code to optimize
   * @returns {Object} Optimization results
   */
  bumpMushroom(code) {
    console.log('🍄 Mushroom bumped! Analyzing code...');
    
    // Analyze code complexity
    const analysis = this.analyzeCodeComplexity(code);
    
    // Create optimized version
    const optimized = this.optimizeCode(code, analysis);
    
    // Calculate improvements
    const improvements = {
      linesReduced: analysis.lines - optimized.lines,
      speedIncrease: this.calculateSpeedIncrease(analysis, optimized),
      capacitanceFreed: this.calculateFreedCapacitance(analysis, optimized),
      memoryFreed: analysis.bytes - optimized.bytes
    };
    
    this.mushroomsPower++;
    this.compressionRatio = optimized.bytes / analysis.bytes;
    this.optimizationLevel++;
    
    return {
      original: code,
      optimized: optimized.code,
      analysis: analysis,
      optimizedAnalysis: optimized,
      improvements: improvements,
      message: this.getMushroomMessage(improvements)
    };
  }
  
  /**
   * Analyze code complexity
   * @param {string} code - Code to analyze
   * @returns {Object} Analysis results
   */
  analyzeCodeComplexity(code) {
    const lines = code.split('\n').filter(line => line.trim()).length;
    const chars = code.length;
    const bytes = new Blob([code]).size;
    
    // Count loops, conditionals, functions
    const loops = (code.match(/for|while|do/gi) || []).length;
    const conditionals = (code.match(/if|else|switch/gi) || []).length;
    const functions = (code.match(/function|=>|\bdef\b/gi) || []).length;
    
    // Calculate complexity score
    const complexity = loops * 3 + conditionals * 2 + functions * 1.5;
    
    return {
      lines,
      chars,
      bytes,
      loops,
      conditionals,
      functions,
      complexity
    };
  }
  
  /**
   * Optimize code
   * @param {string} code - Original code
   * @param {Object} analysis - Code analysis
   * @returns {Object} Optimized code and stats
   */
  optimizeCode(code, analysis) {
    let optimized = code;
    
    // Remove extra whitespace
    optimized = optimized.replace(/\n\s*\n/g, '\n');
    
    // Remove comments (simple version)
    optimized = optimized.replace(/\/\/.*$/gm, '');
    optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Trim lines
    optimized = optimized.split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');
    
    // Reanalyze optimized code
    const lines = optimized.split('\n').length;
    const chars = optimized.length;
    const bytes = new Blob([optimized]).size;
    
    return {
      code: optimized,
      lines,
      chars,
      bytes
    };
  }
  
  /**
   * Calculate speed increase from optimization
   * @param {Object} original - Original analysis
   * @param {Object} optimized - Optimized analysis
   * @returns {number} Speed multiplier
   */
  calculateSpeedIncrease(original, optimized) {
    const reduction = (original.bytes - optimized.bytes) / original.bytes;
    return 1 + (reduction * 0.5); // Up to 50% speed increase
  }
  
  /**
   * Calculate freed capacitance
   * @param {Object} original - Original analysis
   * @param {Object} optimized - Optimized analysis
   * @returns {number} Freed capacitance in game units
   */
  calculateFreedCapacitance(original, optimized) {
    const bytesFreed = original.bytes - optimized.bytes;
    return bytesFreed / 10; // 1 capacitance per 10 bytes
  }
  
  /**
   * Get encouraging message based on improvements
   * @param {Object} improvements - Improvement stats
   * @returns {string} Message
   */
  getMushroomMessage(improvements) {
    const messages = [];
    
    if (improvements.linesReduced > 0) {
      messages.push(`Removed ${improvements.linesReduced} lines!`);
    }
    
    if (improvements.speedIncrease > 1.1) {
      messages.push(`${((improvements.speedIncrease - 1) * 100).toFixed(0)}% faster!`);
    }
    
    if (improvements.capacitanceFreed > 10) {
      messages.push(`Freed ${improvements.capacitanceFreed.toFixed(0)} capacitance!`);
    }
    
    if (improvements.memoryFreed > 100) {
      messages.push(`Saved ${improvements.memoryFreed} bytes!`);
    }
    
    return messages.length > 0 
      ? `🍄 Mushroom Power! ${messages.join(' ')}`
      : '🍄 Code optimized!';
  }
  
  /**
   * Compress code to ZIP format (simulation)
   * @param {string} code - Code to compress
   * @returns {Object} Compression results
   */
  compressToZip(code) {
    // Simulate compression
    const original = code.length;
    const compressed = Math.floor(original * 0.3); // 70% compression
    
    return {
      originalSize: original,
      compressedSize: compressed,
      ratio: compressed / original,
      saved: original - compressed,
      format: 'zip'
    };
  }
  
  /**
   * Generate bonus features from freed capacitance
   * @param {number} freedCapacitance - Amount of capacitance freed
   * @returns {Array} Bonus features unlocked
   */
  generateBonusFromFreedCapacitance(freedCapacitance) {
    const bonuses = [];
    
    if (freedCapacitance >= 10) {
      bonuses.push('🔋 Extra jump power unlocked!');
    }
    
    if (freedCapacitance >= 25) {
      bonuses.push('⚡ Faster processing enabled!');
    }
    
    if (freedCapacitance >= 50) {
      bonuses.push('🌟 Star mode available!');
    }
    
    if (freedCapacitance >= 100) {
      bonuses.push('🏆 Master optimizer achievement!');
    }
    
    return bonuses;
  }
  
  /**
   * Display mushroom bump animation
   * @param {Object} improvements - Improvement data
   */
  showMushroomAnimation(improvements) {
    const container = document.getElementById('mrw-animation-layer');
    if (!container) return;
    
    const mushroom = document.createElement('div');
    mushroom.className = 'mrw-mushroom-animation';
    mushroom.innerHTML = `
      <div class="mrw-mushroom-icon">🍄</div>
      <div class="mrw-mushroom-message">${improvements.message}</div>
      <div class="mrw-mushroom-stats">
        <div>Lines: -${improvements.linesReduced}</div>
        <div>Speed: +${((improvements.speedIncrease - 1) * 100).toFixed(0)}%</div>
        <div>Capacitance: +${improvements.capacitanceFreed.toFixed(0)}</div>
      </div>
    `;
    
    mushroom.style.position = 'absolute';
    mushroom.style.top = '50%';
    mushroom.style.left = '50%';
    mushroom.style.transform = 'translate(-50%, -50%)';
    
    container.appendChild(mushroom);
    
    setTimeout(() => mushroom.remove(), 4000);
  }
  
  /**
   * Get current system stats
   * @returns {Object} System statistics
   */
  getStats() {
    return {
      mushroomsPower: this.mushroomsPower,
      compressionRatio: this.compressionRatio,
      optimizationLevel: this.optimizationLevel
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MushroomSystem;
}
