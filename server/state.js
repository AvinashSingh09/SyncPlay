// In-memory state management for the music player
// This maintains the shared state across all connected clients

import songs from '../songs.json' with { type: 'json' };

const MAX_QUEUE_SIZE = 50;

// Initialize state with all songs in queue
const state = {
    queue: songs.slice(0, MAX_QUEUE_SIZE),
    currentIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0
};

export function getState() {
    return { ...state };
}

export function getQueue() {
    return [...state.queue];
}

export function getSongs() {
    return [...songs];
}

export function getCurrentSong() {
    return state.queue[state.currentIndex] || null;
}

export function setQueue(newQueue) {
    // Enforce max queue size
    state.queue = newQueue.slice(0, MAX_QUEUE_SIZE);
    // Ensure currentIndex is valid
    if (state.currentIndex >= state.queue.length) {
        state.currentIndex = 0;
    }
    return getState();
}

export function setCurrentIndex(index) {
    if (index >= 0 && index < state.queue.length) {
        state.currentIndex = index;
        state.currentTime = 0;
    }
    return getState();
}

export function nextSong() {
    // Wraparound behavior
    state.currentIndex = (state.currentIndex + 1) % state.queue.length;
    state.currentTime = 0;
    return getState();
}

export function prevSong() {
    // Wraparound behavior
    state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
    state.currentTime = 0;
    return getState();
}

export function setPlaying(isPlaying) {
    state.isPlaying = isPlaying;
    return getState();
}

export function setCurrentTime(time) {
    state.currentTime = time;
    return getState();
}

export function setDuration(duration) {
    state.duration = duration;
    return getState();
}

export function updatePlayerState(updates) {
    if (updates.isPlaying !== undefined) state.isPlaying = updates.isPlaying;
    if (updates.currentTime !== undefined) state.currentTime = updates.currentTime;
    if (updates.duration !== undefined) state.duration = updates.duration;
    return getState();
}
