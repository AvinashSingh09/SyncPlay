// Audio Visualizer component using Web Audio API

import { useRef, useEffect, useState } from 'react';
import './AudioVisualizer.css';

export function AudioVisualizer({ audioElement, isPlaying }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    const audioContextRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize audio context and analyser
    useEffect(() => {
        if (!audioElement || isInitialized) return;

        const initAudio = () => {
            try {
                // Create audio context
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContextRef.current = new AudioContext();

                // Create analyser
                const analyser = audioContextRef.current.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;
                analyserRef.current = analyser;

                // Create data array
                const bufferLength = analyser.frequencyBinCount;
                dataArrayRef.current = new Uint8Array(bufferLength);

                // Connect audio element to analyser
                const source = audioContextRef.current.createMediaElementSource(audioElement);
                source.connect(analyser);
                analyser.connect(audioContextRef.current.destination);
                sourceRef.current = source;

                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize audio visualizer:', error);
            }
        };

        // Initialize on first user interaction (to comply with autoplay policies)
        const handleInteraction = () => {
            initAudio();
            document.removeEventListener('click', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
        };
    }, [audioElement, isInitialized]);

    // Animation loop
    useEffect(() => {
        if (!isInitialized || !canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;

        const draw = () => {
            if (!isPlaying) {
                // Draw static bars when paused
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const barCount = 32;
                const barWidth = canvas.width / barCount - 2;

                for (let i = 0; i < barCount; i++) {
                    const barHeight = 10;
                    const x = i * (barWidth + 2);
                    const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
                    gradient.addColorStop(0, '#1db954');
                    gradient.addColorStop(1, '#1ed760');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                }
                return;
            }

            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barCount = 32;
            const barWidth = canvas.width / barCount - 2;

            for (let i = 0; i < barCount; i++) {
                // Sample from full frequency range
                const dataIndex = Math.floor(i * (dataArray.length / barCount));
                const barHeight = (dataArray[dataIndex] / 255) * canvas.height * 0.9;

                const x = i * (barWidth + 2);

                // Gradient from green to lighter green
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
                gradient.addColorStop(0, '#1db954');
                gradient.addColorStop(1, '#1ed760');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            }
        };

        if (isPlaying) {
            // Resume audio context if suspended
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
            draw();
        } else {
            draw(); // Draw static bars
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, isInitialized]);

    return (
        <div className="audio-visualizer">
            <canvas
                ref={canvasRef}
                width={320}
                height={60}
                className="visualizer-canvas"
            />
            {!isInitialized && (
                <div className="visualizer-hint">
                    Click anywhere to enable visualizer
                </div>
            )}
        </div>
    );
}
