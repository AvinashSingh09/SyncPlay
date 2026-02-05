// Equalizer animation component

import './Equalizer.css';

export function Equalizer({ isPlaying = true }) {
    return (
        <div className={`equalizer ${isPlaying ? '' : 'paused'}`}>
            <div className="equalizer-bar"></div>
            <div className="equalizer-bar"></div>
            <div className="equalizer-bar"></div>
            <div className="equalizer-bar"></div>
        </div>
    );
}
