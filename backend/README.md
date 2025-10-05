# Gamebox Backend

A Node.js backend server for the Gamebox multiplayer game platform, built with TypeScript, Express, and Socket.IO.

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Main server file with REST API and WebSocket handling
│   ├── types.ts                 # TypeScript type definitions for game state
│   ├── config/
│   │   └── constants.ts         # Application-wide constants and configuration
│   ├── games/
│   │   ├── imposter.ts          # Imposter game mode implementation
│   │   └── wordlist.ts          # Word list for Imposter game
│   └── utils/
│       └── helpers.ts           # Utility functions (random selection, ID generation)
├── package.json
└── tsconfig.json
```

## Architecture

### Core Components

#### Server (`index.ts`)

-   **Express REST API**: Handles game creation, joining, and game actions
-   **WebSocket Server**: Manages real-time game state updates via Socket.IO
-   **Game State Management**: In-memory storage of active games and player connections

#### Type System (`types.ts`)

-   `Player`: Player information and state
-   `GameState`: Complete game session state
-   `ImposterGame`: Imposter-specific game state and phases
-   Phase types: `ImposterDiscussionPhase`, `ImposterVotingPhase`, `ImposterRevealPhase`, `ImposterScoringPhase`

#### Configuration (`config/constants.ts`)

-   Server settings (port, update intervals)
-   CORS configuration
-   Game configuration constants

#### Utilities (`utils/helpers.ts`)

-   `randomArrayItem<T>()`: Select random items from arrays
-   `generateGameId()`: Create unique game session IDs

### Game Modes

#### Imposter Game (`games/imposter.ts`)

A social deduction game where players try to identify the imposter:

-   One player receives a different word than the others
-   Players discuss and vote on who they think is the imposter
-   Phases: Discussion → Voting → Reveal → Scoring

**Functions:**

-   `imposterStartGame()`: Initialize a new Imposter game
-   `imposterHandleAction()`: Process player actions during the game

## API Endpoints

### Game Management

#### `POST /api/game`

Create a new game session.

-   **Body**: `{ playerId: string, nickname: string }`
-   **Response**: `{ gameId: string }`

#### `POST /api/game/:gameId/join`

Join an existing game.

-   **Body**: `{ playerId: string, nickname: string }`
-   **Response**: `{ success: boolean, gameId: string }`

#### `POST /api/game/:gameId/leave`

Leave a game session.

-   **Body**: `{ playerId: string }`
-   **Response**: `{ success: boolean, gameId: string }`

#### `GET /api/game/:gameId/state`

Get current game state.

-   **Response**: `{ success: boolean, gameId: string, state: GameState }`

### Game Control

#### `POST /api/game/:gameId/start`

Start a game (host only).

-   **Body**: `{ playerId: string, gameMode: string }`
-   **Response**: `{ success: boolean, gameId: string }`

#### `POST /api/game/:gameId/action`

Perform a game action.

-   **Body**: `{ action: string, details: object, playerId: string }`
-   **Response**: `{ success: boolean, gameId: string, action: string, details: object, playerId: string }`

**Imposter Actions:**

-   `wantsToVote`: Signal readiness to vote
-   `vote`: Cast a vote (`details: { target: playerId }`)
-   `endVoting`: End voting and reveal results
-   `reset`: Reset game to lobby (host only)

## WebSocket Events

### Client → Server

-   `register`: Register player ID with socket connection
    ```typescript
    socket.emit('register', playerId);
    ```

### Server → Client

-   `<gameId>`: Game state update
    ```typescript
    socket.on(gameId, (state: GameState) => {
        // Handle state update
    });
    ```

## Running the Server

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Configuration

Edit `src/config/constants.ts` to configure:

-   Server port (default: 8080)
-   Game state update interval (default: 1000ms)
-   CORS settings (should be restricted in production)

## Code Standards

-   **Documentation**: All functions have JSDoc comments
-   **Type Safety**: Strict TypeScript configuration
-   **Error Handling**: Comprehensive error responses
-   **Code Organization**: Modular structure with separation of concerns

## Future Enhancements

Potential areas for expansion:

-   Additional game modes
-   Persistent storage (database integration)
-   Player authentication
-   Game history and statistics
-   Advanced error logging
-   Rate limiting
-   Environment-based configuration
