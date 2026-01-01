/**
 * 🪡 Archive Connector - WEAVER + BRIDGE
 * Internet Archive API integration with cross-repo linking
 */

class ArchiveConnector {
    constructor() {
        this.baseUrl = 'https://archive.org';
        this.collections = {
            mario: [
                { id: 'opensource_audio', name: '8-bit & Chiptune', description: 'Classic gaming sounds' },
                { id: 'audio', name: 'General Audio', description: 'Various audio files' }
            ],
            rock: [
                { id: 'etree', name: 'Live Music Archive', description: 'Concert recordings' },
                { id: 'audio', name: 'Rock Collections', description: 'Rock music archives' }
            ],
            jazz: [
                { id: 'audio', name: 'Jazz Collections', description: 'Jazz standards and classics' },
                { id: 'opensource_audio', name: 'Open Source Jazz', description: 'Free jazz recordings' }
            ],
            edm: [
                { id: 'opensource_audio', name: 'Electronic Music', description: 'EDM and electronic' },
                { id: 'audio', name: 'Synthesizer Music', description: 'Electronic pioneers' }
            ],
            classical: [
                { id: 'audio', name: 'Classical Music', description: 'Public domain symphonies' },
                { id: 'opensource_audio', name: 'Classical Archive', description: 'Orchestra recordings' }
            ],
            hiphop: [
                { id: 'opensource_audio', name: 'Hip-Hop Archive', description: 'Beats and instrumentals' },
                { id: 'audio', name: 'Urban Music', description: 'Hip-hop collections' }
            ]
        };
        this.currentTheme = 'mario';
        this.init();
    }

