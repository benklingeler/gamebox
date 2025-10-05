/**
 * HomeRoute component for the landing page.
 * Allows users to create a new game or join an existing one.
 */

import { faPlus, faSignIn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createGame } from '../utils/api';
import { useNavigate } from 'react-router';
import { useState } from 'react';

/**
 * Landing page route component.
 * Provides options to create a new game or join an existing game by ID.
 *
 * @returns React component
 *
 * @example
 * ```tsx
 * <HomeRoute />
 * ```
 */
export default function HomeRoute() {
    const [gameId, setGameId] = useState<string>('');

    const navigate = useNavigate();

    const handleCreateGame = async () => {
        const { gameId } = await createGame();

        navigate(`/game/${gameId}`);
    };

    const handleJoinGame = async () => {
        if (!gameId) return;

        navigate(`/game/${gameId}`);
    };

    return (
        <div className="flex gap-8">
            <button
                className="flex-1 flex items-center justify-center gap-2 flex-col text-lg bg-primary text-primary-foreground py-6 h-full cursor-pointer"
                onClick={handleCreateGame}
            >
                <FontAwesomeIcon icon={faPlus} className="text-2xl" />
                Neues Spiel erstellen
            </button>
            <div className="flex items-center">
                <p className="text-lg text-foreground/60">oder</p>
            </div>
            <div className="flex-1 flex gap-4 flex-col">
                <input
                    type="text"
                    placeholder="Spiel-ID"
                    className="bg-input text-input-foreground p-4 focus:outline-none text-center"
                    maxLength={10}
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                />
                <button
                    className="flex-1 flex items-center justify-center gap-2 flex-col text-lg bg-primary text-primary-foreground py-6 cursor-pointer"
                    onClick={handleJoinGame}
                >
                    <FontAwesomeIcon icon={faSignIn} className="text-2xl" /> Beitreten
                </button>
            </div>
        </div>
    );
}
