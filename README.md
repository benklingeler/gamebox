# Gamebox 🎮

A real-time multiplayer party game platform built with React, Node.js, and Socket.IO. Currently features the **Imposter** game mode - a social deduction game where players try to identify the imposter among them.

## 📋 Overview

Gamebox is a web-based multiplayer gaming platform that allows players to create and join game rooms to play party games together in real-time. The application uses WebSocket connections for instant game state synchronization across all connected players.

## ✨ Features

-   **🔄 Real-time Multiplayer**: WebSocket-based communication using Socket.IO for instant game state updates
-   **🎯 Game Modes**: Currently supports "Imposter" game (similar to social deduction games like Spyfall)
-   **🎲 Room System**: Create or join games using unique game IDs with automatic host management
-   **🎨 Modern UI**: Dark-themed interface built with React 19 and Tailwind CSS
-   **👤 Avatar System**: Auto-generated avatars using DiceBear API
-   **🐳 Docker Support**: Production-ready deployment with Docker and nginx
-   **🌐 German Language**: UI and game content in German
-   **📱 Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend

-   **React 19** - Latest React with modern features
-   **TypeScript/JSX** - Type-safe component development
-   **Vite** (Rolldown) - Lightning-fast build tooling
-   **Tailwind CSS 4** - Utility-first styling with custom design tokens
-   **Socket.IO Client** - WebSocket connections for real-time updates
-   **React Router 7** - Client-side routing
-   **Zustand** - Lightweight state management
-   **Motion** (Framer Motion) - Smooth animations and transitions
-   **FontAwesome** - Icon library
-   **Lato Font** - Custom typography

### Backend

-   **Node.js 20** - Modern JavaScript runtime
-   **Express 5** - HTTP server framework
-   **TypeScript** - Type-safe server code
-   **Socket.IO** - WebSocket server for real-time communication
-   **CORS** - Cross-origin resource sharing support
-   **ts-node-dev** - Development with hot reload

### DevOps

-   **Docker** - Multi-stage builds for optimized production images
-   **nginx** - Static file serving and reverse proxy
-   **Google Cloud Run** - Serverless container deployment
-   **PowerShell** - Automated deployment scripts

## 📁 Project Structure

```
gamebox/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── playerlist.tsx  # Player roster display
│   │   │   └── imposter/       # Imposter game-specific components
│   │   │       ├── discussion.tsx  # Discussion phase UI
│   │   │       ├── voting.tsx      # Voting phase UI
│   │   │       └── reveal.tsx      # Results reveal UI
│   │   ├── layouts/
│   │   │   └── base-layout.tsx # Main app layout wrapper
│   │   ├── routes/             # Page components
│   │   │   ├── home-route.tsx  # Landing/lobby page
│   │   │   ├── game-route.tsx  # Main game view
│   │   │   └── nickname-route.tsx  # Player setup
│   │   ├── utils/
│   │   │   ├── api.ts          # Backend API client
│   │   │   ├── player.ts       # Player state management (Zustand)
│   │   │   └── types.ts        # TypeScript type definitions
│   │   ├── main.tsx            # Application entry point
│   │   └── index.css           # Global styles and Tailwind
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js          # Vite configuration with proxy
│   └── eslint.config.js        # ESLint configuration
│
├── backend/                     # Node.js backend application
│   ├── src/
│   │   ├── games/
│   │   │   ├── imposter.ts     # Imposter game logic
│   │   │   └── wordlist.ts     # German word pairs database
│   │   ├── index.ts            # Express server & Socket.IO setup
│   │   └── types.ts            # Shared TypeScript types
│   ├── package.json
│   └── tsconfig.json           # TypeScript configuration
│
├── Dockerfile                   # Multi-stage production build
├── nginx.conf                   # nginx reverse proxy config
├── start.sh                     # Container startup script
├── deploy.ps1                   # Google Cloud deployment automation
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

-   **Node.js** 20 or higher
-   **npm** (comes with Node.js)
-   **Docker** (optional, for containerized deployment)

### Local Development

1. **Clone the repository**

    ```bash
    git clone https://github.com/benklingeler/gamebox.git
    cd gamebox
    ```

2. **Install backend dependencies**

    ```bash
    cd backend
    npm install
    ```

3. **Install frontend dependencies**

    ```bash
    cd ../frontend
    npm install
    ```

4. **Start the backend server** (in one terminal)

    ```bash
    cd backend
    npm run dev
    ```

    Backend runs on `http://localhost:8080`

5. **Start the frontend development server** (in another terminal)

    ```bash
    cd frontend
    npm run dev
    ```

    Frontend runs on `http://localhost:5173` with automatic proxy to backend

6. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

### Production Build (Local)

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Serve using a production server
```

### 🐳 Docker Deployment

**Quick Start:**

```bash
docker build -t gamebox .
docker run -p 80:80 gamebox
```

The application will be available at `http://localhost`

**Production Deployment (Google Cloud Run):**

```powershell
# Windows PowerShell
.\deploy.ps1
```

This script will:

1. Build the Docker image
2. Tag it for Google Artifact Registry
3. Push to the registry
4. Deploy to Cloud Run in `europe-west3` region

## 🎮 How to Play: Imposter Game

