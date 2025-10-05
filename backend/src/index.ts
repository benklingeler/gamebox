/**
 * Main server file for the Gamebox backend.
 * Handles game state management, WebSocket connections, and REST API endpoints.
 */

import { default as express } from 'express';
import { default as cors } from 'cors';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { GameState } from './types';
import { imposterHandleAction, imposterStartGame } from './games/imposter';
import { generateGameId } from './utils/helpers';
import { SERVER_CONFIG, CORS_CONFIG } from './config/constants';

// Initialize Express app and HTTP server
const app = express();
const server = createServer(app);

// Initialize Socket.IO server with CORS configuration
const io = new Server(server, {
    cors: {
        origin: CORS_CONFIG.ORIGIN,
        methods: CORS_CONFIG.METHODS,
    },
});

/**
 * Map of active WebSocket connections.
 * Key: Socket ID, Value: Socket instance and associated player ID
 */
const activeSockets: Map<string, { socket: Socket; playerId: string }> = new Map();

/**
 * Map of all active game states.
 * Key: Game ID, Value: Complete game state
 */
const gameStates: Map<string, GameState> = new Map();

app.use(express.json());
app.use(cors());

// ==================== Helper Functions ====================

/**
 * Broadcasts the current game state to all connected clients.
 *
 * @param gameId - The ID of the game to broadcast
 */
function pushGameState(gameId: string): void {
    const state = gameStates.get(gameId);
    if (state) {
        activeSockets.forEach(({ socket }) => {
            socket.emit(gameId, state);
        });
    }
}

/**
 * Removes a player from a game and handles cleanup.
 * If no players remain, the game is deleted.
 * If the host leaves, a new random host is assigned.
 *
 * @param gameId - The ID of the game
 * @param playerId - The ID of the player to remove
 */
function removePlayerFromGame(gameId: string, playerId: string): void {
    const gameState = gameStates.get(gameId);
    if (gameState) {
        // Remove player from the game
        gameState.players = gameState.players.filter((player) => player.id !== playerId);

        // Delete game if no players remain
        if (gameState.players.length === 0) {
            gameStates.delete(gameId);
            return;
        }

        // Assign new host if current host left
        if (!gameState.players.find((player) => player.isHost)) {
            const newHost = gameState.players[Math.floor(Math.random() * gameState.players.length)];
            if (newHost) {
                newHost.isHost = true;
            }
        }

        pushGameState(gameId);
    }
}

// ==================== REST API Endpoints ====================

// ==================== REST API Endpoints ====================

/**
 * GET /
 * Health check endpoint
 */
app.get('/', (request, response) => {
    response.send('Hello World');
});

/**
 * POST /api/game
 * Creates a new game session with the requesting player as host.
 *
 * Request body:
 * - playerId: Unique identifier for the player
 * - nickname: Display name for the player
 *
 * Response:
 * - gameId: The newly created game session ID
 */
app.post('/api/game', (req, res) => {
    const { playerId, nickname } = req.body;
    const gameId = generateGameId();

    // Initialize new game state
    gameStates.set(gameId, {
        gameId,
        players: [{ id: playerId, nickname, isHost: true, score: 0 }],
        gameDetails: null,
    });

    // Set up periodic game state broadcasting
    const gameStateUpdateInterval = setInterval(() => {
        const gamestate = gameStates.get(gameId);

        if (gamestate && gamestate.players.length > 0) {
            pushGameState(gameId);
        } else {
            // Clean up interval if game no longer exists or has no players
            clearInterval(gameStateUpdateInterval);
        }
    }, SERVER_CONFIG.GAME_STATE_UPDATE_INTERVAL);

    pushGameState(gameId);

    res.json({ gameId });
});

/**
 * POST /api/game/:gameId/join
 * Allows a player to join an existing game session.
 *
 * URL params:
 * - gameId: The game session to join
 *
 * Request body:
 * - playerId: Unique identifier for the player
 * - nickname: Display name for the player
 *
 * Response:
 * - success: Boolean indicating if join was successful
 * - gameId: The game session ID
 */
app.post('/api/game/:gameId/join', (req, res) => {
    const { gameId } = req.params;
    const { playerId, nickname } = req.body;

    const gameState = gameStates.get(gameId);

    if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
    }

    // Add player if not already in the game
    if (!gameState.players.find((player) => player.id === playerId)) {
        gameState.players.push({ id: playerId, nickname, isHost: false, score: 0 });
    }

    pushGameState(gameId);

    return res.json({ success: true, gameId });
});

/**
 * POST /api/game/:gameId/leave
 * Removes a player from a game session.
 *
 * URL params:
 * - gameId: The game session to leave
 *
 * Request body:
 * - playerId: ID of the player leaving
 *
 * Response:
 * - success: Boolean indicating if leave was successful
 * - gameId: The game session ID
 */
app.post('/api/game/:gameId/leave', (req, res) => {
    const { gameId } = req.params;
    const { playerId } = req.body;

    const gameState = gameStates.get(gameId);

    if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
    }

    removePlayerFromGame(gameId, playerId);

    return res.json({ success: true, gameId });
});

