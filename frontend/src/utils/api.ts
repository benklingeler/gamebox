/**
 * API client for communicating with the Gamebox backend.
 * Handles all HTTP requests to the REST API endpoints.
 */

import { usePlayer } from './player';
import { GameState } from './types';

/**
 * Generic API response type with success/error handling.
 */
type ApiResponse<T> = (
    | {
          success: true;
      }
    | {
          success: false;
          error: string;
      }
) &
    T;

/**
 * Response type for game creation endpoint.
 */
type CreateGameResponse = {
    gameId: string;
};

/**
 * Creates a new game session with the current player as host.
 *
 * @returns Promise resolving to the created game ID
 *
 * @example
 * ```typescript
 * const { gameId } = await createGame();
 * navigate(`/game/${gameId}`);
 * ```
 */
export const createGame = async (): Promise<CreateGameResponse> => {
    const playerId = usePlayer.getState().id;
    const nickname = usePlayer.getState().nickname;

    const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerId,
            nickname,
        }),
    });
    return response.json() as Promise<CreateGameResponse>;
};

/**
 * Joins an existing game session.
 *
 * @param gameId - The ID of the game to join
 * @returns Promise resolving to the join response
 *
 * @example
 * ```typescript
 * const response = await joinGame('abc123');
 * if (response.success) {
 *   console.log('Successfully joined game!');
 * }
 * ```
 */
export const joinGame = async (gameId: string) => {
    const playerId = usePlayer.getState().id;
    const nickname = usePlayer.getState().nickname;

    const response = await fetch(`/api/game/${gameId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, nickname }),
    });
    return response.json();
};

/**
 * Leaves the current game session.
 *
 * @param gameId - The ID of the game to leave
 * @returns Promise resolving to the leave response
 *
 * @example
 * ```typescript
 * await leaveGame('abc123');
 * navigate('/');
 * ```
 */
export const leaveGame = async (gameId: string) => {
    const playerId = usePlayer.getState().id;

    const response = await fetch(`/api/game/${gameId}/leave`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerId,
        }),
    });
    return response.json();
};

/**
 * Fetches the current state of a game session.
 *
 * @param gameId - The ID of the game to fetch
 * @returns Promise resolving to the game state
 *
 * @example
 * ```typescript
 * const response = await getGameState('abc123');
 * if (response.success) {
 *   console.log('Game state:', response.state);
 * }
 * ```
 */
export const getGameState = async (gameId: string) => {
    const response = await fetch(`/api/game/${gameId}/state`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json() as Promise<ApiResponse<{ state: GameState }>>;
};

/**
 * Starts a game with the specified game mode. Only the host can start the game.
 *
 * @param gameId - The ID of the game to start
 * @param gameMode - The game mode to play (e.g., 'imposter')
 * @returns Promise resolving to the start response
 *
 * @example
 * ```typescript
 * await startGame('abc123', 'imposter');
 * ```
 */
export const startGame = async (gameId: string, gameMode: string) => {
    const playerId = usePlayer.getState().id;

    const response = await fetch(`/api/game/${gameId}/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerId,
            gameMode,
        }),
    });
    return response.json();
};

/**
 * Advances the game to the next phase. Only the host can advance.
 * Currently a placeholder endpoint.
 *
 * @param gameId - The ID of the game to advance
 * @returns Promise resolving to the advance response
 *
 * @example
 * ```typescript
 * await advanceGame('abc123');
 * ```
 */
export const advanceGame = async (gameId: string) => {
    const playerId = usePlayer.getState().id;

    const response = await fetch(`/api/game/${gameId}/advance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerId,
        }),
    });
    return response.json();
};

/**
 * Performs a game-specific action during gameplay.
 *
 * @param gameId - The ID of the game
 * @param action - The action type to perform (e.g., 'wantsToVote', 'vote', 'endVoting')
 * @param details - Additional data required for the action (default: {})
 * @returns Promise resolving to the action response
 *
 * @example
 * ```typescript
 * // Player wants to vote
 * await performGameAction('abc123', 'wantsToVote');
 *
 * // Player casts a vote
 * await performGameAction('abc123', 'vote', { target: 'player123' });
 *
 * // Reset the game
 * await performGameAction('abc123', 'reset');
 * ```
 */
export const performGameAction = async (gameId: string, action: string, details: Record<string, any> = {}) => {
    const playerId = usePlayer.getState().id;

    const response = await fetch(`/api/game/${gameId}/action`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, action, details }),
    });
    return response.json();
};
