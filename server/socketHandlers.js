// Socket.IO event handlers for real-time synchronization

import * as state from './state.js';

export function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Send current state to newly connected client
        socket.emit('sync:response', state.getState());

        // Client requests full state sync
        socket.on('sync:request', () => {
            socket.emit('sync:response', state.getState());
        });

        // Controller submits a new queue order
        socket.on('queue:submit', (data) => {
            console.log('Queue submitted:', data.queue?.length, 'songs');

            if (data.queue && Array.isArray(data.queue)) {
                state.setQueue(data.queue);
                // Always start from the first song when new queue is submitted
                state.setCurrentIndex(0);
                // Start playing the new queue
                const newState = state.setPlaying(true);
                // Broadcast to all clients including sender
                io.emit('queue:update', { queue: newState.queue });
                io.emit('song:change', {
                    index: 0,
                    song: state.getCurrentSong()
                });
                io.emit('player:state', {
                    isPlaying: true,
                    currentTime: 0,
                    currentIndex: 0
                });
            }
        });

        // Player control events (play, pause, next, prev, seek)
        socket.on('player:control', (data) => {
            console.log('Player control:', data.action);

            let newState;

            switch (data.action) {
                case 'play':
                    newState = state.setPlaying(true);
                    break;
                case 'pause':
                    newState = state.setPlaying(false);
                    break;
                case 'next':
                    newState = state.nextSong();
                    io.emit('song:change', {
                        index: newState.currentIndex,
                        song: state.getCurrentSong()
                    });
                    break;
                case 'prev':
                    newState = state.prevSong();
                    io.emit('song:change', {
                        index: newState.currentIndex,
                        song: state.getCurrentSong()
                    });
                    break;
                case 'seek':
                    if (typeof data.value === 'number') {
                        newState = state.setCurrentTime(data.value);
                    }
                    break;
                case 'selectSong':
                    if (typeof data.value === 'number') {
                        newState = state.setCurrentIndex(data.value);
                        io.emit('song:change', {
                            index: newState.currentIndex,
                            song: state.getCurrentSong()
                        });
                    }
                    break;
                default:
                    return;
            }

            if (newState) {
                io.emit('player:state', {
                    isPlaying: newState.isPlaying,
                    currentTime: newState.currentTime,
                    currentIndex: newState.currentIndex
                });
            }
        });

        // Player reports time updates (for sync)
        socket.on('player:timeUpdate', (data) => {
            state.updatePlayerState({
                currentTime: data.currentTime,
                duration: data.duration
            });
            // Broadcast to other clients (not sender) for sync
            socket.broadcast.emit('player:state', {
                isPlaying: state.getState().isPlaying,
                currentTime: data.currentTime,
                currentIndex: state.getState().currentIndex
            });
        });

        // Song ended - auto advance to next
        socket.on('player:songEnded', () => {
            const newState = state.nextSong();
            // Keep playing when advancing to next song
            state.setPlaying(true);
            io.emit('song:change', {
                index: newState.currentIndex,
                song: state.getCurrentSong(),
                isPlaying: true  // Send playing state with song change
            });
            io.emit('player:state', {
                isPlaying: true,
                currentTime: 0,
                currentIndex: newState.currentIndex
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
