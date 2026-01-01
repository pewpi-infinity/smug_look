// Mario Bros Jukebox - JavaScript
// Interactive Audio Player with Internet Archive Integration

class MarioJukebox {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeating = false;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        
        this.init();
    }

    init() {
        this.setupDefaultPlaylist();
        this.setupEventListeners();
        this.setupAudioVisualization();
        this.renderPlaylist();
        this.loadTrack(0);
    }

    setupDefaultPlaylist() {
        // Default Mario Bros and Nintendo tracks
        this.playlist = [
            {
                title: 'Super Mario Bros. Theme',
                artist: 'Nintendo - Koji Kondo',
                url: 'https://archive.org/download/super-mario-bros-ost-sfx/01%20-%20Super%20Mario%20Bros.mp3'
            },
            {
                title: 'Super Mario Bros. Underground',
                artist: 'Nintendo - Koji Kondo',
                url: 'https://archive.org/download/super-mario-bros-ost-sfx/02%20-%20Underground.mp3'
            },
            {
                title: 'Super Mario Bros. Underwater',
                artist: 'Nintendo - Koji Kondo',
                url: 'https://archive.org/download/super-mario-bros-ost-sfx/03%20-%20Underwater.mp3'
            },
            {
                title: 'Super Mario Bros. Castle',
                artist: 'Nintendo - Koji Kondo',
                url: 'https://archive.org/download/super-mario-bros-ost-sfx/04%20-%20Castle.mp3'
            },
            {
                title: 'Super Mario Bros. Star',
                artist: 'Nintendo - Koji Kondo',
                url: 'https://archive.org/download/super-mario-bros-ost-sfx/05%20-%20Star.mp3'
            }
        ];
    }

    setupEventListeners() {
        // Playback controls
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousTrack());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextTrack());
        document.getElementById('shuffleBtn').addEventListener('click', () => this.toggleShuffle());
        document.getElementById('repeatBtn').addEventListener('click', () => this.toggleRepeat());

        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Progress bar
        const progressBar = document.getElementById('progressBar');
        progressBar.addEventListener('click', (e) => this.seek(e));

        // Audio events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('ended', () => this.handleTrackEnd());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());

        // Modal controls
        document.getElementById('addTrackBtn').addEventListener('click', () => this.showAddTrackModal());
        document.getElementById('importArchiveBtn').addEventListener('click', () => this.showArchiveModal());
        document.getElementById('closeModal').addEventListener('click', () => this.hideArchiveModal());
        document.getElementById('closeAddTrackModal').addEventListener('click', () => this.hideAddTrackModal());
        document.getElementById('searchArchiveBtn').addEventListener('click', () => this.searchArchive());
        document.getElementById('confirmAddTrack').addEventListener('click', () => this.addCustomTrack());

        // Quick link buttons
        document.querySelectorAll('.quick-link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.target.dataset.query;
                document.getElementById('archiveSearch').value = query;
                this.searchArchive();
            });
        });

        // Power-ups interaction
        document.querySelectorAll('.power-up').forEach(powerUp => {
            powerUp.addEventListener('click', () => this.activatePowerUp(powerUp.dataset.type));
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setupAudioVisualization() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaElementSource(this.audioPlayer);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            this.visualize();
        } catch (error) {
            console.warn('Audio visualization not available:', error);
        }
    }

    visualize() {
        const canvas = document.getElementById('audioVisualizer');
        const ctx = canvas.getContext('2d');
        
        const draw = () => {
            requestAnimationFrame(draw);
            
            if (!this.analyser) return;
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / this.dataArray.length) * 2.5;
            let x = 0;
            
            for (let i = 0; i < this.dataArray.length; i++) {
                const barHeight = (this.dataArray[i] / 255) * canvas.height;
                
                const r = barHeight + (25 * (i / this.dataArray.length));
                const g = 100;
                const b = 250 - (barHeight / 2);
                
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audioPlayer.play();
        this.isPlaying = true;
        document.getElementById('playPauseIcon').textContent = '⏸️';
        this.createParticles('🎵');
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        document.getElementById('playPauseIcon').textContent = '▶️';
    }

    nextTrack() {
        if (this.isShuffled) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }
        this.loadTrack(this.currentIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    previousTrack() {
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const btn = document.getElementById('shuffleBtn');
        btn.style.background = this.isShuffled 
            ? 'linear-gradient(135deg, #ff6347 0%, #ff8c00 100%)'
            : 'linear-gradient(135deg, #5a67d8 0%, #7e22ce 100%)';
        this.createParticles('🔀');
    }

    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        const btn = document.getElementById('repeatBtn');
        btn.style.background = this.isRepeating 
            ? 'linear-gradient(135deg, #ff6347 0%, #ff8c00 100%)'
            : 'linear-gradient(135deg, #5a67d8 0%, #7e22ce 100%)';
        this.createParticles('🔁');
    }

    handleTrackEnd() {
        if (this.isRepeating) {
            this.play();
        } else {
            this.nextTrack();
        }
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        const track = this.playlist[index];
        this.currentIndex = index;
        
        this.audioPlayer.src = track.url;
        document.getElementById('currentTrack').textContent = track.title;
        document.getElementById('currentArtist').textContent = track.artist;
        
        this.updatePlaylistUI();
    }

    setVolume(value) {
        this.audioPlayer.volume = value / 100;
        document.getElementById('volumeValue').textContent = `${value}%`;
        
        const volumeIcon = document.querySelector('.volume-icon');
        if (value == 0) {
            volumeIcon.textContent = '🔇';
        } else if (value < 50) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }

    updateProgress() {
        const current = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;
        
        if (duration) {
            const percent = (current / duration) * 100;
            document.getElementById('progressFill').style.width = `${percent}%`;
            document.querySelector('.progress-coin').style.left = `${percent}%`;
        }
        
        document.getElementById('currentTime').textContent = this.formatTime(current);
    }

    updateDuration() {
        const duration = this.audioPlayer.duration;
        document.getElementById('duration').textContent = this.formatTime(duration);
    }

    seek(e) {
        const progressBar = document.getElementById('progressBar');
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audioPlayer.currentTime = percent * this.audioPlayer.duration;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    renderPlaylist() {
        const playlistContainer = document.getElementById('playlist');
        playlistContainer.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (index === this.currentIndex) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${track.title}</div>
                    <div class="playlist-item-artist">${track.artist}</div>
                </div>
                <div class="playlist-item-actions">
                    <button class="playlist-item-btn" onclick="jukebox.playTrack(${index})">▶️</button>
                    <button class="playlist-item-btn" onclick="jukebox.removeTrack(${index})">🗑️</button>
                </div>
            `;
            
            playlistContainer.appendChild(item);
        });
    }

    updatePlaylistUI() {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    playTrack(index) {
        this.loadTrack(index);
        this.play();
    }

    removeTrack(index) {
        if (this.playlist.length <= 1) {
            alert('Cannot remove the last track!');
            return;
        }
        
        if (index === this.currentIndex && this.isPlaying) {
            this.pause();
        }
        
        this.playlist.splice(index, 1);
        
        if (index < this.currentIndex) {
            this.currentIndex--;
        } else if (index === this.currentIndex) {
            this.loadTrack(this.currentIndex);
        }
        
        this.renderPlaylist();
    }

    showArchiveModal() {
        document.getElementById('archiveModal').classList.add('active');
    }

    hideArchiveModal() {
        document.getElementById('archiveModal').classList.remove('active');
    }

    showAddTrackModal() {
        document.getElementById('addTrackModal').classList.add('active');
    }

    hideAddTrackModal() {
        document.getElementById('addTrackModal').classList.remove('active');
    }

    async searchArchive() {
        const query = document.getElementById('archiveSearch').value;
        if (!query) return;
        
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '<p style="color: #ffd700;">🔍 Searching Internet Archive...</p>';
        
        try {
            // Search Internet Archive API
            const response = await fetch(
                `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,description&rows=10&page=1&output=json&mediatype=audio`
            );
            
            const data = await response.json();
            
            if (data.response.docs.length === 0) {
                resultsContainer.innerHTML = '<p style="color: #ff6347;">No results found. Try a different search term.</p>';
                return;
            }
            
            resultsContainer.innerHTML = '';
            
            data.response.docs.forEach(doc => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <div class="result-title">${doc.title || 'Untitled'}</div>
                    <div class="result-description">${doc.creator || 'Unknown Artist'}</div>
                    <div class="result-description">${doc.description ? doc.description.substring(0, 100) + '...' : ''}</div>
                    <button class="result-btn" onclick="jukebox.loadFromArchive('${doc.identifier}', '${(doc.title || 'Untitled').replace(/'/g, "\\'")}', '${(doc.creator || 'Unknown').replace(/'/g, "\\'")}')">
                        ➕ Add to Playlist
                    </button>
                `;
                resultsContainer.appendChild(resultItem);
            });
            
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<p style="color: #ff6347;">⚠️ Search failed. Please try again.</p>';
        }
    }

    async loadFromArchive(identifier, title, artist) {
        try {
            // Get metadata from Internet Archive
            const metadataUrl = `https://archive.org/metadata/${identifier}`;
            const response = await fetch(metadataUrl);
            const metadata = await response.json();
            
            // Find audio files
            const audioFiles = metadata.files.filter(file => 
                file.format === 'VBR MP3' || 
                file.format === 'MP3' || 
                file.format === 'Ogg Vorbis' ||
                file.format === '128Kbps MP3'
            );
            
            if (audioFiles.length === 0) {
                alert('No playable audio files found in this item.');
                return;
            }
            
            // Use the first audio file
            const audioFile = audioFiles[0];
            const audioUrl = `https://archive.org/download/${identifier}/${audioFile.name}`;
            
            this.playlist.push({
                title: title,
                artist: artist,
                url: audioUrl
            });
            
            this.renderPlaylist();
            this.createParticles('⭐');
            alert('✅ Track added to playlist!');
            
        } catch (error) {
            console.error('Load error:', error);
            alert('⚠️ Failed to load track from archive.');
        }
    }

    addCustomTrack() {
        const url = document.getElementById('trackUrl').value;
        const name = document.getElementById('trackName').value;
        const artist = document.getElementById('trackArtist').value;
        
        if (!url || !name) {
            alert('Please fill in at least URL and track name!');
            return;
        }
        
        this.playlist.push({
            title: name,
            artist: artist || 'Unknown Artist',
            url: url
        });
        
        this.renderPlaylist();
        this.hideAddTrackModal();
        this.createParticles('🎵');
        
        // Clear form
        document.getElementById('trackUrl').value = '';
        document.getElementById('trackName').value = '';
        document.getElementById('trackArtist').value = '';
    }

    activatePowerUp(type) {
        const effects = {
            mushroom: () => {
                this.audioPlayer.playbackRate = 1.5;
                setTimeout(() => this.audioPlayer.playbackRate = 1.0, 5000);
                this.createParticles('🍄', 20);
            },
            star: () => {
                this.audioPlayer.volume = Math.min(this.audioPlayer.volume + 0.2, 1.0);
                this.createParticles('⭐', 30);
            },
            flower: () => {
                this.nextTrack();
                this.createParticles('🌸', 25);
            }
        };
        
        if (effects[type]) {
            effects[type]();
        }
    }

    createParticles(emoji, count = 10) {
        const container = document.getElementById('particlesContainer');
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emoji;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.fontSize = (Math.random() * 20 + 20) + 'px';
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }
    }

    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowRight':
                this.nextTrack();
                break;
            case 'ArrowLeft':
                this.previousTrack();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const currentVolume = parseInt(document.getElementById('volumeSlider').value);
                this.setVolume(Math.min(currentVolume + 10, 100));
                document.getElementById('volumeSlider').value = Math.min(currentVolume + 10, 100);
                break;
            case 'ArrowDown':
                e.preventDefault();
                const volume = parseInt(document.getElementById('volumeSlider').value);
                this.setVolume(Math.max(volume - 10, 0));
                document.getElementById('volumeSlider').value = Math.max(volume - 10, 0);
                break;
        }
    }
}

// Initialize the jukebox when page loads
let jukebox;
window.addEventListener('DOMContentLoaded', () => {
    jukebox = new MarioJukebox();
});
