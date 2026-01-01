# 🍄🎮 Mario Bros Jukebox - Infinity Legend System Integration

An interactive, animated Mario-themed jukebox that integrates **ALL pewpi-infinity repositories** according to the Infinity Legend System architecture.

## 🌟 Features

### 👑 CROWN_INDEX Integration (legend-core)
- Main jukebox acts as central catalog of all audio sources
- Links to all legend-* repos using meta tags
- Maintains authoritative index of available sounds/music
- **Never executes**, only references and catalogs

### 🦾 ROBOT_CORE Integration (legend-🦾-robot-core)
- Autonomous audio playback engine
- Processes playlist automation
- Executes play/pause/skip commands
- **Additive only** - no deletion of playlists

### 🪐 MEMORY_NODE Integration (legend-🪐-memory)
- Persistent storage of:
  - User preferences
  - Play history
  - Custom playlists
  - Favorite tracks
- **Never overwrites**, only appends

### ⭐ RUNTIME Integration (legend-⭐-runtime)
- Real-time audio stream management
- Dynamic loading of audio resources
- Runtime state management
- Web Audio API integration

### 🕹️ CONTROLLER Integration (legend-🕹️-mario-exit)
- Mario-themed playback controls
- Interactive game-like interface
- Power-up activated features
- Coin collection system for unlocks

### 🧱 ENCODE Integration (legend-🧱-encode)
- Audio format conversion
- Metadata encoding
- Token generation for tracks
- Hash-based track identification

### 👁️ TOKEN_VIEWER Integration (legend-👁️-token-viewer)
- Visual display of track tokens
- Semantic meaning display
- Emoji-based track representation
- Real-time token monitoring

### 🎵 SYNC Integration (legend-🎵-sync)
- Multi-repo audio synchronization
- Cross-system playlist sharing
- Beat detection and sync
- Visual sync with animations

### 🪡 WEAVER Integration (legend-🪡-assembler)
- Connects audio from multiple sources
- Weaves Internet Archive content into system
- Threads new tracks into existing collections
- **Never cuts**, only adds

### 🔀 FLOW Integration (legend-🔀-flow)
- Routes audio streams appropriately
- Manages playback queue flow
- Dynamic routing based on user interaction

### 🔗 SEMANTIC Integration (legend-🔗-semantic)
- Track relationship mapping
- Genre and mood connections
- Similar track discovery
- Semantic search functionality

### 🍄 AUDITOR Integration (legend-🍄-auditor)
- Quality checking of audio files
- Validates Internet Archive sources
- Ensures playback integrity
- Monitors system health

### 🎛️ MODULATOR Integration (legend-🎛️-modulator)
- Audio effect controls (volume, eq, filters)
- Real-time audio modulation
- Power-up sound effects
- Mario-style audio transformations

### 💫 STAR Integration (legend-💫-star)
- "Star" favorite system
- Power star collection mechanic
- Special unlockable content
- Achievement system

### ✨ MULTISTAR Integration (legend-✨-multistar)
- Multi-user favorites
- Shared star collections
- Community playlists
- Collaborative curation

### ⛓️ CHAIN Integration (legend-⛓️-chain)
- Blockchain-inspired track linking
- Immutable play history
- Provenance tracking
- Token chain visualization

### 🔀 SPINE-INDEX Integration (legend-spine-index)
- Central backbone routing
- Main navigation structure
- Structural support for all modules
- Core routing hub

## 🎨 Legend Color System

The jukebox follows the Infinity Legend color system:

