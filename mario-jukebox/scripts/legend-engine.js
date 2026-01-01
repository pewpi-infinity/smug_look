/**
 * 👑 Legend Engine - Core Legend Architecture
 * Manages all 17 Legend roles and their interactions
 */

class LegendEngine {
    constructor() {
        this.roles = {
            CROWN_INDEX: { symbol: '👑', active: true, description: 'Central catalog' },
            ROBOT_CORE: { symbol: '🦾', active: true, description: 'Autonomous playback' },
            MEMORY_NODE: { symbol: '🪐', active: true, description: 'Persistent storage' },
            RUNTIME: { symbol: '⭐', active: true, description: 'Real-time streaming' },
            CONTROLLER: { symbol: '🕹️', active: true, description: 'Interactive controls' },
            ENCODE: { symbol: '🧱', active: true, description: 'Format handling' },
            MONITOR: { symbol: '👁️', active: true, description: 'Visual display' },
            SYNC: { symbol: '🎵', active: true, description: 'Multi-repo sync' },
            WEAVER: { symbol: '🪡', active: true, description: 'Content threading' },
            ROUTER: { symbol: '🔀', active: true, description: 'Audio routing' },
            BRIDGE: { symbol: '🔗', active: true, description: 'Cross-repo linking' },
            AUDITOR: { symbol: '🍄', active: true, description: 'Quality validation' },
            MODULATOR: { symbol: '🎛️', active: true, description: 'Audio effects' },
            BEACON: { symbol: '💫', active: true, description: 'Star favorites' },
            AGGREGATOR: { symbol: '✨', active: true, description: 'Community playlists' },
            CHAIN: { symbol: '⛓️', active: true, description: 'Immutable history' },
            SPINE: { symbol: '🎛️', active: true, description: 'Central routing' }
        };
        this.init();
    }

    init() {
        console.log('👑 Legend Engine initialized');
        this.displayActiveRoles();
    }

    displayActiveRoles() {
        const activeRoles = Object.entries(this.roles)
            .filter(([name, role]) => role.active)
            .map(([name, role]) => `${role.symbol} ${name}`);
        
        console.log('Active Legend Roles:', activeRoles.join(', '));
    }

    getRoleStatus(roleName) {
        return this.roles[roleName] || null;
    }

    toggleRole(roleName, active) {
        if (this.roles[roleName]) {
            this.roles[roleName].active = active;
            console.log(`${this.roles[roleName].symbol} ${roleName} ${active ? 'activated' : 'deactivated'}`);
        }
    }
}

// Initialize legend engine
let legendEngine;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        legendEngine = new LegendEngine();
        window.legendEngine = legendEngine;
    });
} else {
    legendEngine = new LegendEngine();
    window.legendEngine = legendEngine;
}
