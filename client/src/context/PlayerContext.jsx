// React context for player state management

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);  // 0 to 1

    // Initialize socket connection
    useEffect(() => {
        const socket = io({
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setIsConnected(true);
            // Request current state on connect
            socket.emit('sync:request');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        // Handle full state sync
        socket.on('sync:response', (state) => {
            console.log('Received state sync:', state);
            setQueue(state.queue || []);
            setCurrentIndex(state.currentIndex || 0);
            setIsPlaying(state.isPlaying || false);
            setCurrentTime(state.currentTime || 0);
            setDuration(state.duration || 0);
        });

        // Handle queue updates
        socket.on('queue:update', (data) => {
            console.log('Queue updated:', data.queue?.length, 'songs');
            setQueue(data.queue || []);
        });

        // Handle song change
        socket.on('song:change', (data) => {
            console.log('Song changed:', data.index, data.song?.title);
            setCurrentIndex(data.index);
            setCurrentTime(0);
        });

        // Handle player state updates
        socket.on('player:state', (data) => {
            if (data.isPlaying !== undefined) setIsPlaying(data.isPlaying);
            if (data.currentTime !== undefined) setCurrentTime(data.currentTime);
            if (data.currentIndex !== undefined) setCurrentIndex(data.currentIndex);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Player control functions
    const play = useCallback(() => {
        socketRef.current?.emit('player:control', { action: 'play' });
    }, []);

    const pause = useCallback(() => {
        socketRef.current?.emit('player:control', { action: 'pause' });
    }, []);

    const next = useCallback(() => {
        socketRef.current?.emit('player:control', { action: 'next' });
    }, []);

    const prev = useCallback(() => {
        socketRef.current?.emit('player:control', { action: 'prev' });
    }, []);

    const seek = useCallback((time) => {
        socketRef.current?.emit('player:control', { action: 'seek', value: time });
    }, []);

    const selectSong = useCallback((index) => {
        socketRef.current?.emit('player:control', { action: 'selectSong', value: index });
    }, []);

    const submitQueue = useCallback((newQueue) => {
        socketRef.current?.emit('queue:submit', { queue: newQueue });
    }, []);

    const reportTimeUpdate = useCallback((time, dur) => {
        socketRef.current?.emit('player:timeUpdate', { currentTime: time, duration: dur });
    }, []);

    const reportSongEnded = useCallback(() => {
        socketRef.current?.emit('player:songEnded');
    }, []);

    const setVolume = useCallback((vol) => {
        setVolumeState(vol);
    }, []);

    // Derived state
    const currentSong = queue[currentIndex] || null;

    const value = {
        // State
        isConnected,
        queue,
        currentIndex,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        // Actions
        play,
        pause,
        next,
        prev,
        seek,
        selectSong,
        submitQueue,
        reportTimeUpdate,
        reportSongEnded,
        setVolume,
        // Local state setters (for audio element sync)
        setCurrentTime,
        setDuration,
        setIsPlaying
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
