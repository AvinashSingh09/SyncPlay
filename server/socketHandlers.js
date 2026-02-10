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

        // User adds a single song to the queue
        socket.on('queue:addSong', (data) => {
            console.log('Song added to queue:', data.song?.title);

            if (data.song) {
                const result = state.addSongToQueue(data.song);

                if (!result.added) {
                    socket.emit('queue:error', { message: 'Queue is full' });
                    return;
                }

                // Broadcast updated queue to all clients
                io.emit('queue:update', { queue: state.getQueue() });

                // If this is the first song, start playing it
                if (result.isFirstSong) {
                    state.setCurrentIndex(0);
                    state.setPlaying(true);
                    io.emit('song:change', {
                        index: 0,
                        song: state.getCurrentSong(),
                        isPlaying: true
                    });
                    io.emit('player:state', {
                        isPlaying: true,
                        currentTime: 0,
                        currentIndex: 0
                    });
                }
            }
        });

        // Clear the entire queue
        socket.on('queue:clear', () => {
            console.log('Queue cleared');
            state.clearQueue();
            io.emit('queue:update', { queue: [] });
            io.emit('player:state', {
                isPlaying: false,
                currentTime: 0,
                currentIndex: 0
            });
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
                case 'next': {
                    const result = state.nextSong();
                    if (result.hasNext) {
                        state.setPlaying(true);
                        io.emit('song:change', {
                            index: result.state.currentIndex,
                            song: state.getCurrentSong(),
                            isPlaying: true
                        });
                    }
                    newState = result.state;
                    break;
                }
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
            const result = state.nextSong();
            if (result.hasNext) {
                state.setPlaying(true);
                io.emit('song:change', {
                    index: result.state.currentIndex,
                    song: state.getCurrentSong(),
                    isPlaying: true
                });
                io.emit('player:state', {
                    isPlaying: true,
                    currentTime: 0,
                    currentIndex: result.state.currentIndex
                });
            } else {
                // No more songs in queue
                io.emit('player:state', {
                    isPlaying: false,
                    currentTime: 0,
                    currentIndex: result.state.currentIndex
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
