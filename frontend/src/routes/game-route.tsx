/**
 * GameRoute component for the main game interface.
 * Handles game state management, WebSocket connections, and game-specific UI.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { advanceGame, getGameState, joinGame, leaveGame, performGameAction, startGame } from '../utils/api';
import { io } from 'socket.io-client';
import { usePlayer } from '../utils/player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faRefresh, faSignOut, faSpinner, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import PlayerList from '../components/playerlist';
import { GameState } from '../utils/types';
import ImposterDiscussion from '../components/imposter/discussion';
import ImposterVoting from '../components/imposter/voting';
import ImposterReveal from '../components/imposter/reveal';

/**
 * Main game route component.
 * Manages WebSocket connection for real-time updates, handles game state,
 * and renders game-specific components based on the current game mode and phase.
 *
 * Features:
 * - Real-time game state synchronization via WebSocket
 * - Game session management (join, leave, start)
 * - Host controls (start game, reset game)
 * - Game mode and phase routing (Imposter game phases)
 *
 * @returns React component
 *
 * @example
 * ```tsx
 * // Rendered by router for /game/:gameId
 * <GameRoute />
 * ```
 */
export default function GameRoute() {
    const { gameId } = useParams();
    const gID = gameId || '';

    const { id, nickname } = usePlayer();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gameState, setGetGameState] = useState<GameState | null>(null);

    const navigate = useNavigate();

    const initializeSocket = () => {
        console.log('Initializing WebSocket');

        const socket = io({
            path: '/socket.io',
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');

            socket.emit('register', id);
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        socket.on(gID, (state) => {
            console.log('Received game state update:', state);
            setGetGameState(state);
        });
    };

    const initializeGame = async () => {
        setLoading(true);

        const joinResponse = await joinGame(gID);

        if (!joinResponse.success) {
            setError(joinResponse.error);
            setLoading(false);
            return;
        }

        const stateResponse = await getGameState(gID);

        if (!stateResponse.success) {
            setError(stateResponse.error);
            setLoading(false);
            return;
        }

        setGetGameState(stateResponse.state);

        initializeSocket();
        setLoading(false);
    };

    const handleLeaveGame = async () => {
        console.log('Leaving Game');
        setLoading(true);

        const leaveResponse = await leaveGame(gID);

        if (!leaveResponse.success) {
            setError(leaveResponse.error);
            setLoading(false);
            return;
        }

        setGetGameState(null);
        setLoading(false);

        navigate('/');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/game/${gID}`);
    };

    const handleResetGame = () => {
        performGameAction(gID, 'reset');
    };

    const handleStartGame = (gameMode: string) => {
        startGame(gID, gameMode);
    };

    useEffect(() => {
        initializeGame();
    }, [gameId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading || !gameState) {
        return (
            <div>
                <FontAwesomeIcon icon={faSpinner} spin />
            </div>
        );
    }

    const isHost = gameState.players.find((player) => player.isHost)?.id === id;
    const gamePlayer = gameState.players.find((player) => player.id === id)!;

    return (
        <div className="flex items-start flex-1 flex-col gap-8">
            <div className="flex w-full items-center gap-2">
                <div className="flex-1 flex gap-4 items-center">
                    <p className="font-semibold text-lg">Spiel-ID: {gID}</p>
                    <button className="button button-ghost" onClick={handleCopyLink}>
                        <FontAwesomeIcon icon={faCopy} />
                        Spiel-Link teilen
                    </button>
                    {isHost && (
                        <button className="button button-ghost" onClick={handleResetGame}>
                            <FontAwesomeIcon icon={faRefresh} />
                            Spiel zurücksetzen (Host)
                        </button>
                    )}
                </div>
                <button className="button button-muted" onClick={handleLeaveGame}>
                    <FontAwesomeIcon icon={faSignOut} />
                    Spiel verlassen
                </button>
            </div>
            <div className="flex items-stretch w-full gap-8 flex-1">
                <div className="flex-2 bg-muted/30 p-6 flex flex-col gap-4">
                    {gameState.gameDetails ? (
                        gameState.gameDetails.gameMode == 'imposter' ? (
                            <>
                                {gameState.gameDetails.phase.phase == 'discussion' && (
                                    <ImposterDiscussion gameState={gameState} player={gamePlayer} />
                                )}
                                {gameState.gameDetails.phase.phase == 'voting' && (
                                    <ImposterVoting gameState={gameState} player={gamePlayer} />
                                )}
                                {gameState.gameDetails.phase.phase == 'reveal' && (
                                    <ImposterReveal gameState={gameState} player={gamePlayer} />
                                )}
                            </>
                        ) : (
                            <p>Unknown Game Type</p>
                        )
                    ) : isHost ? (
                        <div className="flex flex-col gap-4">
                            <p className="font-semibold">Welches Spiel soll gespielt werden?</p>
                            <button className="button" onClick={() => handleStartGame('imposter')}>
                                <FontAwesomeIcon icon={faUserSecret} /> Imposter
                            </button>
                        </div>
                    ) : (
                        <div className="bg-primary text-primary-foreground p-4 text-center">
                            <p className="font-semibold">Warten auf Spielstart...</p>
                            <p>
                                Der <b>Host {gameState.players.find((player) => player.isHost)?.nickname}</b> muss das
                                Spiel starten!
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex-1 bg-muted/30 p-6 flex flex-col gap-4">
                    <PlayerList players={gameState?.players || []} />
                </div>
            </div>
            {/* <div>{JSON.stringify(gameState)}</div> */}
        </div>
    );
}
