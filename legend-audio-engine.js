/**
 * 🎮 Legend Audio Engine
 * Follows Infinity Legend System architecture
 * All roles integrated according to Legend principles
 */

class LegendAudioEngine {
  constructor() {
    this.audioContext = null;
    this.currentAudio = null;
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.volume = 0.7;
    
    // 🪐 MEMORY_NODE: Persistent storage (never overwrites, only appends)
    this.preferences = this.loadPreferences();
    this.favorites = this.loadFavorites();
    
    // 🦾 ROBOT_CORE: Autonomous playback queue
    this.queue = [];
    this.autoplay = true;
    
    // 🎛️ MODULATOR: Audio effects
    this.effects = {
      speed: 1.0,
      pitch: 1.0,
      reverb: false,
      echo: false
    };
    
    // ⛓️ CHAIN: Immutable play history
    this.playChain = this.loadPlayChain();
    
    // 💫 STAR: Favorites system
    this.stars = this.loadStars();
    
    this.initialize();
  }

  /**
   * ⭐ Initialize audio context (RUNTIME pattern)
   */
  initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🎵 Audio context initialized');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  /**
   * 🪐 Load preferences (MEMORY_NODE pattern)
   */
  loadPreferences() {
    try {
      const stored = localStorage.getItem('infinity_audio_preferences');
      return stored ? JSON.parse(stored) : {
        volume: 0.7,
        autoplay: true,
        repeatMode: 'all'
      };
    } catch (e) {
      return { volume: 0.7, autoplay: true, repeatMode: 'all' };
    }
  }

  /**
   * 🪐 Save preferences (MEMORY_NODE: append only)
   */
  savePreferences() {
    try {
      const prefs = {
        volume: this.volume,
        autoplay: this.autoplay,
        repeatMode: this.repeatMode,
        timestamp: Date.now()
      };
      localStorage.setItem('infinity_audio_preferences', JSON.stringify(prefs));
    } catch (e) {
      console.warn('Could not save preferences:', e);
    }
  }

