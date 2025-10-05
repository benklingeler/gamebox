import { usePlayer } from './player';
import { GameState } from './types';

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

type CreateGameResponse = {
    gameId: string;
};
export const createGame = async () => {
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

export const getGameState = async (gameId: string) => {
    const response = await fetch(`/api/game/${gameId}/state`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json() as Promise<ApiResponse<{ state: GameState }>>;
};

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
