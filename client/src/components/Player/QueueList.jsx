// Queue list component for Player screen - shows "Up Next" queue

import { usePlayer } from '../../context/PlayerContext';
import { Equalizer } from '../shared/Equalizer';
import './QueueList.css';

export function QueueList() {
    const { queue, currentIndex, isPlaying, selectSong, clearQueue } = usePlayer();

    if (queue.length === 0) {
        return (
            <div className="queue-list">
                <h2 className="queue-title">Queue</h2>
                <div className="queue-empty">
                    <p>No songs in queue yet</p>
                    <p className="queue-empty-hint">Add songs from the controller</p>
                </div>
            </div>
        );
    }

    return (
        <div className="queue-list">
            <div className="queue-title-row">
                <h2 className="queue-title">Queue</h2>
                <button className="queue-clear-btn" onClick={clearQueue} title="Clear queue">
                    Clear
                </button>
            </div>
            <div className="queue-items">
                {queue.map((song, index) => (
                    <div
                        key={`${song.id}-${index}`}
                        className={`queue-item ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'played' : ''}`}
                        onClick={() => selectSong(index)}
                    >
                        <div className="queue-item-index">
                            {index === currentIndex ? (
                                <Equalizer isPlaying={isPlaying} />
                            ) : (
                                <span className="index-number">{index + 1}</span>
                            )}
                        </div>
                        <div className="queue-item-info">
                            <span className="queue-item-title">{song.title}</span>
                            <span className="queue-item-artist">{song.artist}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