    init() {
        this.setupSearch();
        this.loadThemeCollections(this.currentTheme);
        
        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.loadThemeCollections(e.detail.theme);
        });
        
        console.log('🪡 Archive Connector initialized (WEAVER)');
    }

    setupSearch() {
        const searchBtn = document.getElementById('btn-search-archive');
        const searchInput = document.getElementById('archive-search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.search(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.search(searchInput.value);
                }
            });
        }
    }

    loadThemeCollections(theme) {
        const container = document.getElementById('collections-grid');
        if (!container) return;
        
        const collections = this.collections[theme] || this.collections.mario;
        
        container.innerHTML = collections.map(col => `
            <div class="collection-card" data-collection="${col.id}">
                <div class="collection-icon">📁</div>
                <h4 class="collection-name">${col.name}</h4>
                <p class="collection-desc">${col.description}</p>
                <button class="browse-btn" data-collection="${col.id}">
                    🔍 Browse
                </button>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.browse-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const collectionId = btn.getAttribute('data-collection');
                this.browseCollection(collectionId);
            });
        });
    }

    async browseCollection(collectionId) {
        console.log(`📂 Browsing collection: ${collectionId}`);
        
        try {
            // Show loading state
            this.showLoading('Loading collection...');
            
            // Fetch collection metadata
            const metadata = await this.fetchCollectionMetadata(collectionId);
            
            if (metadata && metadata.files) {
                // Filter audio files
                const audioFiles = metadata.files.filter(file => 
                    file.format && (
                        file.format.toLowerCase().includes('mp3') ||
                        file.format.toLowerCase().includes('vorbis') ||
                        file.format.toLowerCase().includes('mpeg')
                    )
                );
                
                if (audioFiles.length > 0) {
                    this.displayTracks(audioFiles, collectionId, metadata.metadata);
                } else {
                    this.showMessage('No audio files found in this collection');
                }
            } else {
                this.showMessage('Could not load collection');
            }
            
            this.hideLoading();
        } catch (error) {
            console.error('Error browsing collection:', error);
            this.showMessage('Error loading collection. Please try again.');
            this.hideLoading();
        }
    }

    async fetchCollectionMetadata(collectionId) {
        const url = `${this.baseUrl}/metadata/${collectionId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    async search(query) {
        if (!query || query.trim() === '') {
            this.showMessage('Please enter a search term');
            return;
        }
        
        console.log(`🔍 Searching for: ${query}`);
        
        try {
            this.showLoading('Searching...');
            
            // Search Archive.org
            const searchUrl = `${this.baseUrl}/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,format&output=json&rows=20`;
            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.response && data.response.docs && data.response.docs.length > 0) {
                this.displaySearchResults(data.response.docs);
            } else {
                this.showMessage('No results found');
            }
            
            this.hideLoading();
        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('Search failed. Please try again.');
            this.hideLoading();
        }
    }

    displaySearchResults(results) {
        const container = document.getElementById('collections-grid');
        if (!container) return;
        
        container.innerHTML = results.map(item => `
            <div class="collection-card" data-identifier="${item.identifier}">
                <div class="collection-icon">🎵</div>
                <h4 class="collection-name">${this.escapeHtml(item.title)}</h4>
                <p class="collection-desc">By: ${this.escapeHtml(item.creator || 'Unknown')}</p>
                <button class="browse-btn" data-identifier="${item.identifier}">
                    🔍 View
                </button>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.browse-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const identifier = btn.getAttribute('data-identifier');
                this.browseCollection(identifier);
            });
        });
    }

    displayTracks(files, collectionId, metadata) {
        // Create modal or overlay to display tracks
        const modal = this.createModal();
        
        const tracksHtml = files.slice(0, 20).map((file, index) => `
            <div class="track-item" data-index="${index}">
                <div class="track-num">${index + 1}</div>
                <div class="track-info">
                    <div class="track-title">${this.escapeHtml(file.name || file.title || 'Unknown Track')}</div>
                    <div class="track-format">${file.format} • ${this.formatSize(file.size)}</div>
                </div>
                <button class="add-track-btn" data-file="${file.name}">
                    ➕ Add
                </button>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📁 ${this.escapeHtml(metadata?.title || collectionId)}</h3>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <p class="tracks-count">Found ${files.length} audio files (showing first 20)</p>
                    <button class="add-all-btn">➕ Add All to Playlist</button>
                    <div class="tracks-list">
                        ${tracksHtml}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.add-all-btn').addEventListener('click', () => {
            files.slice(0, 20).forEach(file => {
                this.addTrackToPlaylist(file, collectionId, metadata);
            });
            modal.remove();
        });
        
        modal.querySelectorAll('.add-track-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileName = btn.getAttribute('data-file');
                const file = files.find(f => f.name === fileName);
                if (file) {
                    this.addTrackToPlaylist(file, collectionId, metadata);
                    btn.textContent = '✓ Added';
                    btn.disabled = true;
                }
            });
        });
    }

    addTrackToPlaylist(file, collectionId, metadata) {
        const track = {
            title: file.title || file.name || 'Unknown Track',
            artist: metadata?.creator || 'Internet Archive',
            url: `${this.baseUrl}/download/${collectionId}/${file.name}`,
            collection: metadata?.title || collectionId,
            format: file.format,
            size: file.size
        };
        
        if (window.memoryNode) {
            window.memoryNode.addToPlaylist(track);
        }
        
        console.log(`➕ Added to playlist: ${track.title}`);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'archive-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        return modal;
    }

    showLoading(message) {
        // Create loading overlay
        const loading = document.createElement('div');
        loading.id = 'archive-loading';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        `;
        loading.innerHTML = `<div class="pulse">⏳ ${message}</div>`;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('archive-loading');
        if (loading) {
            loading.remove();
        }
    }

    showMessage(message) {
        alert(message);
    }

    formatSize(bytes) {
        if (!bytes) return 'Unknown';
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2) + ' MB';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    openBrowser() {
        // Open archive browser interface
        console.log('📂 Opening archive browser');
    }
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-content {
        background: rgba(0, 0, 0, 0.95);
        border: 3px solid var(--legend-yellow, #ffff00);
        border-radius: 15px;
        max-width: 800px;
        width: 100%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }
    
    .modal-header h3 {
        margin: 0;
        color: var(--legend-yellow, #ffff00);
    }
    
    .close-modal {
        background: rgba(255, 0, 0, 0.3);
        border: 2px solid #ff0000;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .modal-body {
        padding: 20px;
        overflow-y: auto;
    }
    
    .tracks-count {
        margin-bottom: 15px;
        opacity: 0.7;
    }
    
    .add-all-btn {
        margin-bottom: 20px;
        padding: 10px 20px;
        background: var(--legend-green, #00ff00);
        border: 2px solid #00cc00;
        color: #000;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
    }
    
    .tracks-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .track-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .track-num {
        font-weight: bold;
        opacity: 0.5;
        min-width: 30px;
    }
    
    .track-info {
        flex: 1;
    }
    
    .track-title {
        font-weight: bold;
        margin-bottom: 4px;
    }
    
    .track-format {
        font-size: 0.85rem;
        opacity: 0.6;
    }
    
    .add-track-btn {
        padding: 8px 16px;
        background: var(--legend-green, #00ff00);
        border: 1px solid #00cc00;
        color: #000;
        font-weight: bold;
        border-radius: 6px;
        cursor: pointer;
    }
    
    .add-track-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .collection-card {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .collection-card:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-5px);
        box-shadow: 0 5px 20px rgba(255, 255, 255, 0.2);
    }
    
    .collection-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
    
    .collection-name {
        margin: 10px 0;
        color: var(--legend-yellow, #ffff00);
    }
    
    .collection-desc {
        opacity: 0.7;
        margin-bottom: 15px;
    }
    
    .browse-btn {
        padding: 10px 20px;
        background: var(--legend-blue, #0088ff);
        border: 2px solid #0066cc;
        color: white;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
    }
`;
document.head.appendChild(modalStyles);

// Initialize archive connector when DOM is loaded
let archiveConnector;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        archiveConnector = new ArchiveConnector();
        window.archiveConnector = archiveConnector;
    });
} else {
    archiveConnector = new ArchiveConnector();
    window.archiveConnector = archiveConnector;
}
