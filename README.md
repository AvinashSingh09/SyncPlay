# SyncPlay

A real-time music player with a public display and mobile controller.

## Features
- **Public Player Screen**: Optimized for TV/Kiosk.
- **Mobile Controller**: Scan QR code to control the queue.
- **Real-time Sync**: WebSockets ensure instant updates.
- **Audio Visualizer**: Beautiful frequency bars.
- **iTunes Album Art**: Auto-fetches cover art.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Songs**
   - Place MP3 files in `public/audio/`
   - Update `songs.json`

3. **Run**
   ```bash
   npm run dev
   ```
   - Player: `http://localhost:5173`
   - Controller: Scan QR on Player screen
