// Express + Socket.IO server entry point

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupSocketHandlers } from './socketHandlers.js';
import * as state from './state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const app = express();
const server = createServer(app);

// Socket.IO setup with CORS for development
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? false
            : ['http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(express.json());

// Serve static audio files
app.use('/audio', express.static(join(rootDir, 'public', 'audio')));

// API endpoint to get song list
app.get('/api/songs', (req, res) => {
    res.json(state.getSongs());
});

// API endpoint to get current state
app.get('/api/state', (req, res) => {
    res.json(state.getState());
});

// In production, serve the built React app
if (process.env.NODE_ENV === 'production') {
    const clientDist = join(rootDir, 'client', 'dist');
    app.use(express.static(clientDist));

    // Handle client-side routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api') && !req.path.startsWith('/audio')) {
            res.sendFile(join(clientDist, 'index.html'));
        }
    });
}

// Setup WebSocket handlers
setupSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🎵 SyncPlay server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`   API: http://localhost:${PORT}/api/songs`);
        console.log(`   Client dev server should run on http://localhost:5173`);
    }
});
