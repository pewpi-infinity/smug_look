/**
 * 🎨 Theme Morpher - Real-time Theme Switching
 * Handles smooth transitions between themes
 */

class ThemeMorpher {
    constructor() {
        this.currentTheme = 'mario';
        this.themes = ['mario', 'rock', 'jazz', 'edm', 'classical', 'hiphop'];
        this.taglines = {
            mario: "Build your own Mushroom Kingdom of repos! 🍄👑",
            rock: "Create your legendary band's repo tour! 🎸⚡",
            jazz: "Compose your jazz-inspired code symphony! 🎷✨",
            edm: "Build your own music production chain! 🎧💫",
            classical: "Orchestrate your repo symphony! 🎻🎼",
            hiphop: "Drop your own repo mixtape! 🎤🔥"
        };
        this.arenaDescriptions = {
            mario: "Welcome to your Mushroom Kingdom! Every repo is a new level. Collect power-ups to unlock features!",
            rock: "Welcome to the stage! Each repo is a new venue on your world tour. Build your setlist!",
            jazz: "Welcome to the club! Each repo is a new composition. Improvise your code symphony!",
            edm: "Welcome to the studio! Each repo is a new track. Drop the bass on your codebase!",
            classical: "Welcome to the hall! Each repo is a new movement. Conduct your masterpiece!",
            hiphop: "Welcome to the booth! Each repo is a new track. Spit your code bars!"
        };
        this.init();
    }

    init() {
        // Hide quiz and show jukebox
        const quiz = document.getElementById('welcome-quiz');
        const jukebox = document.getElementById('jukebox-main');
        
        // Set up quiz buttons
        const interestBtns = document.querySelectorAll('.interest-btn');
        interestBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = btn.getAttribute('data-theme');
                this.handleQuizSelection(theme, quiz, jukebox);
            });
        });

        // Set up theme switcher buttons
        const themeBtns = document.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = btn.getAttribute('data-theme');
                this.switchTheme(theme);
            });
        });

        // Check if user has visited before
        const savedTheme = localStorage.getItem('infinity-jukebox-theme');
        if (savedTheme) {
            // Skip quiz, go straight to saved theme
            quiz.classList.remove('active');
            jukebox.style.display = 'block';
            this.switchTheme(savedTheme);
        }
    }

    handleQuizSelection(theme, quiz, jukebox) {
        if (theme === 'surprise') {
            // Pick random theme
            const randomIndex = Math.floor(Math.random() * this.themes.length);
            theme = this.themes[randomIndex];
        }

        // Save preference
        localStorage.setItem('infinity-jukebox-theme', theme);
        
        // Smooth transition
        quiz.style.opacity = '0';
        setTimeout(() => {
            quiz.classList.remove('active');
            quiz.style.display = 'none';
            jukebox.style.display = 'block';
            jukebox.style.opacity = '0';
            this.switchTheme(theme);
            setTimeout(() => {
                jukebox.style.opacity = '1';
            }, 50);
        }, 500);
    }

    switchTheme(newTheme) {
        if (this.currentTheme === newTheme) return;

        const body = document.body;
        
        // Remove old theme class
        body.classList.remove(`theme-${this.currentTheme}`);
        
        // Add new theme class
        body.classList.add(`theme-${newTheme}`);
        
        // Update current theme
        this.currentTheme = newTheme;
        
        // Update UI elements
        this.updateTagline(newTheme);
        this.updateArenaDescription(newTheme);
        this.updateThemeButtons(newTheme);
        this.updateCollections(newTheme);
        
        // Save preference
        localStorage.setItem('infinity-jukebox-theme', newTheme);
        
        // Trigger theme change event
        this.triggerThemeChange(newTheme);
        
        // Log theme switch
        console.log(`🎨 Theme switched to: ${newTheme}`);
    }

    updateTagline(theme) {
        const taglineEl = document.getElementById('theme-tagline');
        if (taglineEl) {
            taglineEl.textContent = this.taglines[theme];
        }
    }

    updateArenaDescription(theme) {
        const descEl = document.getElementById('arena-description');
        if (descEl) {
            descEl.textContent = this.arenaDescriptions[theme];
        }
    }

    updateThemeButtons(theme) {
        const themeBtns = document.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateCollections(theme) {
        // Update Archive collections based on theme
        if (window.archiveConnector) {
            window.archiveConnector.loadThemeCollections(theme);
        }
    }

    triggerThemeChange(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        window.dispatchEvent(event);
    }

    morphToTheme(targetTheme, duration = 2000) {
        // Gradual morphing animation
        const steps = 20;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const morphInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            
            // Apply intermediate styling
            document.body.style.transition = `all ${stepDuration}ms ease`;
            
            if (currentStep >= steps) {
                clearInterval(morphInterval);
                this.switchTheme(targetTheme);
            }
        }, stepDuration);
    }

    resetToQuiz() {
        const quiz = document.getElementById('welcome-quiz');
        const jukebox = document.getElementById('jukebox-main');
        
        jukebox.style.opacity = '0';
        setTimeout(() => {
            jukebox.style.display = 'none';
            quiz.style.display = 'flex';
            quiz.classList.add('active');
            setTimeout(() => {
                quiz.style.opacity = '1';
            }, 50);
        }, 500);
        
        // Clear saved theme
        localStorage.removeItem('infinity-jukebox-theme');
    }
}

// Initialize theme morpher when DOM is loaded
let themeMorpher;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeMorpher = new ThemeMorpher();
        window.themeMorpher = themeMorpher;
    });
} else {
    themeMorpher = new ThemeMorpher();
    window.themeMorpher = themeMorpher;
}