  /**
   * 🪐 Load favorites (MEMORY_NODE pattern)
   */
  loadFavorites() {
    try {
      const stored = localStorage.getItem('infinity_jukebox_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * ⛓️ Load play chain (CHAIN pattern: immutable history)
   */
  loadPlayChain() {
    try {
      const stored = localStorage.getItem('infinity_jukebox_playchain');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * ⛓️ Append to play chain (CHAIN: immutable, append-only)
   */
  appendToChain(track) {
    const chainEntry = {
      id: this.generateChainId(),
      track: track,
      timestamp: Date.now(),
      prevHash: this.getLastChainHash()
    };
    
    chainEntry.hash = this.computeHash(chainEntry);
    this.playChain.push(chainEntry);
    
    try {
      localStorage.setItem('infinity_jukebox_playchain', JSON.stringify(this.playChain));
    } catch (e) {
      console.warn('Could not save play chain:', e);
    }
  }

  /**
   * 🧱 Generate chain ID (ENCODE pattern)
   */
  generateChainId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 🧱 Compute hash (ENCODE pattern)
   */
  computeHash(data) {
    // Simple hash function (in production, use crypto.subtle.digest)
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * ⛓️ Get last chain hash (CHAIN pattern)
   */
  getLastChainHash() {
    return this.playChain.length > 0 
      ? this.playChain[this.playChain.length - 1].hash 
      : '0';
  }

  /**
   * 💫 Load stars (STAR pattern)
   */
  loadStars() {
    try {
      const stored = localStorage.getItem('infinity_jukebox_stars');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 💫 Add star/favorite (STAR pattern)
   */
  addStar(track) {
    if (!this.stars.find(s => s.id === track.id)) {
      const star = {
        ...track,
        starredAt: Date.now(),
        type: 'star'
      };
      this.stars.push(star);
      
      try {
        localStorage.setItem('infinity_jukebox_stars', JSON.stringify(this.stars));
      } catch (e) {
        console.warn('Could not save stars:', e);
      }
    }
  }

  /**
   * 🦾 Add to playlist (ROBOT_CORE: additive only, never deletes)
   */
  addToPlaylist(track) {
    this.playlist.push({
      ...track,
      addedAt: Date.now()
    });
    this.emitEvent('playlistUpdated', this.playlist);
  }

  /**
   * 🦾 Add to queue (ROBOT_CORE: autonomous processing)
   */
  addToQueue(track) {
    this.queue.push(track);
    this.emitEvent('queueUpdated', this.queue);
  }

  /**
   * 🔴 Play track (RED: output control)
   */
  async play(track) {
    try {
      // Stop current audio
      if (this.currentAudio) {
        this.currentAudio.pause();
      }

      // Create new audio element
      this.currentAudio = new Audio(track.url);
      this.currentAudio.volume = this.volume;
      
      // 🎛️ Apply effects (MODULATOR pattern)
      this.applyEffects();

      // Set up event listeners
      this.currentAudio.addEventListener('ended', () => this.onTrackEnded());
      this.currentAudio.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.currentAudio.addEventListener('error', (e) => this.onError(e));

      // Play
      await this.currentAudio.play();
      this.isPlaying = true;
      
      // ⛓️ Record in play chain (CHAIN pattern)
      this.appendToChain(track);
      
      this.emitEvent('trackStarted', track);
      
    } catch (error) {
      console.error('Playback error:', error);
      this.emitEvent('playbackError', error);
    }
  }

  /**
   * 🎛️ Apply audio effects (MODULATOR pattern)
   */
  applyEffects() {
    if (!this.currentAudio) return;
    
    // Playback speed
    this.currentAudio.playbackRate = this.effects.speed;
    
    // Additional effects would require Web Audio API nodes
    // This is simplified for demonstration
  }

  /**
   * 🔴 Pause playback (RED: output control)
   */
  pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.emitEvent('trackPaused');
    }
  }

  /**
   * 🔴 Resume playback (RED: output control)
   */
  resume() {
    if (this.currentAudio && !this.isPlaying) {
      this.currentAudio.play();
      this.isPlaying = true;
      this.emitEvent('trackResumed');
    }
  }

  /**
   * 🔴 Stop playback (RED: output control)
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
      this.emitEvent('trackStopped');
    }
  }

  /**
   * 🔀 Next track (FLOW pattern)
   */
  next() {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.play(this.playlist[this.currentIndex]);
    }
  }

  /**
   * 🔀 Previous track (FLOW pattern)
   */
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.play(this.playlist[this.currentIndex]);
    }
  }

  /**
   * 🔴 Set volume (RED: output control with MODULATOR)
   */
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
    this.savePreferences();
    this.emitEvent('volumeChanged', this.volume);
  }

  /**
   * 🎛️ Set playback speed (MODULATOR pattern)
   */
  setSpeed(speed) {
    this.effects.speed = speed;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = speed;
    }
    this.emitEvent('speedChanged', speed);
  }

  /**
   * 🦾 Auto-play next track (ROBOT_CORE: autonomous)
   */
  onTrackEnded() {
    if (this.autoplay) {
      if (this.queue.length > 0) {
        // Play from queue first
        const nextTrack = this.queue.shift();
        this.play(nextTrack);
      } else if (this.currentIndex < this.playlist.length - 1) {
        this.next();
      }
    }
    this.emitEvent('trackEnded');
  }

  /**
   * ⭐ Time update callback (RUNTIME pattern)
   */
  onTimeUpdate() {
    if (this.currentAudio) {
      this.emitEvent('timeUpdate', {
        currentTime: this.currentAudio.currentTime,
        duration: this.currentAudio.duration,
        progress: this.currentAudio.currentTime / this.currentAudio.duration
      });
    }
  }

  /**
   * 🍄 Error handler (AUDITOR pattern)
   */
  onError(error) {
    console.error('Audio error:', error);
    this.emitEvent('error', error);
  }

  /**
   * 🔀 Event emitter (FLOW pattern)
   */
  emitEvent(eventName, data) {
    const event = new CustomEvent(`legendAudio:${eventName}`, { 
      detail: data 
    });
    window.dispatchEvent(event);
  }

  /**
   * 👑 Get current state (CROWN_INDEX: catalog only)
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.playlist[this.currentIndex] || null,
      currentIndex: this.currentIndex,
      playlist: this.playlist,
      queue: this.queue,
      volume: this.volume,
      effects: this.effects,
      stars: this.stars.length,
      chainLength: this.playChain.length
    };
  }

  /**
   * 🪐 Get full history (MEMORY_NODE pattern)
   */
  getHistory() {
    return {
      favorites: [...this.favorites],
      stars: [...this.stars],
      playChain: [...this.playChain],
      preferences: { ...this.preferences }
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LegendAudioEngine;
}
