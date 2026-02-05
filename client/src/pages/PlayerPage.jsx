// Player Page - Main display screen with responsive sidebar and visualizer

import { useState, useRef, useEffect } from 'react';
import { QueueList } from '../components/Player/QueueList';
import { NowPlaying } from '../components/Player/NowPlaying';
import { Controls } from '../components/Player/Controls';
import { QRCode } from '../components/Player/QRCode';
import { AudioPlayer } from '../components/Player/AudioPlayer';
import { AudioVisualizer } from '../components/Player/AudioVisualizer';
import { usePlayer } from '../context/PlayerContext';
import './PlayerPage.css';

export function PlayerPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const audioPlayerRef = useRef(null);
    const [audioElement, setAudioElement] = useState(null);
    const { isPlaying } = usePlayer();

    // Get audio element after component mounts
    useEffect(() => {
        if (audioPlayerRef.current) {
            setAudioElement(audioPlayerRef.current.getAudioElement());
        }
    }, []);

    return (
        <div className="player-page">
            <AudioPlayer ref={audioPlayerRef} />

            {/* Mobile toggle button */}
            <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle queue"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zm-4 4H3v2h8v-2zm8-4v6l5-3-5-3z" />
                </svg>
                <span>Queue</span>
            </button>

            {/* Sidebar - slides in on mobile */}
            <aside className={`player-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Queue</h2>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close queue"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
                <QueueList />
            </aside>

            {/* Backdrop for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <main className="player-main">
                <NowPlaying />

                {/* Audio Visualizer */}
                <AudioVisualizer audioElement={audioElement} isPlaying={isPlaying} />

                <Controls />
                {/* QR Code shows inline on mobile */}
                <div className="mobile-qr">
                    <QRCode />
                </div>
            </main>

            <aside className="player-qr desktop-only">
                <QRCode />
            </aside>
        </div>
    );
}
