/**
 * 🧠 Interest Detector - Behavioral Learning Engine
 * Tracks user behavior and adapts theme preferences
 */

class InterestDetector {
    constructor() {
        this.tracksPlayed = [];
        this.timeSpentOnThemes = {};
        this.searchQueries = [];
        this.clickPatterns = [];
        this.sessionStart = Date.now();
        this.storageKey = 'infinity-jukebox-behavior';
        this.init();
    }

    init() {
        this.loadBehaviorData();
        this.startTracking();
        
        // Update stats every 30 seconds
        setInterval(() => this.updateStats(), 30000);
        
        console.log('🧠 Interest Detector initialized');
    }

    loadBehaviorData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.tracksPlayed = parsed.tracksPlayed || [];
                this.timeSpentOnThemes = parsed.timeSpentOnThemes || {};
                this.searchQueries = parsed.searchQueries || [];
                this.clickPatterns = parsed.clickPatterns || [];
            }
        } catch (e) {
            console.error('Failed to load behavior data:', e);
        }
    }

    saveBehaviorData() {
        try {
            const data = {
                tracksPlayed: this.tracksPlayed.slice(-100), // Keep last 100
                timeSpentOnThemes: this.timeSpentOnThemes,
                searchQueries: this.searchQueries.slice(-50), // Keep last 50
                clickPatterns: this.clickPatterns.slice(-100), // Keep last 100
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save behavior data:', e);
        }
    }

    startTracking() {
        // Track theme time
        window.addEventListener('themeChanged', (e) => {
            this.trackThemeTime(e.detail.theme);
        });

        // Track track plays
        window.addEventListener('trackPlayed', (e) => {
            this.trackPlay(e.detail);
        });

        // Track searches
        window.addEventListener('searchPerformed', (e) => {
            this.trackSearch(e.detail.query);
        });

        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });

        // Track time on current theme
        if (window.themeMorpher) {
            this.trackThemeTime(window.themeMorpher.currentTheme);
        }
    }

    trackThemeTime(theme) {
        if (!this.timeSpentOnThemes[theme]) {
            this.timeSpentOnThemes[theme] = 0;
        }
        
        // Track time spent (updated every 30 seconds)
        this.currentTheme = theme;
        this.themeStartTime = Date.now();
    }

    updateStats() {
        if (this.currentTheme && this.themeStartTime) {
            const timeSpent = (Date.now() - this.themeStartTime) / 1000; // seconds
            this.timeSpentOnThemes[this.currentTheme] += timeSpent;
            this.themeStartTime = Date.now();
            this.saveBehaviorData();
        }
        
        // Update UI stats
        this.updateStatsDisplay();
    }

    trackPlay(track) {
        this.tracksPlayed.push({
            track: track,
            theme: this.currentTheme,
            timestamp: Date.now()
        });
        this.saveBehaviorData();
    }

    trackSearch(query) {
        this.searchQueries.push({
            query: query,
            theme: this.currentTheme,
            timestamp: Date.now()
        });
        this.saveBehaviorData();
    }

    trackClick(event) {
        const target = event.target;
        if (target.tagName === 'BUTTON' || target.closest('button')) {
            const btn = target.tagName === 'BUTTON' ? target : target.closest('button');
            this.clickPatterns.push({
                element: btn.className,
                theme: this.currentTheme,
                timestamp: Date.now()
            });
        }
    }

    detectDominantInterest() {
        // Analyze time spent on each theme
        const themes = Object.keys(this.timeSpentOnThemes);
        if (themes.length === 0) return null;
        
        let maxTime = 0;
        let dominantTheme = null;
        
        themes.forEach(theme => {
            if (this.timeSpentOnThemes[theme] > maxTime) {
                maxTime = this.timeSpentOnThemes[theme];
                dominantTheme = theme;
            }
        });
        
        return dominantTheme;
    }

    adaptInRealTime() {
        // Check if user has spent significant time (>5 minutes) on a different theme
        const dominant = this.detectDominantInterest();
        const currentTheme = this.currentTheme;
        
        if (dominant && dominant !== currentTheme) {
            const currentTime = this.timeSpentOnThemes[currentTheme] || 0;
            const dominantTime = this.timeSpentOnThemes[dominant] || 0;
            
            // If dominant theme has 2x more time, suggest switching
            if (dominantTime > currentTime * 2 && dominantTime > 300) { // 5 minutes
                this.suggestThemeSwitch(dominant);
            }
        }
    }

    suggestThemeSwitch(theme) {
        const messages = {
            mario: "We noticed you love classic gaming vibes! Want to switch to the Mario theme? 🍄",
            rock: "Rock on! Want to switch to the Rock Arena theme? 🎸",
            jazz: "Smooth jazz lover detected! Switch to Jazz Club? 🎷",
            edm: "EDM enthusiast! Ready to switch to Electronic theme? 🎧",
            classical: "Classical music aficionado! Switch to Symphony Hall? 🎻",
            hiphop: "Hip-hop head! Want to switch to the Studio theme? 🎤"
        };
        
        const message = messages[theme] || `Switch to ${theme} theme?`;
        
        if (confirm(message)) {
            if (window.themeMorpher) {
                window.themeMorpher.switchTheme(theme);
            }
        }
    }

    updateStatsDisplay() {
        const tracksPlayedEl = document.getElementById('tracks-played');
        const timeSpentEl = document.getElementById('time-spent');
        
        if (tracksPlayedEl) {
            tracksPlayedEl.textContent = this.tracksPlayed.length;
        }
        
        if (timeSpentEl) {
            const totalSeconds = Object.values(this.timeSpentOnThemes).reduce((a, b) => a + b, 0);
            const minutes = Math.floor(totalSeconds / 60);
            timeSpentEl.textContent = `${minutes}m`;
        }
    }

    getInsights() {
        return {
            tracksPlayed: this.tracksPlayed.length,
            totalTimeSeconds: Object.values(this.timeSpentOnThemes).reduce((a, b) => a + b, 0),
            dominantTheme: this.detectDominantInterest(),
            searchCount: this.searchQueries.length,
            clickCount: this.clickPatterns.length
        };
    }

    reset() {
        this.tracksPlayed = [];
        this.timeSpentOnThemes = {};
        this.searchQueries = [];
        this.clickPatterns = [];
        this.saveBehaviorData();
        console.log('🔄 Behavior data reset');
    }
}

// Initialize interest detector when DOM is loaded
let interestDetector;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        interestDetector = new InterestDetector();
        window.interestDetector = interestDetector;
        
        // Check for adaptation every 2 minutes
        setInterval(() => {
            if (window.interestDetector) {
                window.interestDetector.adaptInRealTime();
            }
        }, 120000);
    });
} else {
    interestDetector = new InterestDetector();
    window.interestDetector = interestDetector;
    
    // Check for adaptation every 2 minutes
    setInterval(() => {
        if (window.interestDetector) {
            window.interestDetector.adaptInRealTime();
        }
    }, 120000);
}
