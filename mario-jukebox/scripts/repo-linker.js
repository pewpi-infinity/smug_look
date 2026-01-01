/**
 * 🔗 Repo Linker - Cross-Repo Linking System
 * Manages bidirectional links between repos
 */

class RepoLinker {
    constructor() {
        this.repos = [
            { name: 'smug_look', url: 'https://github.com/pewpi-infinity/smug_look', primary: true },
            { name: 'legend-core', url: 'https://github.com/pewpi-infinity/legend-core' },
            { name: 'infinity-portal', url: 'https://github.com/pewpi-infinity/infinity-portal' },
            { name: 'Design-Depo', url: 'https://github.com/pewpi-infinity/Design-Depo' },
            { name: 'GPT-Vector-Design', url: 'https://github.com/pewpi-infinity/GPT-Vector-Design' },
            { name: 'mongoose.os', url: 'https://github.com/pewpi-infinity/mongoose.os' },
            { name: 'rooster.os', url: 'https://github.com/pewpi-infinity/rooster.os' },
            { name: 'Gutenberg', url: 'https://github.com/pewpi-infinity/Gutenberg' },
            { name: 'Osprey-Terminal', url: 'https://github.com/pewpi-infinity/Osprey-Terminal' }
        ];
        this.linkedRepos = 0;
        this.init();
    }

    init() {
        this.updateRepoLinks();
        console.log('🔗 Repo Linker initialized (BRIDGE)');
    }

    updateRepoLinks() {
        // Update repos linked stat
        const reposLinkedEl = document.getElementById('repos-linked');
        if (reposLinkedEl) {
            reposLinkedEl.textContent = this.linkedRepos;
        }
    }

    linkToRepo(repoName) {
        const repo = this.repos.find(r => r.name === repoName);
        if (repo) {
            this.linkedRepos++;
            this.updateRepoLinks();
            console.log(`🔗 Linked to: ${repo.name}`);
            return repo.url;
        }
        return null;
    }

    scanForTokens(repoName) {
        console.log(`🔍 Scanning ${repoName} for Infinity tokens...`);
        // This would scan repos for token formulas
        return [];
    }

    propagatePattern(fromRepo, toRepo, pattern) {
        console.log(`🌊 Propagating pattern from ${fromRepo} to ${toRepo}`);
        // Spread intelligence between repos (ADDITIVE ONLY)
    }

    getAllRepos() {
        return this.repos;
    }
}

// Initialize repo linker
let repoLinker;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        repoLinker = new RepoLinker();
        window.repoLinker = repoLinker;
    });
} else {
    repoLinker = new RepoLinker();
    window.repoLinker = repoLinker;
}