/**
 * GET /api/game/:gameId/state
 * Retrieves the current state of a game session.
 *
 * URL params:
 * - gameId: The game session ID
 *
 * Response:
 * - success: Boolean indicating success
 * - gameId: The game session ID
 * - state: Complete game state object
 */
app.get('/api/game/:gameId/state', (req, res) => {
    const { gameId } = req.params;

    const state = gameStates.get(gameId);

    if (!state) {
        return res.status(404).json({ error: 'Game not found' });
    }

    return res.json({ success: true, gameId, state });
});

/**
 * POST /api/game/:gameId/start
 * Starts a game with the specified game mode. Only the host can start the game.
 *
 * URL params:
 * - gameId: The game session ID
 *
 * Request body:
 * - playerId: ID of the player attempting to start (must be host)
 * - gameMode: The game mode to start (e.g., 'imposter')
 *
 * Response:
 * - success: Boolean indicating if game started successfully
 * - gameId: The game session ID
 */
app.post('/api/game/:gameId/start', (req, res) => {
    const { gameId } = req.params;
    const { playerId, gameMode } = req.body;

    const gameState = gameStates.get(gameId);

    const player = gameStates.get(gameId)?.players.find((p) => p.id === playerId);

    if (!player || !gameState) {
        return res.status(404).json({ error: 'Player or game not found' });
    }

    if (!player.isHost) {
        return res.status(403).json({ error: 'Only host can start the game' });
    }

    // Initialize game based on selected mode
    if (gameMode === 'imposter') {
        gameStates.set(gameId, imposterStartGame(gameState));
    }

    pushGameState(gameId);

    return res.json({ success: true, gameId });
});

/**
 * POST /api/game/:gameId/advance
 * Advances the game to the next phase. Only the host can advance.
 * Currently a placeholder endpoint.
 *
 * URL params:
 * - gameId: The game session ID
 *
 * Request body:
 * - playerId: ID of the player attempting to advance (must be host)
 *
 * Response:
 * - success: Boolean indicating success
 * - gameId: The game session ID
 */
app.post('/api/game/:gameId/advance', (req, res) => {
    const { gameId } = req.params;
    const { playerId } = req.body;

    const player = gameStates.get(gameId)?.players.find((p) => p.id === playerId);

    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }

    if (!player.isHost) {
        return res.status(403).json({ error: 'Only host can advance the game' });
    }

    return res.json({ success: true, gameId });
});

/**
 * POST /api/game/:gameId/action
 * Handles game-specific actions during gameplay.
 *
 * URL params:
 * - gameId: The game session ID
 *
 * Request body:
 * - action: The action type to perform
 * - details: Additional data for the action
 * - playerId: ID of the player performing the action
 *
 * Special actions:
 * - 'reset': Resets the game (host only)
 *
 * Response:
 * - success: Boolean indicating success
 * - gameId: The game session ID
 * - action: The action that was performed
 * - details: Action details
 * - playerId: ID of the player who performed the action
 */
app.post('/api/game/:gameId/action', (req, res) => {
    const { gameId } = req.params;
    const { action, details, playerId } = req.body;

    const gameState = gameStates.get(gameId);

    if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const isHost = gameState.players.find((p) => p.id === playerId)?.isHost;

    // Handle reset action (host only)
    if (action === 'reset' && isHost) {
        gameState.gameDetails = null;
        pushGameState(gameId);
        return res.json({ success: true, gameId });
    }

    const gameMode = gameState.gameDetails?.gameMode;

    // Delegate to game-specific action handler
    if (gameMode === 'imposter') {
        gameStates.set(gameId, imposterHandleAction(gameState, action, details, playerId));
    }

    pushGameState(gameId);

    return res.json({ success: true, gameId, action, details, playerId });
});

// ==================== WebSocket Connection Handling ====================

/**
 * Handle new WebSocket connections.
 * Manages player registration and cleanup on disconnect.
 */
io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);
    activeSockets.set(socket.id, { socket, playerId: '' });

    /**
     * Register a player ID with their socket connection.
     * This allows the server to track which player is using which connection.
     */
    socket.on('register', (playerId) => {
        activeSockets.set(socket.id, { socket, playerId });
    });

    /**
     * Handle client disconnection.
     * Removes the player from all games they're participating in.
     */
    socket.on('disconnect', () => {
        console.log('WebSocket connection closed:', socket.id);
        const playerId = activeSockets.get(socket.id)?.playerId;

        if (playerId) {
            // Remove player from all games
            gameStates.forEach((state) => {
                removePlayerFromGame(state.gameId, playerId);
            });
        }

        activeSockets.delete(socket.id);
    });
});

// ==================== Server Startup ====================

/**
 * Start the HTTP server on the configured port.
 */
server.listen(SERVER_CONFIG.PORT, () => {
    console.log(`Server is running on http://localhost:${SERVER_CONFIG.PORT}`);
});