### Game Setup

1. **Create a Game**: Click "Neues Spiel erstellen" (Create New Game)
2. **Share Game ID**: Use "Spiel-Link teilen" to copy the game link
3. **Wait for Players**: Friends join using the game ID or shared link
4. **Start Game**: Host selects "Imposter" to begin

### Gameplay

**Objective:**

-   **Crewmates**: Identify the Imposter through discussion and voting
-   **Imposter**: Avoid detection or guess the correct word to win

**How It Works:**

1. All players except one receive the **same word** (e.g., "Hund" - Dog)
2. The Imposter receives a **similar hint word** (e.g., "Katze" - Cat)
3. Players take turns describing their word **without saying it directly**
4. After discussion, players vote on who they think is the Imposter
5. **Winning Conditions:**
    - Crewmates win if the Imposter receives the most votes
    - Imposter wins if they avoid detection or guess the correct word

### Game Phases

**1. Discussion Phase**

-   Players see their assigned word (or hint if they're the Imposter)
-   A designated player starts the discussion
-   Players describe their word using clues
-   When ready, players can indicate they want to vote
-   Voting begins automatically when all players are ready

**2. Voting Phase**

-   Each player selects who they suspect is the Imposter
-   Vote counts are hidden until reveal
-   Host can end voting once everyone has voted

**3. Reveal Phase**

-   The Imposter's identity is revealed
-   Vote tallies are displayed
-   Winner is determined based on voting results
-   Host can reset for a new round

## 🔌 API Documentation

### REST Endpoints

#### Create Game

```http
POST /api/game
Content-Type: application/json

{
  "playerId": "uuid",
  "nickname": "string"
}

Response: { "gameId": "string" }
```

#### Join Game

```http
POST /api/game/:gameId/join
Content-Type: application/json

{
  "playerId": "uuid",
  "nickname": "string"
}

Response: { "success": true, "gameId": "string" }
```

#### Leave Game

```http
POST /api/game/:gameId/leave
Content-Type: application/json

{
  "playerId": "uuid"
}

Response: { "success": true, "gameId": "string" }
```

#### Get Game State

```http
GET /api/game/:gameId/state

Response: {
  "success": true,
  "gameId": "string",
  "state": GameState
}
```

#### Start Game

```http
POST /api/game/:gameId/start
Content-Type: application/json

{
  "playerId": "uuid",
  "gameMode": "imposter"
}

Response: { "success": true, "gameId": "string" }
```

#### Perform Action

```http
POST /api/game/:gameId/action
Content-Type: application/json

{
  "playerId": "uuid",
  "action": "wantsToVote" | "vote" | "endVoting" | "reset",
  "details": {}
}

Response: { "success": true, "gameId": "string" }
```

### WebSocket Events

**Client → Server:**

-   `register` - Register player with their ID for receiving updates

**Server → Client:**

-   `{gameId}` - Game state updates broadcast to all players in a game

### Game State Type

```typescript
type GameState = {
    gameId: string;
    players: Array<{
        id: string;
        nickname: string;
        isHost: boolean;
        score: number;
    }>;
    gameDetails: {
        gameMode: 'imposter';
        activePlayers: string[];
        word: string; // The correct word
        hint: string; // The imposter's hint
        imposter: string; // Player ID of imposter
        beginner: string; // Player ID who starts discussion
        phase: {
            phase: 'discussion' | 'voting' | 'reveal' | 'scoring';
            // Phase-specific data...
        };
    } | null;
};
```

## 🔧 Configuration

### Development Proxy (Vite)

The frontend dev server (`vite.config.js`) proxies API and WebSocket requests to the backend:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/socket.io': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      ws: true,  // WebSocket support
    }
  }
}
```

### Production Routing (nginx)

In production, nginx routes requests:

-   `/` → Frontend static files
-   `/api/*` → Backend server (proxy)
-   `/socket.io/*` → WebSocket server (proxy with upgrade)

## 🏗️ Architecture

### State Management

-   **Frontend**: Zustand for player state (ID, nickname)
-   **Backend**: In-memory Map for game states
-   **Real-time Sync**: Socket.IO broadcasts game state updates every second

### Connection Flow

1. Player creates/joins game via REST API
2. Frontend establishes WebSocket connection
3. Player registers their ID via `register` event
4. Backend broadcasts game state updates to all connected players
5. On disconnect, player is removed from game state

### Auto-cleanup

-   Games are deleted when the last player leaves
-   Disconnected players are automatically removed from games
-   Host role is automatically reassigned if the host leaves

## 🎨 Word Database

The Imposter game includes a curated list of German word pairs in `backend/src/games/wordlist.ts`. Each pair consists of:

-   **Word**: The correct word given to crewmates
-   **Hint**: A similar word given to the imposter

Example pairs:

-   Hund (Dog) / Katze (Cat)
-   Auto (Car) / Motorrad (Motorcycle)
-   Pizza / Pasta

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC License

## 👤 Author

**Ben Klingeler**

-   GitHub: [@benklingeler](https://github.com/benklingeler)

## 🙏 Acknowledgments

-   DiceBear for the avatar API
-   The open-source community for the amazing tools and libraries

---

**Happy Gaming! 🎉**
