/**
 * Player state management using Zustand.
 * Handles player identification and nickname persistence across sessions.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

/**
 * Player store state and actions.
 */
type PlayerStore = {
    /** Unique player identifier (UUID) */
    id: string;
    /** Player's chosen nickname */
    nickname: string;

    /**
     * Initializes a new unique player ID.
     * Should be called once on first app load.
     */
    initializeId: () => void;

    /**
     * Sets or updates the player's nickname.
     *
     * @param nickname - The new nickname to set
     */
    setNickname: (nickname: string) => void;
};

/**
 * Zustand store for player state management.
 * State is persisted to localStorage with the key 'player'.
 *
 * @example
 * ```typescript
 * // In a component
 * const { id, nickname, setNickname } = usePlayer();
 *
 * // Outside a component
 * const playerId = usePlayer.getState().id;
 * ```
 */
export const usePlayer = create(
    persist<PlayerStore>(
        (set, get) => ({
            id: '',
            nickname: '',

            initializeId: () => {
                const id = uuidv4();
                set({ id });
            },
            setNickname: (nickname: string) => {
                set({ nickname });
            },
        }),
        { name: 'player' }
    )
);
