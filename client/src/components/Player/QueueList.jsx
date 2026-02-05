// Queue list component for Player screen

import { usePlayer } from '../../context/PlayerContext';
import { Equalizer } from '../shared/Equalizer';
import './QueueList.css';

export function QueueList() {
    const { queue, currentIndex, isPlaying, selectSong } = usePlayer();

    return (
        <div className="queue-list">
            <h2 className="queue-title">Queue</h2>
            <div className="queue-items">
                {queue.map((song, index) => (
                    <div
                        key={song.id}
                        className={`queue-item ${index === currentIndex ? 'active' : ''}`}
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
