# Mario Bros Jukebox - Documentation

## 🎮 Overview

The Mario Bros Jukebox is an interactive, animated audio player with retro gaming aesthetics. It integrates with Internet Archive for seamless audio collection browsing and features quantum-inspired visualizations.

## 🎵 Features

### Core Features
- **Internet Archive Integration**: Search and import audio from archive.org
- **Interactive UI**: Mario-themed design with animated sprites and backgrounds
- **Audio Visualization**: Real-time quantum-inspired visualizations
- **Playlist Management**: Add, remove, and organize tracks
- **Responsive Controls**: Play, pause, skip, volume, shuffle, repeat
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Power-ups**: Interactive Mario power-ups with special effects
- **Particle Effects**: Animated emoji particles for visual feedback
- **Mobile Responsive**: Works beautifully on all screen sizes

### Design Elements
- Retro gaming aesthetic with modern CSS animations
- Parallax scrolling background (clouds, hills, ground)
- Animated Mario sprite that reacts to music
- Cool color scheme: blues (#5a67d8), purples (#7e22ce), gold (#ffd700)
- Smooth transitions and hover effects
- Emoji integration: 🎵🍄⭐🎮🌸🪙

## 🚀 Getting Started

### Installation

1. Copy the jukebox files to your `public` directory:
   - `mario-jukebox.html`
   - `css/mario-jukebox.css`
   - `js/mario-jukebox.js`

2. Open `mario-jukebox.html` in your browser

3. Start enjoying Mario Bros music! 🎮

### Quick Start

1. **Play Music**: Click the play button (▶️) or press spacebar
2. **Navigate**: Use ⏮️ and ⏭️ buttons or arrow keys
3. **Search**: Click "📚 Internet Archive" to search for more tracks
4. **Add Custom**: Click "➕ Add Track" to add your own audio URLs

## 🎼 Adding Audio Sources

### Method 1: Internet Archive Search

1. Click the "📚 Internet Archive" button
2. Enter search terms (e.g., "Super Mario Bros", "Nintendo Music")
3. Browse results and click "➕ Add to Playlist"
4. The track will be automatically added with metadata

**Quick Links Available:**
- Super Mario Bros OST
- Nintendo Music
- Video Game Music
- 8-bit Chiptune

### Method 2: Custom URL

1. Click the "➕ Add Track" button
2. Enter the audio URL (must be a direct link to MP3, WAV, OGG, etc.)
3. Enter track name and artist
4. Click "Add to Playlist"

**Supported Formats:**
- MP3 (including VBR)
- WAV
- OGG Vorbis
- M4A
- FLAC (in supported browsers)

### Method 3: Default Playlist Modification

Edit `js/mario-jukebox.js` and modify the `setupDefaultPlaylist()` method:

```javascript
setupDefaultPlaylist() {
    this.playlist = [
        {
            title: 'Your Track Title',
            artist: 'Artist Name',
            url: 'https://example.com/your-audio.mp3'
        },
        // Add more tracks here...
    ];
}
```

## 🎹 Controls

### Mouse Controls
- **Play/Pause**: Click main button
- **Skip**: Click ⏭️ (next) or ⏮️ (previous)
- **Volume**: Drag volume slider
- **Seek**: Click anywhere on progress bar
- **Shuffle**: Click 🔀
- **Repeat**: Click 🔁
- **Power-ups**: Click 🍄⭐🌸 for special effects

### Keyboard Controls
- **Space**: Play/Pause
- **→ Arrow**: Next track
- **← Arrow**: Previous track
- **↑ Arrow**: Volume up
- **↓ Arrow**: Volume down

## 🍄 Power-ups

Click on power-ups for special effects:

- **🍄 Mushroom**: Speed boost (1.5x playback speed for 5 seconds)
- **⭐ Star**: Volume boost (+20% volume)
- **🌸 Flower**: Skip to next track with particle effect

## 🎨 Customization

### Colors

Modify colors in `css/mario-jukebox.css`:

```css
/* Main gradient */
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 30%, #5a67d8 60%, #7e22ce 100%);

/* Gold accent */
color: #ffd700;

/* Button gradients */
background: linear-gradient(135deg, #5a67d8 0%, #7e22ce 100%);
```

### Animations

Adjust animation speeds:

```css
@keyframes cloudsFloat {
    /* Modify duration: 60s -> 30s for faster clouds */
}

@keyframes marioJump {
    /* Adjust timing for Mario sprite animation */
}
```

### Visualizer

Customize the audio visualizer in `js/mario-jukebox.js`:

```javascript
// Change bar colors
const r = barHeight + (25 * (i / this.dataArray.length));
const g = 100;  // Modify for different colors
const b = 250 - (barHeight / 2);

// Adjust FFT size for more/fewer bars
this.analyser.fftSize = 256;  // Try 128, 512, 1024
```

## 🔧 Advanced Features

### Audio Context

The jukebox uses Web Audio API for:
- Real-time visualization
- Audio analysis
- Enhanced audio processing

### Dynamic Playlist

Playlists are stored in memory and can be:
- Saved to localStorage (implement in JavaScript)
- Exported as JSON
- Shared via URL parameters

### Search Integration

Internet Archive search uses:
- Advanced Search API
- JSON format
- Audio mediatype filter
- Automatic metadata extraction

## 📱 Mobile Optimization

The jukebox is fully responsive:
- Stacks elements vertically on mobile
- Hides Mario sprite on small screens
- Touch-friendly buttons
- Swipe gestures (can be implemented)

## 🐛 Troubleshooting

### Audio Won't Play
- Check CORS policy on audio URLs
- Ensure URL is direct link to audio file
- Try different audio format

### Visualizer Not Working
- Some browsers require user interaction first
- Check browser console for errors
- Web Audio API must be supported

### Search Not Working
- Check internet connection
- Archive.org may have rate limits
- Try different search terms

## 🌟 Future Enhancements

Potential additions:
- Playlist save/load to localStorage
- Lyrics display
- Equalizer controls
- Social sharing
- Themes/skins
- More power-up effects
- Gesture controls
- PWA capabilities
- Offline playback

## 📚 Resources

### Internet Archive Resources
- Super Mario Bros Collection: https://archive.org/details/super-mario-bros-ost-sfx
- Video Game Music: https://archive.org/details/videogamemusic
- Chiptune Collection: https://archive.org/details/chiptune

### Audio Formats
- MP3: Universal support
- WAV: High quality, larger files
- OGG: Good compression, wide support
- FLAC: Lossless, limited browser support

## 🎮 Credits

Design inspired by:
- Super Mario Bros (Nintendo)
- Retro gaming aesthetics
- Modern web audio capabilities
- Internet Archive open collections

## 📝 License

This jukebox is part of the smug_look/Infinity Portal ecosystem.
Feel free to customize and extend for your projects!

---

**Have fun playing music the Mario way! 🍄⭐🎵**
