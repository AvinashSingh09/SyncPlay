// Admin Page - Player controls and queue management

import { usePlayer } from '../context/PlayerContext';
import { QueueList } from '../components/Player/QueueList';
import './AdminPage.css';

export function AdminPage() {
    const {
        currentSong,
        isPlaying,
        isConnected,
        currentTime,
        duration,
        play,
        pause,
        next,
        prev,
        seek,
        clearQueue
    } = usePlayer();

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        seek(time);
    };

    const skipForward = () => {
        seek(Math.min(currentTime + 10, duration));
    };

    const skipBackward = () => {
        seek(Math.max(currentTime - 10, 0));
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
                <h1 className="admin-title">SyncPlay Admin</h1>
                <div className="admin-connection">
                    <div className={`connection-dot ${isConnected ? '' : 'disconnected'}`}></div>
                    <span>{isConnected ? 'Connected' : 'Reconnecting...'}</span>
                </div>
            </header>

            <main className="admin-main">
                {/* Now Playing */}
                <section className="admin-now-playing">
                    {currentSong ? (
                        <>
                            <h2 className="admin-song-title">{currentSong.title}</h2>
                            <p className="admin-song-artist">{currentSong.artist}</p>
                        </>
                    ) : (
                        <h2 className="admin-song-title empty">No song playing</h2>
                    )}
                </section>

                {/* Seek bar */}
                <section className="admin-seek">
                    <span className="admin-time">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        className="admin-seek-bar"
                        min={0}
                        max={duration || 0}
                        value={currentTime || 0}
                        onChange={handleSeek}
                        step={0.1}
                    />
                    <span className="admin-time">{formatTime(duration)}</span>
                </section>

                {/* Controls */}
                <section className="admin-controls">
                    <button className="admin-btn" onClick={skipBackward} title="Back 10s">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                        </svg>
                        <span className="btn-label">-10s</span>
                    </button>

                    <button className="admin-btn" onClick={prev} title="Previous">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                        </svg>
                    </button>

                    <button className="admin-btn primary" onClick={isPlaying ? pause : play} title={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    <button className="admin-btn" onClick={next} title="Next">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                        </svg>
                    </button>

                    <button className="admin-btn" onClick={skipForward} title="Forward 10s">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                        </svg>
                        <span className="btn-label">+10s</span>
                    </button>
                </section>

                {/* Clear Queue */}
                <section className="admin-actions">
                    <button className="admin-clear-btn" onClick={clearQueue}>
                        🗑️ Clear Queue
                    </button>
                </section>

                {/* Queue */}
                <section className="admin-queue">
                    <QueueList />
                </section>
            </main>
        </div>
    );
}
