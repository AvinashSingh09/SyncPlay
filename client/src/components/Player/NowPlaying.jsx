// Now Playing component with album art fetch
import { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import './NowPlaying.css';

export function NowPlaying() {
    const { currentSong, isConnected, isPlaying } = usePlayer();
    const [albumArt, setAlbumArt] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch album art from iTunes API
    useEffect(() => {
        if (!currentSong) {
            setAlbumArt(null);
            return;
        }

        const fetchAlbumArt = async () => {
            setLoading(true);
            try {
                const query = encodeURIComponent(`${currentSong.artist} ${currentSong.title}`);
                const response = await fetch(
                    `https://itunes.apple.com/search?term=${query}&media=music&limit=1`
                );
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    // Get high-res artwork (replace 100x100 with 600x600)
                    const artwork = data.results[0].artworkUrl100?.replace('100x100', '600x600');
                    setAlbumArt(artwork || null);
                } else {
                    setAlbumArt(null);
                }
            } catch (error) {
                console.error('Failed to fetch album art:', error);
                setAlbumArt(null);
            }
            setLoading(false);
        };

        fetchAlbumArt();
    }, [currentSong?.id]);

    return (
        <div className={`now-playing ${!currentSong ? 'empty' : ''}`}>
            <div className="now-playing-visual">
                {albumArt ? (
                    <div className={`album-art ${isPlaying ? 'playing' : ''}`}>
                        <img src={albumArt} alt={`${currentSong?.title} album art`} />
                    </div>
                ) : (
                    <div className="album-placeholder">
                        {loading ? (
                            <div className="loading-spinner" />
                        ) : (
                            <svg className="music-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        )}
                    </div>
                )}
            </div>

            <div className="now-playing-info">
                {currentSong ? (
                    <>
                        <h1 className="now-playing-title">{currentSong.title}</h1>
                        <p className="now-playing-artist">{currentSong.artist}</p>
                    </>
                ) : (
                    <p className="now-playing-placeholder">No song selected</p>
                )}
            </div>

            <div className={`connection-status ${!isConnected ? 'disconnected' : ''}`}>
                <span className={`connection-dot ${!isConnected ? 'disconnected' : ''}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
        </div>
    );
}
