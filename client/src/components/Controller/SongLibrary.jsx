// Song Library - select and submit one song to queue

import { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../shared/Toast';
import './SongLibrary.css';

export function SongLibrary() {
    const { allSongs, addSongToQueue } = usePlayer();
    const { showToast } = useToast();
    const [selectedSong, setSelectedSong] = useState(null);

    const handleSelect = (song) => {
        setSelectedSong(prev => prev?.id === song.id ? null : song);
    };

    const handleSubmit = () => {
        if (!selectedSong) return;
        addSongToQueue(selectedSong);
        showToast(`Added "${selectedSong.title}" to queue`, 'success');
        setSelectedSong(null);
    };

    if (!allSongs.length) {
        return (
            <div className="song-library">
                <div className="library-empty">Loading songs...</div>
            </div>
        );
    }

    return (
        <div className="song-library">
            <h3 className="library-title">Select a Song</h3>
            <ul className="library-list">
                {allSongs.map((song) => (
                    <li
                        key={song.id}
                        className={`library-item ${selectedSong?.id === song.id ? 'selected' : ''}`}
                        onClick={() => handleSelect(song)}
                    >
                        <div className="library-item-info">
                            <span className="library-item-title">{song.title}</span>
                            <span className="library-item-artist">{song.artist}</span>
                        </div>
                        {selectedSong?.id === song.id && (
                            <div className="library-check">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="library-footer">
                <button
                    className={`library-submit-btn ${selectedSong ? 'active' : ''}`}
                    onClick={handleSubmit}
                    disabled={!selectedSong}
                >
                    {selectedSong ? `Add "${selectedSong.title}"` : 'Select a song to add'}
                </button>
            </div>
        </div>
    );
}