- 🟩 **GREEN** (#10B981) - Input controls (import, record)
- 🟧 **ORANGE** (#F97316) - Processing indicators (loading, buffering)
- 🟦 **BLUE** (#3B82F6) - Logic controls (playlist, settings)
- 🟥 **RED** (#EF4444) - Output controls (play, volume, emit)
- 🟪 **PURPLE** (#A855F7) - Memory displays (history, saved)
- 🟨 **YELLOW** (#EAB308) - Navigation (links, bridges)
- 💗 **PINK** (#EC4899) - Core vitals (health, system status)

## 🎮 Interactive Features

### Mario Game Mechanics
- **Jump on buttons** to play tracks
- **Collect coins** (🪙) for unlocking content
- **Power-ups** affect playback (speed, pitch, effects)
- **Warp pipes** as navigation shortcuts
- **Question blocks** (❓) reveal random tracks

### Animations
- Parallax scrolling backgrounds
- Animated sprites and particle effects
- Music-reactive visualizations
- Interactive button animations
- Canvas-based particle system

## 🌐 Internet Archive Integration

**Primary Audio Source:**
- Internet Archive - Super Mario Bros OST
- URL: `https://archive.org/details/super-mario-bros-ost-sfx`

**Default Tracks:**
1. 🍄 Super Mario Bros. 1, 2, VS (Full OST)
2. 🎮 Overworld Theme
3. 🔧 Underground Theme
4. 🏰 Castle Theme
5. 🌊 Underwater Theme

## 📁 File Structure

```
mario-jukebox.html          # Main jukebox interface
legend-audio-engine.js      # Audio system following Legend architecture
internet-archive-connector.js # Internet Archive API integration
mario-animations.js         # Game-like animations
mario-styles.css           # Mario-themed styling with Legend colors
legend-meta.json           # Legend role declarations
repo-integration.json      # Repository integration map
```

## 🚀 Quick Start

1. **Open the jukebox:**
   ```
   http://localhost:3000/mario-jukebox.html
   ```

2. **Load Mario music:**
   - Click "🍄 LOAD MARIO OST" button
   - 5 tracks will be added to playlist

3. **Play music:**
   - Click ▶️ next to any track
   - Or use the main "▶️ PLAY" button

4. **Interact:**
   - Click ❓ question blocks for rewards
   - Use 🌊 warp pipe for random track
   - Collect 🪙 coins and ⭐ stars

## 🎛️ Controls

### 🔴 Play Controls (Output)
- ▶️ PLAY - Start playback
- ⏸️ PAUSE - Pause playback
- ⏹️ STOP - Stop and reset
- ⏮️ PREVIOUS - Previous track
- ⏭️ NEXT - Next track
- 🔊 Volume slider

### 🟩 Import Controls (Input)
- 🍄 LOAD MARIO OST - Load default tracks
- 🔍 SEARCH ARCHIVE - Search Internet Archive
- 🔗 CUSTOM URL - Add custom audio URL

### 🟦 Playlist Controls (Logic)
- 🔀 SHUFFLE - Randomize playlist
- 🔁 REPEAT ALL - Loop playlist
- 🗑️ CLEAR QUEUE - Clear play queue
- 💾 SAVE PLAYLIST - Save to memory

### 🎛️ Effects (Modulator)
- Speed control (0.5x - 2.0x)
- ⚡ POWER UP! - Temporary speed boost

## 🪐 Memory & Storage

All data is stored locally using **localStorage**:

- **Preferences:** Volume, autoplay, repeat mode
- **Favorites:** Starred tracks
- **Play History:** All played tracks
- **Play Chain:** Immutable blockchain-like history
- **Coins & Stars:** Collected items

## 🔗 Linked Repositories

The jukebox links to all pewpi-infinity repositories:

- [smug_look](https://github.com/pewpi-infinity/smug_look) - Main repo (CROWN_INDEX)
- [infinity-portal](https://github.com/pewpi-infinity/infinity-portal) - Portal system
- [Design-Depo](https://github.com/pewpi-infinity/Design-Depo) - Design patterns
- [GPT-Vector-Design](https://github.com/pewpi-infinity/GPT-Vector-Design) - Vector graphics
- [mongoose.os](https://github.com/pewpi-infinity/mongoose.os) - Scripting
- [rooster.os](https://github.com/pewpi-infinity/rooster.os) - Automation
- [Gutenberg](https://github.com/pewpi-infinity/Gutenberg) - Content system
- [Osprey-Terminal](https://github.com/pewpi-infinity/Osprey-Terminal) - Terminal UI

## 🏗️ Architecture Principles

✅ **ADDITIVE ONLY** - Build on existing code, never destroy  
✅ **DISCOVERABLE** - All features reachable from main index  
✅ **LINKED** - Every component links to other repos  
✅ **IMMUTABLE CORE** - Legend roles preserved  
✅ **SELF-PROPAGATING** - System grows through linking  
✅ **EMOJI-RICH** - Heavy emoji usage throughout  
✅ **INTERACTIVE** - Game-like feel  
✅ **ANIMATED** - Moving, living interface  

## 🎯 Legend Principles

Each integration follows strict Legend principles:

- **CROWN_INDEX**: Catalogs but never executes
- **ROBOT_CORE**: Additive only, never deletes
- **MEMORY_NODE**: Appends only, never overwrites
- **WEAVER**: Adds content, never cuts
- **CHAIN**: Immutable history tracking
- **AUDITOR**: Quality validation only

## 📱 Responsive Design

The jukebox is fully responsive:
- Desktop: Full grid layout
- Tablet: Adaptive columns
- Mobile: Single column, optimized buttons

## 🎨 Browser Support

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (with Web Audio API)
- ✅ Opera: Full support

## 🔮 Future Enhancements

- [ ] More Internet Archive collections
- [ ] Custom playlist sharing
- [ ] Collaborative listening sessions
- [ ] Advanced audio effects
- [ ] 3D visualizations
- [ ] Voice control integration
- [ ] Mobile app version
- [ ] Blockchain token integration

## 🍄 Emoji Signature

**🍄🍄👲🏻🏰🏰👸🏼🍄🐢💗⚡⚡⚡🌟👻🎮🕹️👾**

This represents the full Infinity Legend System integrated into a Mario Bros gaming experience! 🎮✨

## 📄 License

Part of the Infinity Legend System - see repository for details.

## 🤝 Contributing

Follow the Legend principles:
- Make additive changes only
- Preserve all Legend roles
- Link to other repos
- Use emoji-rich documentation
- Follow color system
- Never delete or overwrite

## 📞 Contact

See main [smug_look repository](https://github.com/pewpi-infinity/smug_look) for contact information.

---

**Built with ❤️ following the Infinity Legend System Architecture**
