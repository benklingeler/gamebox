# Gamebox Frontend

A modern React-based frontend for the Gamebox multiplayer game platform, built with TypeScript, Vite, React Router, and Tailwind CSS.

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx                     # Application entry point and routing
│   ├── index.css                    # Global styles and Tailwind imports
│   ├── components/
│   │   ├── playerlist.tsx           # Player list component
│   │   └── imposter/
│   │       ├── discussion.tsx       # Imposter discussion phase
│   │       ├── voting.tsx           # Imposter voting phase
│   │       └── reveal.tsx           # Imposter reveal phase
│   ├── layouts/
│   │   └── base-layout.tsx          # Main application layout wrapper
│   ├── routes/
│   │   ├── home-route.tsx           # Landing page
│   │   ├── game-route.tsx           # Main game interface
│   │   └── nickname-route.tsx       # Nickname setup
│   └── utils/
│       ├── api.ts                   # Backend API client
│       ├── player.ts                # Player state management (Zustand)
│       ├── types.ts                 # TypeScript type definitions
│       └── constants.ts             # Application constants
├── public/
│   └── vite.svg
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Tech Stack

### Core

-   **React 19** - UI library
-   **TypeScript** - Type safety
-   **Vite (Rolldown)** - Build tool and dev server
-   **React Router 7** - Client-side routing

### State Management

-   **Zustand** - Lightweight state management with persistence

### Styling

-   **Tailwind CSS 4** - Utility-first CSS framework
-   **tailwind-merge** - Utility for merging Tailwind classes
-   **Framer Motion** - Animation library

### Real-time Communication

-   **Socket.IO Client** - WebSocket connection for real-time updates

### UI Components

-   **Font Awesome** - Icon library
-   **Lato Font** - Typography
-   **DiceBear Avatars** - Dynamic avatar generation

## Architecture

### State Management

#### Player State (`utils/player.ts`)

Uses Zustand with localStorage persistence:

-   `id`: Unique player UUID (generated once)
-   `nickname`: Player's chosen display name
-   `initializeId()`: Generate new player ID
-   `setNickname()`: Update nickname

```typescript
const { id, nickname, setNickname } = usePlayer();
```

### API Client (`utils/api.ts`)

All backend communication is handled through the API client:

**Game Management:**

-   `createGame()` - Create new game session
-   `joinGame(gameId)` - Join existing game
-   `leaveGame(gameId)` - Leave current game
-   `getGameState(gameId)` - Fetch current state

**Game Control:**

-   `startGame(gameId, gameMode)` - Start game (host only)
-   `performGameAction(gameId, action, details)` - Execute game action
-   `advanceGame(gameId)` - Advance to next phase (host only)

### Real-time Updates

WebSocket connection via Socket.IO provides real-time game state synchronization:

```typescript
const socket = io({ path: '/socket.io' });

// Register player
socket.emit('register', playerId);

// Listen for game state updates
socket.on(gameId, (state: GameState) => {
    setGameState(state);
});
```

### Routing

#### Routes

-   `/` - **HomeRoute**: Landing page with create/join options
-   `/game/:gameId` - **GameRoute**: Main game interface

#### Special Flows

-   **Nickname Check**: BaseLayout automatically shows NicknameRoute if no nickname is set
-   **Player Initialization**: Player ID is generated on first visit

### Component Structure

#### Layout Components

-   **BaseLayout**: Application shell with header, main area, and footer
    -   Manages player initialization
    -   Handles nickname requirement
    -   Provides navigation and player info display

#### Route Components

-   **HomeRoute**: Create or join game interface
-   **GameRoute**: Main game session handler
    -   WebSocket connection management
    -   Game state synchronization
    -   Host controls
    -   Phase-specific rendering
-   **NicknameRoute**: Nickname input and validation

#### Game Components

-   **PlayerList**: Displays all players with avatars and roles
-   **ImposterDiscussion**: Discussion phase UI
-   **ImposterVoting**: Voting phase UI with player selection
-   **ImposterReveal**: Results and winner announcement

### Type Safety

Full TypeScript coverage with shared types between frontend and backend:

```typescript
type Player = {
    id: string;
    nickname: string;
    isHost: boolean;
    score: number;
};

type GameState = {
    gameId: string;
    players: Player[];
    gameDetails: ImposterGame | null;
};
```

## Features

### Player Management

-   Persistent player ID across sessions
-   Customizable nicknames (3-20 characters)
-   Avatar generation based on nickname
-   Host privileges and indicators

### Game Session

-   Create new games
-   Join via game ID or shareable link
-   Real-time player list updates
-   Host controls for game management
-   Automatic host reassignment on disconnect

### Imposter Game Mode

#### Discussion Phase

-   Players see their word (or hint if imposter)
-   Role indication (Imposter/Crewmate)
-   Vote readiness tracking
-   Smooth transition to voting

#### Voting Phase

-   Grid layout of all players
-   Visual vote tracking
-   Cannot vote for yourself
-   Host controls to end voting

#### Reveal Phase

-   Imposter identity reveal
-   Vote count display
-   Winner determination
-   Play again option

## Development

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Server

-   Runs on `http://localhost:5173` by default
-   Hot module replacement (HMR) enabled
-   Proxies `/api/*` and `/socket.io/*` to backend

### Configuration

#### Vite (`vite.config.js`)

```javascript
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://localhost:8080',
            '/socket.io': {
                target: 'http://localhost:8080',
                ws: true,
            },
        },
    },
});
```

## Code Standards

-   **Documentation**: All components and functions have JSDoc comments
-   **Type Safety**: Strict TypeScript with no implicit any
-   **Component Structure**: Functional components with hooks
-   **Styling**: Tailwind utility classes with consistent spacing
-   **Naming**: Clear, descriptive names for components and functions

## Constants and Configuration

Centralized in `utils/constants.ts`:

-   Avatar configuration
-   Validation rules (nickname length, game ID length)
-   Game mode identifiers
-   Phase identifiers
-   Storage keys

## Accessibility

-   Semantic HTML elements
-   ARIA labels where appropriate
-   Keyboard navigation support
-   Color contrast compliance
-   Responsive design

## Performance Optimizations

-   Vite with Rolldown for fast builds
-   Code splitting via React Router
-   Lazy loading of components
-   Efficient re-rendering with React 19
-   Zustand for minimal state updates

## Browser Support

-   Modern browsers (Chrome, Firefox, Safari, Edge)
-   ES2020+ features required
-   WebSocket support required

## Future Enhancements

Potential areas for expansion:

-   Additional game modes
-   Voice chat integration
-   Game statistics and history
-   Custom avatar upload
-   Achievements and leaderboards
-   Mobile app (React Native)
-   Offline mode with local games
-   Accessibility improvements
-   Internationalization (i18n)

## Troubleshooting

### WebSocket Connection Issues

-   Ensure backend server is running on port 8080
-   Check proxy configuration in vite.config.js
-   Verify CORS settings on backend

### State Persistence Issues

-   Clear localStorage if experiencing issues
-   Check browser console for errors
-   Ensure zustand persist middleware is working

### Build Issues

-   Clear node_modules and reinstall
-   Check Node.js version (18+ required)
-   Verify all peer dependencies are installed
