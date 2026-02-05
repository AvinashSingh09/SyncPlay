// Controller Page - Mobile-first queue management

import { useState, useEffect, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../components/shared/Toast';
import { DraggableQueue } from '../components/Controller/DraggableQueue';
import { SubmitButton } from '../components/Controller/SubmitButton';
import './ControllerPage.css';

export function ControllerPage() {
    const { queue, currentSong, isPlaying, isConnected, submitQueue } = usePlayer();
    const { showToast } = useToast();

    // Local queue for editing before submit
    const [localQueue, setLocalQueue] = useState([]);
    const [originalQueue, setOriginalQueue] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync local queue when server queue changes
    useEffect(() => {
        setLocalQueue([...queue]);
        setOriginalQueue([...queue]);
    }, [queue]);

    // Check if queue has been modified
    const hasChanges = useCallback(() => {
        if (localQueue.length !== originalQueue.length) return true;
        return localQueue.some((song, index) => song.id !== originalQueue[index]?.id);
    }, [localQueue, originalQueue]);

    // Handle queue submission
    const handleSubmit = async () => {
        if (!hasChanges()) return;

        setIsSubmitting(true);
        submitQueue(localQueue);

        // Optimistic update
        setOriginalQueue([...localQueue]);
        showToast('Queue updated!', 'success');

        setTimeout(() => {
            setIsSubmitting(false);
        }, 500);
    };

    // Reset to original queue
    const handleReset = () => {
        setLocalQueue([...originalQueue]);
    };

    return (
        <div className="controller-page">
            <header className="controller-header">
                <div className="header-content">
                    <h1 className="header-title">SyncPlay</h1>
                    <div className="connection-indicator">
                        <div className={`connection-dot ${isConnected ? '' : 'disconnected'}`}></div>
                        <span>{isConnected ? 'Connected' : 'Reconnecting...'}</span>
                    </div>
                </div>

                {currentSong && (
                    <div className="now-playing-mini">
                        <div className="now-playing-info">
                            <span className="now-playing-label">Now Playing</span>
                            <span className="now-playing-song">{currentSong.title}</span>
                            <span className="now-playing-artist">{currentSong.artist}</span>
                        </div>
                        <div className={`playing-indicator ${isPlaying ? 'active' : ''}`}>
                            {isPlaying ? '▶' : '⏸'}
                        </div>
                    </div>
                )}
            </header>

            <main className="controller-main">
                <div className="queue-header">
                    <h2>Queue</h2>
                    {hasChanges() && (
                        <button className="reset-btn" onClick={handleReset}>
                            Reset
                        </button>
                    )}
                </div>

                <DraggableQueue
                    localQueue={localQueue}
                    setLocalQueue={setLocalQueue}
                    originalQueue={originalQueue}
                />
            </main>

            <footer className="controller-footer">
                <SubmitButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    hasChanges={hasChanges()}
                />
            </footer>
        </div>
    );
}
