# SPEC-1-Remote Queue Music Player

## Background

This project aims to create a **Spotify-inspired web-based music player** designed for kiosk or large-screen use, where a **public-facing player** can be remotely controlled in real time via a **mobile controller accessed through a QR code**.

The motivation is to support **small, curated queues (15–20 songs max)** with a strong emphasis on:
- Instant feedback (no reloads)
- Simple, distraction-free UI
- Shared control in social or public environments (events, offices, lounges)

The system deliberately avoids full playlist management, album art, or user accounts to remain lightweight and focused on realtime interaction.

---

## Requirements

### Must Have
- Public player screen with dark, Spotify-like minimal UI
- Vertical song queue list (title + artist only)
- Active song highlighted with optional animated indicator
- Playback controls (play/pause, next, previous, progress)
- QR code linking to `/controller`
- Mobile controller with:
  - Same list UI
  - Drag-and-drop reordering
  - Local preview before submit
  - Explicit **Submit Queue** action
- Realtime synchronization using WebSockets:
  - `queue:update`
  - `song:change`
  - `player:state`
- Index-based playback with wraparound behavior
- Max 20 songs enforced

### Should Have
- Smooth transitions and hover animations
- Toast or subtle feedback on queue update
- Controller reflects currently playing song index

### Could Have
- Animated equalizer bar on active song
- Fade transitions between tracks
- Mobile drag vibration feedback

### Won’t Have
- Album art
- User accounts or authentication
- Playlist creation or persistence
- Spotify branding or API usage

---

*Awaiting confirmation before proceeding to Method (architecture & realtime design).*

