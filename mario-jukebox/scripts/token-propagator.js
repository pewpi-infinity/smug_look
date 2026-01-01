/**
 * 🧱 Token Propagator - Token Formula System
 * Manages Kris token formulas and propagation
 */

class TokenPropagator {
    constructor() {
        this.coreId = '🧱Kris🔑';
        this.formulas = {
            '👑📶⚪': { name: 'powerful_orchestrator', description: 'Crown + Nuances + Token' },
            '💎👑🍄': { name: 'facet_crown_growth', description: 'Facet + Crown + Mushroom' },
            '⚪👑🔗': { name: 'semantic_authority', description: 'Token + Crown + Link' },
            '🗄️🧵📶': { name: 'memory_thread', description: 'Storage + Thread + Nuances' },
            '💎🎛️👑': { name: 'modulation_authority', description: 'Facet + Modulator + Crown' },
            '⚪💰🎵': { name: 'value_audio', description: 'Token + Coin + Music' },
            '🖇️📍🕹️(📀)': { name: 'pinned_control', description: 'Clip + Pin + Controller + Disk' },
            '🪡🤓⭐': { name: 'smart_weaver', description: 'Weaver + Smart + Star' },
            '👑🧲🪐': { name: 'crown_magnet_memory', description: 'Crown + Magnet + Memory (HEARTBEAT)' }
        };
        this.init();
    }

    init() {
        this.setupTokenVisualization();
        this.setupToggle();
        console.log('🧱 Token Propagator initialized');
    }

    setupTokenVisualization() {
        // Token visualization is already in HTML
        // Add interactivity
        const tokenNodes = document.querySelectorAll('.token-node');
        tokenNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                const symbol = node.querySelector('.token-symbol')?.textContent;
                if (symbol) {
                    this.showTokenInfo(symbol);
                }
            });
        });
    }

    setupToggle() {
        const toggleBtn = document.getElementById('btn-toggle-tokens');
        const tokenViz = document.getElementById('token-visualization');
        
        if (toggleBtn && tokenViz) {
            toggleBtn.addEventListener('click', () => {
                tokenViz.classList.toggle('hidden');
            });
        }
    }

    showTokenInfo(symbol) {
        const formula = this.formulas[symbol];
        if (formula) {
            alert(`${symbol}\n\n${formula.name}\n${formula.description}`);
        }
    }

    propagateToRepo(repoName, tokens) {
        console.log(`🌊 Propagating tokens to ${repoName}:`, tokens);
        // This would integrate with repo-linker to spread intelligence
    }

    generateToken(formula) {
        const timestamp = Date.now();
        return {
            formula: formula,
            coreId: this.coreId,
            generated: new Date().toISOString(),
            timestamp: timestamp
        };
    }
}

// Initialize token propagator
let tokenPropagator;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        tokenPropagator = new TokenPropagator();
        window.tokenPropagator = tokenPropagator;
    });
} else {
    tokenPropagator = new TokenPropagator();
    window.tokenPropagator = tokenPropagator;
}
