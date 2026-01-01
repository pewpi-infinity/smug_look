/**
 * 🪐 Memory Node - MEMORY_NODE + CHAIN
 * Persistent storage with immutable history
 */

class MemoryNode {
    constructor() {
        this.playlist = [];
        this.history = [];
        this.favorites = [];
        this.storageKey = 'infinity-jukebox-memory';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupControls();
        this.renderPlaylist();
        this.renderHistory();
        
        console.log('🪐 Memory Node initialized (MEMORY_NODE)');
    }

    setupControls() {
        // Load collection button
        const loadBtn = document.getElementById('btn-load-collection');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                // Trigger archive browser
                if (window.archiveConnector) {
                    window.archiveConnector.openBrowser();
                }
            });
        }

        // Save playlist button
        const saveBtn = document.getElementById('btn-save-playlist');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePlaylist();
            });
        }

        // Clear playlist button
        const clearBtn = document.getElementById('btn-clear-playlist');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearPlaylist();
            });
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.playlist = parsed.playlist || [];
                this.history = parsed.history || [];
                this.favorites = parsed.favorites || [];
                console.log('📦 Memory loaded from storage');
            }
        } catch (e) {
            console.error('Failed to load memory:', e);
        }
    }

    saveToStorage() {
        try {
            const data = {
                playlist: this.playlist,
                history: this.history,
                favorites: this.favorites,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('💾 Memory saved to storage');
        } catch (e) {
            console.error('Failed to save memory:', e);
        }
    }

    addToPlaylist(track) {
        if (!track || !track.url) return;
        
        // Check if already in playlist
        const exists = this.playlist.some(t => t.url === track.url);
        if (exists) {
            console.log('Track already in playlist');
            return;
        }
        
        this.playlist.push({
            ...track,
            addedAt: new Date().toISOString()
        });
        
        this.saveToStorage();
        this.renderPlaylist();
        
        // Update audio engine
        if (window.audioEngine) {
            window.audioEngine.setPlaylist(this.playlist);
        }
        
        console.log(`➕ Added to playlist: ${track.title}`);
    }

    removeFromPlaylist(index) {
        if (index >= 0 && index < this.playlist.length) {
            const removed = this.playlist.splice(index, 1)[0];
            this.saveToStorage();
            this.renderPlaylist();
            
            // Update audio engine
            if (window.audioEngine) {
                window.audioEngine.setPlaylist(this.playlist);
            }
            
            console.log(`➖ Removed from playlist: ${removed.title}`);
        }
    }

    clearPlaylist() {
        if (confirm('Clear entire playlist? This cannot be undone.')) {
            this.playlist = [];
            this.saveToStorage();
            this.renderPlaylist();
            
            // Update audio engine
            if (window.audioEngine) {
                window.audioEngine.clearPlaylist();
            }
            
            console.log('🗑️ Playlist cleared');
        }
    }

    addToHistory(track) {
        if (!track) return;
        
        // Add to immutable history chain
        const historyEntry = {
            ...track,
            playedAt: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        // Keep last 100 entries
        this.history.unshift(historyEntry);
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        
        this.saveToStorage();
        this.renderHistory();
        
        console.log(`⛓️ Added to history chain: ${track.title}`);
    }

    renderPlaylist() {
        const container = document.getElementById('playlist-items');
        if (!container) return;
        
        if (this.playlist.length === 0) {
            container.innerHTML = `
                <div class="empty-playlist">
                    <p>🎵 No tracks loaded yet</p>
                    <p>Load a collection from Internet Archive to get started!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.playlist.map((track, index) => `
            <div class="playlist-item" data-index="${index}">
                <div class="track-number">${index + 1}</div>
                <div class="track-details">
                    <div class="track-name">${this.escapeHtml(track.title)}</div>
                    <div class="track-meta">${this.escapeHtml(track.artist || 'Unknown Artist')}</div>
                </div>
                <div class="track-actions">
                    <button class="action-btn-small play-track" data-index="${index}">▶️</button>
                    <button class="action-btn-small remove-track" data-index="${index}">✕</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.play-track').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.getAttribute('data-index'));
                this.playTrack(index);
            });
        });
        
        container.querySelectorAll('.remove-track').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.getAttribute('data-index'));
                this.removeFromPlaylist(index);
            });
        });
    }

    renderHistory() {
        const container = document.getElementById('history-items');
        if (!container) return;
        
        if (this.history.length === 0) {
            container.innerHTML = '<p style="opacity: 0.5; padding: 20px; text-align: center;">No tracks played yet</p>';
            return;
        }
        
        // Show last 10 entries
        const recentHistory = this.history.slice(0, 10);
        
        container.innerHTML = recentHistory.map(entry => `
            <div class="history-item">
                <div class="history-icon">⛓️</div>
                <div class="history-details">
                    <div class="history-title">${this.escapeHtml(entry.title)}</div>
                    <div class="history-time">${this.formatTimestamp(entry.playedAt)}</div>
                </div>
            </div>
        `).join('');
    }

    playTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            if (window.audioEngine) {
                window.audioEngine.currentTrackIndex = index;
                window.audioEngine.loadTrack(this.playlist[index]);
                window.audioEngine.play();
            }
        }
    }

    savePlaylist() {
        const name = prompt('Enter playlist name:');
        if (!name) return;
        
        const savedPlaylists = this.getSavedPlaylists();
        savedPlaylists[name] = {
            tracks: this.playlist,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('infinity-jukebox-playlists', JSON.stringify(savedPlaylists));
        alert(`Playlist "${name}" saved!`);
        console.log(`💾 Playlist saved: ${name}`);
    }

    getSavedPlaylists() {
        try {
            const data = localStorage.getItem('infinity-jukebox-playlists');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    // Export/Import functionality
    exportMemory() {
        const data = {
            playlist: this.playlist,
            history: this.history,
            favorites: this.favorites,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infinity-jukebox-memory-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📤 Memory exported');
    }

    importMemory(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.playlist = data.playlist || [];
                this.history = data.history || [];
                this.favorites = data.favorites || [];
                this.saveToStorage();
                this.renderPlaylist();
                this.renderHistory();
                console.log('📥 Memory imported');
            } catch (err) {
                console.error('Failed to import memory:', err);
            }
        };
        reader.readAsText(file);
    }
}

// CSS for playlist and history items
const style = document.createElement('style');
style.textContent = `
    .playlist-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    
    .playlist-item:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(5px);
    }
    
    .track-number {
        font-weight: bold;
        font-size: 1.2rem;
        opacity: 0.5;
        min-width: 30px;
    }
    
    .track-details {
        flex: 1;
    }
    
    .track-name {
        font-weight: bold;
        margin-bottom: 4px;
    }
    
    .track-meta {
        font-size: 0.85rem;
        opacity: 0.7;
    }
    
    .track-actions {
        display: flex;
        gap: 8px;
    }
    
    .action-btn-small {
        padding: 6px 12px;
        font-size: 0.9rem;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.1);
        color: inherit;
    }
    
    .action-btn-small:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }
    
    .history-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        margin-bottom: 6px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        border-left: 3px solid var(--legend-purple);
    }
    
    .history-icon {
        font-size: 1.2rem;
    }
    
    .history-title {
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .history-time {
        font-size: 0.75rem;
        opacity: 0.6;
    }
`;
document.head.appendChild(style);

// Initialize memory node when DOM is loaded
let memoryNode;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        memoryNode = new MemoryNode();
        window.memoryNode = memoryNode;
    });
} else {
    memoryNode = new MemoryNode();
    window.memoryNode = memoryNode;
}
