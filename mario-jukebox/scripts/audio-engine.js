/**
 * 🦾 Audio Engine - ROBOT_CORE + RUNTIME
 * Autonomous playback engine with real-time streaming
 */

class AudioEngine {
    constructor() {
        this.audio = null;
        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.volume = 0.7;
        this.currentEffect = 'none';
        this.audioContext = null;
        this.sourceNode = null;
        this.gainNode = null;
        this.init();
    }

    init() {
        this.audio = document.getElementById('main-audio');
        if (!this.audio) {
            console.error('Audio element not found');
            return;
        }

        // Set up audio context for effects (NOTE: Effects not fully implemented in MVP)
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }

        // Set up event listeners
        this.setupControls();
        this.setupAudioEvents();

        console.log('🦾 Audio Engine initialized (ROBOT_CORE)');
    }

    setupControls() {
        // Play button
        const playBtn = document.getElementById('btn-play');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.play());
        }

        // Pause button
        const pauseBtn = document.getElementById('btn-pause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }

        // Stop button
        const stopBtn = document.getElementById('btn-stop');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stop());
        }

        // Previous button
        const prevBtn = document.getElementById('btn-previous');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previous());
        }

        // Next button
        const nextBtn = document.getElementById('btn-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        // Volume slider
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        // Progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.addEventListener('input', (e) => {
                const time = (e.target.value / 100) * this.audio.duration;
                this.seek(time);
            });
        }

        // Effect buttons
        const effectBtns = document.querySelectorAll('.effect-btn');
        effectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const effect = btn.getAttribute('data-effect');
                this.applyEffect(effect);
            });
        });
    }

    setupAudioEvents() {
        if (!this.audio) return;

        // Update progress bar
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // Handle track end
        this.audio.addEventListener('ended', () => {
            this.onTrackEnd();
        });

        // Handle metadata loaded
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        // Handle errors
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.onError(e);
        });
    }

    loadTrack(track) {
        if (!track || !track.url) {
            console.error('Invalid track:', track);
            return;
        }

        this.audio.src = track.url;
        this.updateNowPlaying(track);
        
        console.log('🎵 Track loaded:', track.title);
    }

    play() {
        if (!this.audio.src) {
            // Load first track if none loaded
            if (this.playlist.length > 0) {
                this.currentTrackIndex = 0;
                this.loadTrack(this.playlist[0]);
            } else {
                console.warn('No tracks in playlist');
                return;
            }
        }

        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayPauseButtons();
            this.addToHistory(this.getCurrentTrack());
            console.log('▶️ Playing');
        }).catch(err => {
            console.error('Play error:', err);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButtons();
        console.log('⏸️ Paused');
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayPauseButtons();
        console.log('⏹️ Stopped');
    }

    next() {
        if (this.playlist.length === 0) return;
        
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.playlist[this.currentTrackIndex]);
        
        if (this.isPlaying) {
            this.play();
        }
        
        console.log('⏭️ Next track');
    }

    previous() {
        if (this.playlist.length === 0) return;
        
        this.currentTrackIndex = this.currentTrackIndex - 1;
        if (this.currentTrackIndex < 0) {
            this.currentTrackIndex = this.playlist.length - 1;
        }
        
        this.loadTrack(this.playlist[this.currentTrackIndex]);
        
        if (this.isPlaying) {
            this.play();
        }
        
        console.log('⏮️ Previous track');
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
        
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = Math.round(this.volume * 100) + '%';
        }
        
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
    }

    seek(time) {
        if (this.audio && !isNaN(this.audio.duration)) {
            this.audio.currentTime = time;
        }
    }

    applyEffect(effect) {
        this.currentEffect = effect;
        console.log('🎛️ Effect applied:', effect, '(Note: Full Web Audio API implementation coming in future update)');
        
        // Update effect button states
        const effectBtns = document.querySelectorAll('.effect-btn');
        effectBtns.forEach(btn => {
            if (btn.getAttribute('data-effect') === effect) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // TODO: Implement actual audio effects using Web Audio API
        // This is a placeholder for MVP - effects buttons show UI but don't apply filters yet
    }

    updateProgress() {
        if (!this.audio || isNaN(this.audio.duration)) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.value = progress;
        }
        
        // Update time display
        const currentTimeEl = document.getElementById('current-time');
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        if (!this.audio || isNaN(this.audio.duration)) return;
        
        const durationEl = document.getElementById('duration');
        if (durationEl) {
            durationEl.textContent = this.formatTime(this.audio.duration);
        }
    }

    updateNowPlaying(track) {
        const titleEl = document.getElementById('track-title');
        const artistEl = document.getElementById('track-artist');
        const collectionEl = document.getElementById('track-collection');
        
        if (titleEl) titleEl.textContent = track.title || 'Unknown Track';
        if (artistEl) artistEl.textContent = track.artist || 'Internet Archive';
        if (collectionEl) collectionEl.textContent = `Collection: ${track.collection || 'Unknown'}`;
        
        // Update album art if available
        const albumArt = document.getElementById('album-art');
        if (albumArt && track.thumbnail) {
            albumArt.innerHTML = `<img src="${track.thumbnail}" alt="${track.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`;
        }
    }

    updatePlayPauseButtons() {
        const playBtn = document.getElementById('btn-play');
        const pauseBtn = document.getElementById('btn-pause');
        
        if (this.isPlaying) {
            if (playBtn) playBtn.classList.add('hidden');
            if (pauseBtn) pauseBtn.classList.remove('hidden');
        } else {
            if (playBtn) playBtn.classList.remove('hidden');
            if (pauseBtn) pauseBtn.classList.add('hidden');
        }
    }

    onTrackEnd() {
        console.log('Track ended');
        // Auto-play next track
        this.next();
    }

    onError(error) {
        console.error('Playback error:', error);
        // Try next track on error
        if (this.playlist.length > 1) {
            this.next();
        }
    }

    addToHistory(track) {
        if (window.memoryNode) {
            window.memoryNode.addToHistory(track);
        }
    }

    getCurrentTrack() {
        return this.playlist[this.currentTrackIndex] || null;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setPlaylist(tracks) {
        this.playlist = tracks;
        this.currentTrackIndex = -1;
        console.log(`📋 Playlist set: ${tracks.length} tracks`);
    }

    addToPlaylist(track) {
        this.playlist.push(track);
        console.log(`➕ Track added to playlist: ${track.title}`);
    }

    clearPlaylist() {
        this.playlist = [];
        this.currentTrackIndex = -1;
        this.stop();
        console.log('🗑️ Playlist cleared');
    }
}

// Initialize audio engine when DOM is loaded
let audioEngine;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        audioEngine = new AudioEngine();
        window.audioEngine = audioEngine;
    });
} else {
    audioEngine = new AudioEngine();
    window.audioEngine = audioEngine;
}
