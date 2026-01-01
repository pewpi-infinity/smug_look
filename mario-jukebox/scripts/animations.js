/**
 * ✨ Animations - Theme-Specific Animations
 * Manages all visual animations across themes
 */

// Mario Theme Animations
const marioAnimations = {
    coinBounce() {
        const coins = document.querySelectorAll('.coin-effect');
        coins.forEach(coin => {
            coin.style.animation = 'coinBounce 0.6s ease-in-out';
        });
    },
    
    powerUp() {
        const body = document.body;
        body.style.animation = 'powerUpFlash 0.5s ease';
        setTimeout(() => {
            body.style.animation = '';
        }, 500);
    },
    
    jump() {
        const elements = document.querySelectorAll('.jump-effect');
        elements.forEach(el => {
            el.style.animation = 'jumpEffect 0.8s ease';
            setTimeout(() => {
                el.style.animation = '';
            }, 800);
        });
    }
};

// Rock Theme Animations
const rockAnimations = {
    guitarFlame() {
        const flames = document.querySelectorAll('.flame-effect');
        flames.forEach(flame => {
            flame.style.animation = 'flameFlicker 1s infinite';
        });
    },
    
    stageLights() {
        const lights = document.querySelectorAll('.stage-light');
        lights.forEach((light, i) => {
            light.style.animation = `stageLightPulse ${1 + i * 0.2}s infinite`;
        });
    },
    
    ampDistortion() {
        const amps = document.querySelectorAll('.amp-effect');
        amps.forEach(amp => {
            amp.style.animation = 'distortionPulse 0.5s ease-in-out 3';
        });
    }
};

// Jazz Theme Animations
const jazzAnimations = {
    vinylSpin() {
        const vinyls = document.querySelectorAll('.vinyl-effect');
        vinyls.forEach(vinyl => {
            vinyl.style.animation = 'vinylSpin 3s linear infinite';
        });
    },
    
    smoothFade() {
        const elements = document.querySelectorAll('.smooth-fade');
        elements.forEach(el => {
            el.style.animation = 'smoothFade 3s ease-in-out infinite';
        });
    },
    
    saxSway() {
        const saxes = document.querySelectorAll('.sax-effect');
        saxes.forEach(sax => {
            sax.style.animation = 'saxSway 2s ease-in-out infinite';
        });
    }
};

// EDM Theme Animations
const edmAnimations = {
    neonPulse() {
        const neons = document.querySelectorAll('.neon-effect');
        neons.forEach(neon => {
            neon.style.animation = 'neonPulse 1s ease-in-out infinite';
        });
    },
    
    beatDrop() {
        const body = document.body;
        body.style.animation = 'beatDrop 0.3s ease';
        setTimeout(() => {
            body.style.animation = '';
        }, 300);
    },
    
    laserSweep() {
        const lasers = document.querySelectorAll('.laser-effect');
        lasers.forEach(laser => {
            laser.style.animation = 'laserSweep 2s linear infinite';
        });
    },
    
    waveform() {
        const waves = document.querySelectorAll('.waveform-effect');
        waves.forEach(wave => {
            wave.style.animation = 'waveformMove 2s linear infinite';
        });
    }
};

// Classical Theme Animations
const classicalAnimations = {
    conductorWave() {
        const batons = document.querySelectorAll('.baton-effect');
        batons.forEach(baton => {
            baton.style.animation = 'conductorWave 2s ease-in-out infinite';
        });
    },
    
    sheetMusicFlow() {
        const sheets = document.querySelectorAll('.sheet-music-effect');
        sheets.forEach(sheet => {
            sheet.style.animation = 'sheetMusicFlow 4s ease-in-out infinite';
        });
    },
    
    orchestraRise() {
        const elements = document.querySelectorAll('.orchestra-rise');
        elements.forEach((el, i) => {
            el.style.animation = `slideIn ${0.5 + i * 0.1}s ease`;
        });
    }
};

// Hip-Hop Theme Animations
const hiphopAnimations = {
    turntableScratch() {
        const turntables = document.querySelectorAll('.turntable-effect');
        turntables.forEach(tt => {
            tt.style.animation = 'scratchEffect 1.5s ease-in-out';
            setTimeout(() => {
                tt.style.animation = '';
            }, 1500);
        });
    },
    
    beatBounce() {
        const beats = document.querySelectorAll('.beat-effect');
        beats.forEach(beat => {
            beat.style.animation = 'beatBounce 0.8s ease-in-out infinite';
        });
    },
    
    sprayPaint() {
        const graffiti = document.querySelectorAll('.graffiti-effect');
        graffiti.forEach(g => {
            g.style.animation = 'sprayPaint 3s ease-in-out';
        });
    }
};

// Animation Manager
class AnimationManager {
    constructor() {
        this.currentTheme = 'mario';
        this.animations = {
            mario: marioAnimations,
            rock: rockAnimations,
            jazz: jazzAnimations,
            edm: edmAnimations,
            classical: classicalAnimations,
            hiphop: hiphopAnimations
        };
        this.init();
    }

    init() {
        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.applyThemeAnimations(e.detail.theme);
        });
        
        console.log('✨ Animation Manager initialized');
    }

    applyThemeAnimations(theme) {
        const themeAnims = this.animations[theme];
        if (themeAnims) {
            // Apply default animations for theme
            Object.values(themeAnims).forEach(animFunc => {
                if (typeof animFunc === 'function') {
                    try {
                        animFunc();
                    } catch (e) {
                        // Silently fail if elements don't exist
                    }
                }
            });
        }
    }

    trigger(animationName) {
        const themeAnims = this.animations[this.currentTheme];
        if (themeAnims && themeAnims[animationName]) {
            themeAnims[animationName]();
        }
    }
}

// Additional CSS animations
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes powerUpFlash {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.5); }
    }
    
    @keyframes jumpEffect {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes flameFlicker {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
    }
    
    @keyframes stageLightPulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
    
    @keyframes saxSway {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }
`;
document.head.appendChild(animStyle);

// Initialize animation manager
let animationManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        animationManager = new AnimationManager();
        window.animationManager = animationManager;
    });
} else {
    animationManager = new AnimationManager();
    window.animationManager = animationManager;
}
