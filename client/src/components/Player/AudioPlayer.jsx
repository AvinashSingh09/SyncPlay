// Audio player component - handles actual audio playback

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const AudioPlayer = forwardRef(function AudioPlayer(props, ref) {
    const audioRef = useRef(null);
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

    // Handle play/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (isPlaying) {
            audio.play().catch((err) => {
                console.log('Autoplay blocked:', err);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, currentSong, setIsPlaying]);

    // Handle song change
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        audio.src = `/audio/${currentSong.file}`;
        audio.load();

        if (isPlaying) {
            audio.play().catch((err) => {
                console.log('Autoplay blocked:', err);
                setIsPlaying(false);
            });
        }
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

    const handleEnded = () => {
        reportSongEnded();
    };

    return (
        <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            preload="auto"
            crossOrigin="anonymous"
        />
    );
});
