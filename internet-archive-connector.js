/**
 * 🍄 Internet Archive Connector
 * Connects to Internet Archive for audio resources
 * Following Legend principles: WEAVER role (never cuts, only adds)
 */

class InternetArchiveConnector {
  constructor() {
    this.baseUrl = 'https://archive.org';
    this.audioCache = new Map();
    this.metadataCache = new Map();
    
    // 🪐 MEMORY_NODE: Store history (never overwrite, only append)
    this.playHistory = this.loadHistory();
    this.sources = this.loadSources();
  }

  /**
   * 🪐 Load play history from localStorage (MEMORY_NODE pattern)
   */
  loadHistory() {
    try {
      const stored = localStorage.getItem('infinity_jukebox_history');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Could not load history:', e);
      return [];
    }
  }

  /**
   * 🪐 Append to history (never overwrites, only appends)
   */
  appendHistory(entry) {
    this.playHistory.push({
      ...entry,
      timestamp: Date.now(),
      id: this.generateId()
    });
    try {
      localStorage.setItem('infinity_jukebox_history', JSON.stringify(this.playHistory));
    } catch (e) {
      console.warn('Could not save history:', e);
    }
  }

  /**
   * 🪐 Load sources catalog (MEMORY_NODE pattern)
   */
  loadSources() {
    try {
      const stored = localStorage.getItem('infinity_jukebox_sources');
      return stored ? JSON.parse(stored) : this.getDefaultSources();
    } catch (e) {
      return this.getDefaultSources();
    }
  }

  /**
   * 👑 Default audio sources catalog (CROWN_INDEX pattern: only references)
   */
  getDefaultSources() {
    return [
      {
        id: 'mario-bros-1',
        title: 'Super Mario Bros. 1, 2, VS',
        collection: 'super-mario-bros-ost-sfx',
        file: '(01-41)+Super+Mario+Bros.+1%2C2%2CVS.wav',
        emoji: '🍄',
        type: 'ost'
      },
      {
        id: 'mario-overworld',
        title: 'Super Mario Bros. - Overworld Theme',
        collection: 'super-mario-bros-ost-sfx',
        file: 'overworld.mp3',
        emoji: '🎮',
        type: 'theme'
      },
      {
        id: 'mario-underground',
        title: 'Super Mario Bros. - Underground Theme',
        collection: 'super-mario-bros-ost-sfx',
        file: 'underground.mp3',
        emoji: '🔧',
        type: 'theme'
      },
      {
        id: 'mario-castle',
        title: 'Super Mario Bros. - Castle Theme',
        collection: 'super-mario-bros-ost-sfx',
        file: 'castle.mp3',
        emoji: '🏰',
        type: 'theme'
      },
      {
        id: 'mario-underwater',
        title: 'Super Mario Bros. - Underwater Theme',
        collection: 'super-mario-bros-ost-sfx',
        file: 'underwater.mp3',
        emoji: '🌊',
        type: 'theme'
      }
    ];
  }

  /**
   * 🧱 Generate hash-based ID (ENCODE pattern)
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 🪡 Build URL for Internet Archive audio (WEAVER pattern: connects sources)
   */
  buildAudioUrl(source) {
    return `${this.baseUrl}/download/${source.collection}/${source.file}`;
  }

  /**
   * 🪡 Build metadata URL (WEAVER pattern)
   */
  buildMetadataUrl(collection) {
    return `${this.baseUrl}/metadata/${collection}`;
  }

  /**
   * 🍄 Validate audio source (AUDITOR pattern)
   */
  async validateSource(source) {
    try {
      const url = this.buildAudioUrl(source);
      const response = await fetch(url, { method: 'HEAD' });
      return {
        valid: response.ok,
        status: response.status,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * 🪡 Fetch metadata from Internet Archive (WEAVER pattern)
   */
  async fetchMetadata(collection) {
    if (this.metadataCache.has(collection)) {
      return this.metadataCache.get(collection);
    }

    try {
      const url = this.buildMetadataUrl(collection);
      const response = await fetch(url);
      const metadata = await response.json();
      
      // 🪐 Cache metadata (MEMORY_NODE pattern)
      this.metadataCache.set(collection, metadata);
      
      return metadata;
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      return null;
    }
  }

  /**
   * 👑 Get all available sources (CROWN_INDEX: catalog only)
   */
  getAllSources() {
    return this.sources;
  }

  /**
   * 🔗 Find similar tracks (SEMANTIC pattern)
   */
  findSimilar(source) {
    return this.sources.filter(s => 
      s.type === source.type && s.id !== source.id
    );
  }

  /**
   * 🪐 Get play history (MEMORY_NODE pattern)
   */
  getHistory() {
    return [...this.playHistory]; // Return copy to prevent mutation
  }

  /**
   * 🪡 Add new source to catalog (WEAVER pattern: additive only)
   */
  addSource(source) {
    const newSource = {
      ...source,
      id: source.id || this.generateId(),
      addedAt: Date.now()
    };
    
    this.sources.push(newSource);
    
    try {
      localStorage.setItem('infinity_jukebox_sources', JSON.stringify(this.sources));
    } catch (e) {
      console.warn('Could not save sources:', e);
    }
    
    return newSource;
  }

  /**
   * 🔀 Search Internet Archive (FLOW pattern)
   */
  async searchArchive(query) {
    try {
      const searchUrl = `${this.baseUrl}/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,year&rows=50&page=1&output=json&mediatype=audio`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      return data.response?.docs || [];
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InternetArchiveConnector;
}
