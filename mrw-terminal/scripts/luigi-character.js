/**
 * Luigi Character Module
 * The loyal companion who encourages users to stay and build
 */

class LuigiCharacter {
  constructor(terminal) {
    this.terminal = terminal;
    this.emotion = 'happy'; // happy, concerned, supportive, celebrating
    this.loyaltyMessages = [
      '💚 This is where the magic happens!',
      '🏠 Everything you need is right here!',
      '⚡ Don\'t leave, more features coming!',
      '🎯 Stay focused, you\'re building something great!'
    ];
  }
  
  callBack() {
    this.emotion = 'concerned';
    this.terminal.addOutput('👨🏻‍🔧 Luigi: Hey! Stay here, we\'ve got more!');
    
    this.showWithEmotion('concerned', 'Don\'t go! There\'s so much more to explore!');
  }
  
  celebrate() {
    this.emotion = 'celebrating';
    this.terminal.addOutput('👍 Luigi: Yes! You came back!');
    
    this.showWithEmotion('happy', 'Great to see you again!');
  }
  
  support() {
    this.emotion = 'supportive';
    const message = this.loyaltyMessages[Math.floor(Math.random() * this.loyaltyMessages.length)];
    this.terminal.addOutput(`🔧 Luigi: ${message}`);
    
    this.showWithEmotion('supportive', message);
  }
  
  showWithEmotion(emotion, message) {
    const animationLayer = document.getElementById('mrw-animation-layer');
    const luigi = document.createElement('div');
    luigi.className = `mrw-luigi mrw-luigi-${emotion}`;
    
    const icon = this.getEmotionIcon(emotion);
    luigi.innerHTML = `
      <div class="mrw-character-icon">${icon}</div>
      <div class="mrw-character-bubble">${message}</div>
    `;
    
    luigi.style.bottom = '80px';
    luigi.style.right = '-200px';
    
    animationLayer.appendChild(luigi);
    
    // Slide in from right
    setTimeout(() => {
      luigi.style.right = '20px';
    }, 100);
    
    // Stay for a moment, then slide back
    setTimeout(() => {
      luigi.style.right = '-200px';
      setTimeout(() => luigi.remove(), 500);
    }, 4000);
  }
  
  getEmotionIcon(emotion) {
    const icons = {
      happy: '👨🏻‍🔧😊',
      concerned: '👨🏻‍🔧😟',
      supportive: '👨🏻‍🔧👍',
      celebrating: '👨🏻‍🔧🎉'
    };
    return icons[emotion] || '👨🏻‍🔧';
  }
  
  encourageStay() {
    this.terminal.addOutput('🔧 Luigi: You\'re doing great! Keep building!');
    this.support();
  }
  
  showFeatures() {
    this.terminal.addOutput(`
👨🏻‍🔧 Luigi: Check out what we have here:

✅ Electronics Lab - Build circuits and signals
✅ Chemistry Lab - Mix compounds and reactions
✅ Math Studio - Solve equations and plot graphs
✅ Robot Workshop - Design and automate
✅ Construction Site - Build structures

Everything you need to create amazing projects!
    `);
  }
  
  reactToUserLeaving() {
    this.callBack();
    
    // Show persistent reminder
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        this.celebrate();
      }
    }, 1000);
  }
  
  reactToUserWorking() {
    if (Math.random() > 0.8) {
      this.support();
    }
  }
  
  wave() {
    const animationLayer = document.getElementById('mrw-animation-layer');
    const luigi = document.createElement('div');
    luigi.className = 'mrw-luigi mrw-luigi-waving';
    luigi.innerHTML = '👨🏻‍🔧👋';
    luigi.style.bottom = '80px';
    luigi.style.right = '20px';
    
    animationLayer.appendChild(luigi);
    
    setTimeout(() => luigi.remove(), 3000);
  }
}

// Detect user leaving and trigger Luigi
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (window.luigiCharacter) {
      if (document.hidden) {
        // User switching away
        window.luigiCharacter.reactToUserLeaving();
      } else {
        // User coming back
        window.luigiCharacter.celebrate();
      }
    }
  });
}

// Export for use in terminal
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LuigiCharacter;
}
