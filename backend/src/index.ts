import { default as express } from 'express';
import { default as cors } from 'cors';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { GameState } from './types';
import { imposterHandleAction, imposterStartGame } from './games/imposter';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Configure this to your frontend URL in production
        methods: ['GET', 'POST'],
    },
});

const activeSockets: Map<string, { socket: Socket; playerId: string }> = new Map();
const gameStates: Map<string, GameState> = new Map();

app.use(express.json());
app.use(cors());

function pushGameState(gameId: string) {
    const state = gameStates.get(gameId);
    if (state) {
        activeSockets.forEach(({ socket }) => {
            socket.emit(gameId, state);
        });
    }
}

function removePlayerFromGame(gameId: string, playerId: string) {
    const gameState = gameStates.get(gameId);
    if (gameState) {
        gameState.players = gameState.players.filter((player) => player.id !== playerId);

        // Remove game state if no players are left
        if (gameState.players.length === 0) {
            gameStates.delete(gameId);
        }

        // Set random host if no host is left
        if (!gameState.players.find((player) => player.isHost)) {
            const newHost = gameState.players[Math.floor(Math.random() * gameState.players.length)];
            if (newHost) {
                newHost.isHost = true;
            }
        }

        pushGameState(gameId);
    }
}

app.get('/', (request, response) => {
    response.send('Hello World');
});

app.post('/api/game', (req, res) => {
    const { playerId, nickname } = req.body;
    const gameId = Math.random().toString(36).substring(7);

    gameStates.set(gameId, {
        gameId,
        players: [{ id: playerId, nickname, isHost: true, score: 0 }],
        gameDetails: null,
    });

    const gameStateUpdateInterval = setInterval(() => {
        const gamestate = gameStates.get(gameId);

        if (gamestate && gamestate.players.length > 0) {
            pushGameState(gameId);
        } else {
            clearInterval(gameStateUpdateInterval);
        }
    }, 1000);

    pushGameState(gameId);

    res.json({ gameId });
});

app.post('/api/game/:gameId/join', (req, res) => {
    const { gameId } = req.params;
    const { playerId, nickname } = req.body;

    const gameState = gameStates.get(gameId);

    if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
    }

    if (!gameState.players.find((player) => player.id === playerId)) {
        gameState.players.push({ id: playerId, nickname, isHost: false, score: 0 });
    }

    pushGameState(gameId);

    return res.json({ success: true, gameId });
});

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

app.get('/api/game/:gameId/state', (req, res) => {
    const { gameId } = req.params;

    const state = gameStates.get(gameId);

    if (!state) {
        return res.status(404).json({ error: 'Game not found' });
    }

    return res.json({ success: true, gameId, state });
});

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

    if (gameMode === 'imposter') {
        gameStates.set(gameId, imposterStartGame(gameState));
    }

    pushGameState(gameId);

    return res.json({ success: true, gameId });
});

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

app.post('/api/game/:gameId/action', (req, res) => {
    const { gameId } = req.params;
    const { action, details, playerId } = req.body;

    const gameState = gameStates.get(gameId);

    if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const isHost = gameState.players.find((p) => p.id === playerId)?.isHost;

    if (action === 'reset' && isHost) {
        gameState.gameDetails = null;

        pushGameState(gameId);

        return res.json({ success: true, gameId });
    }

    const gameMode = gameState.gameDetails?.gameMode;

    if (gameMode === 'imposter') {
        gameStates.set(gameId, imposterHandleAction(gameState, action, details, playerId));
    }

    pushGameState(gameId);

    return res.json({ success: true, gameId, action, details, playerId });
});

io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);
    activeSockets.set(socket.id, { socket, playerId: '' });

    socket.on('register', (playerId) => {
        activeSockets.set(socket.id, { socket, playerId });
    });

    socket.on('disconnect', () => {
        console.log('WebSocket connection closed:', socket.id);
        const playerId = activeSockets.get(socket.id)?.playerId;

        if (playerId) {
            // Remove player from all game states
            gameStates.forEach((state) => {
                removePlayerFromGame(state.gameId, playerId);
            });
        }

        activeSockets.delete(socket.id);
    });
});

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
