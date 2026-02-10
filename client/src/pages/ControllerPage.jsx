// Controller Page - Mobile-first song browser

import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../components/shared/Toast';
import { SongLibrary } from '../components/Controller/SongLibrary';
import './ControllerPage.css';

export function ControllerPage() {
    const { currentSong, isPlaying, isConnected } = usePlayer();

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
                <SongLibrary />
            </main>
        </div>
    );
}
