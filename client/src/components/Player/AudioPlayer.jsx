// Audio player component - handles actual audio playback

import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const AudioPlayer = forwardRef(function AudioPlayer(props, ref) {
    const audioRef = useRef(null);
    const shouldPlayRef = useRef(false);
    const {
        currentSong,
        isPlaying,
        currentTime,
        volume,
        setCurrentTime,
        setDuration,
        setIsPlaying,
        reportTimeUpdate,
        reportSongEnded
    } = usePlayer();

    // Expose audio element via ref
    useImperativeHandle(ref, () => ({
        getAudioElement: () => audioRef.current
    }));

    // Handle play/pause (only when isPlaying toggles, not on song change)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (isPlaying) {
            // Only play if the audio has a valid source and isn't loading a new one
            if (audio.readyState >= 2) {
                audio.play().catch((err) => {
                    console.log('Autoplay blocked:', err);
                    setIsPlaying(false);
                });
            } else {
                // Audio not ready yet, mark that we should play when loaded
                shouldPlayRef.current = true;
            }
        } else {
            shouldPlayRef.current = false;
            audio.pause();
        }
    }, [isPlaying, setIsPlaying]);

    // Handle song change - load new source
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        // Mark that we want to play after loading if isPlaying is true
        shouldPlayRef.current = isPlaying;

        audio.src = `/audio/${currentSong.file}`;
        audio.load();
    }, [currentSong?.id]);

    // Handle seek from other clients
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Only seek if difference is significant (> 2 seconds)
        if (Math.abs(audio.currentTime - currentTime) > 2) {
            audio.currentTime = currentTime;
        }
    }, [currentTime]);

    // Handle volume changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
    }, [volume]);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;

        setCurrentTime(audio.currentTime);
        // Report to server periodically (every 5 seconds)
        if (Math.floor(audio.currentTime) % 5 === 0) {
            reportTimeUpdate(audio.currentTime, audio.duration);
        }
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setDuration(audio.duration);
    };

    // When audio is ready to play after loading a new source
    const handleCanPlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (shouldPlayRef.current) {
            audio.play().catch((err) => {
                console.log('Autoplay blocked:', err);
                setIsPlaying(false);
            });
            shouldPlayRef.current = false;
        }
    }, [setIsPlaying]);

    const handleEnded = () => {
        reportSongEnded();
    };

    return (
        <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onEnded={handleEnded}
            preload="auto"
            crossOrigin="anonymous"
        />
    );
});
