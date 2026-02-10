// In-memory state management for the music player
// Jukebox model: empty queue, users add one song at a time

import songs from '../songs.json' with { type: 'json' };

const MAX_QUEUE_SIZE = 50;

// Initialize state with EMPTY queue
const state = {
    queue: [],
    currentIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0
};

export function getState() {
    return { ...state };
}

export function clearQueue() {
    state.queue = [];
    state.currentIndex = 0;
    state.isPlaying = false;
    state.currentTime = 0;
    state.duration = 0;
    return getState();
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

// Add a song to the end of the queue
// Returns { state, isFirstSong } so the handler knows whether to auto-play
export function addSongToQueue(song) {
    if (state.queue.length >= MAX_QUEUE_SIZE) {
        return { state: getState(), isFirstSong: false, added: false };
    }
    const isFirstSong = state.queue.length === 0;
    state.queue.push(song);
    return { state: getState(), isFirstSong, added: true };
}

export function setCurrentIndex(index) {
    if (index >= 0 && index < state.queue.length) {
        state.currentIndex = index;
        state.currentTime = 0;
    }
    return getState();
}

export function nextSong() {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex < state.queue.length) {
        state.currentIndex = nextIndex;
        state.currentTime = 0;
        return { state: getState(), hasNext: true };
    }
    // No more songs — stop playing
    state.isPlaying = false;
    return { state: getState(), hasNext: false };
}

export function prevSong() {
    if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentTime = 0;
    }
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
