// Playback controls component with volume slider

import { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import './Controls.css';

export function Controls() {
    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        play,
        pause,
        next,
        prev,
        seek,
        setVolume
    } = usePlayer();

    const [showVolume, setShowVolume] = useState(false);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgressClick = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;
        seek(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const currentVolume = volume ?? 1;

    // Volume icon based on level
    const VolumeIcon = () => {
        if (currentVolume === 0) {
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
            );
        } else if (currentVolume < 0.5) {
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                </svg>
            );
        } else {
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            );
        }
    };

    return (
        <div className="controls">
            <div className="controls-buttons">
                <button className="btn btn-icon btn-secondary" onClick={prev} aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                </button>

                <button
                    className="btn btn-icon btn-icon-lg btn-primary"
                    onClick={isPlaying ? pause : play}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button className="btn btn-icon btn-secondary" onClick={next} aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                </button>
            </div>

            <div className="controls-progress">
                <span className="time-current">{formatTime(currentTime)}</span>
                <div className="progress-bar" onClick={handleProgressClick}>
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="time-duration">{formatTime(duration)}</span>
            </div>

            <div className="controls-volume">
                <button
                    className="btn btn-icon btn-icon-sm btn-secondary volume-btn"
                    onClick={() => setShowVolume(!showVolume)}
                    aria-label="Volume"
                >
                    <VolumeIcon />
                </button>
                <div className={`volume-slider-container ${showVolume ? 'visible' : ''}`}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={currentVolume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                        aria-label="Volume"
                    />
                    <span className="volume-value">{Math.round(currentVolume * 100)}%</span>
                </div>
            </div>
        </div>
    );
}
