/**
 * Imposter game mode implementation.
 *
 * In this game, players are given a word and a hint, except for one player (the imposter)
 * who receives a different word. Players discuss and try to identify the imposter through
 * conversation, then vote on who they think the imposter is.
 */

import { GameState } from '../types';
import { WORD_LIST } from './wordlist';
import { randomArrayItem } from '../utils/helpers';

/**
 * Initializes a new Imposter game with random word selection and role assignment.
 *
 * @param gameState - The current game state
 * @returns Updated game state with Imposter game initialized
 * @throws {Error} If game state is invalid or no words are available
 *
 * @example
 * ```typescript
 * const updatedState = imposterStartGame(currentGameState);
 * ```
 */
export const imposterStartGame = (gameState: GameState): GameState => {
    if (!gameState) {
        throw new Error('Game not found');
    }

    // Select a random word and hint from the word list
    const randomWord = randomArrayItem<{ word: string; hint: string }>(WORD_LIST);

    if (!randomWord) {
        throw new Error('No words available');
    }

    // Initialize the Imposter game state
    gameState.gameDetails = {
        gameMode: 'imposter',
        phase: {
            phase: 'discussion',
            wantsToVote: [],
        },
        activePlayers: gameState.players.map((player) => player.id),
        word: randomWord.word,
        hint: randomWord.hint,
        imposter: randomArrayItem(gameState.players)?.id!,
        beginner: randomArrayItem(gameState.players)?.id!,
    };

    return gameState;
};

/**
 * Handles player actions during an Imposter game.
 *
 * @param gameState - The current game state
 * @param action - The action type to perform ('wantsToVote', 'vote', 'endVoting')
 * @param details - Additional data required for the action (e.g., vote target)
 * @param playerId - The ID of the player performing the action
 * @returns Updated game state after processing the action
 * @throws {Error} If game state is invalid or action is unknown
 *
 * @example
 * ```typescript
 * // Player wants to vote
 * const updated = imposterHandleAction(state, 'wantsToVote', {}, playerId);
 *
 * // Player casts a vote
 * const updated = imposterHandleAction(state, 'vote', { target: 'player123' }, playerId);
 * ```
 */
export const imposterHandleAction = (
    gameState: GameState,
    action: string,
    details: Record<string, any>,
    playerId: string
): GameState => {
    if (!gameState || gameState.gameDetails?.gameMode !== 'imposter') {
        throw new Error('Invalid game state or action');
    }

    switch (action) {
        case 'wantsToVote':
            handleWantsToVote(gameState, playerId);
            break;
        case 'vote':
            handleVote(gameState, playerId, details);
            break;
        case 'endVoting':
            handleEndVoting(gameState);
            break;
        default:
            throw new Error('Unknown action');
    }

    return gameState;
};

/**
 * Handles a player indicating they want to vote.
 * If all active players want to vote, transitions to voting phase.
 *
 * @param gameState - The current game state
 * @param playerId - The ID of the player wanting to vote
 */
function handleWantsToVote(gameState: GameState, playerId: string): void {
    if (gameState.gameDetails?.gameMode !== 'imposter' || gameState.gameDetails.phase.phase !== 'discussion') {
        return;
    }

    const wantsToVoteList = gameState.gameDetails.phase.wantsToVote;

    // Toggle player's vote readiness
    if (!wantsToVoteList.includes(playerId)) {
        wantsToVoteList.push(playerId);
    } else {
        gameState.gameDetails.phase.wantsToVote = wantsToVoteList.filter((id) => id !== playerId);
    }

    // Transition to voting if all players are ready
    if (wantsToVoteList.length === gameState.gameDetails.activePlayers.length) {
        gameState.gameDetails.phase = {
            phase: 'voting',
            votes: {},
        };
    }
}

/**
 * Handles a player casting their vote.
 *
 * @param gameState - The current game state
 * @param playerId - The ID of the voting player
 * @param details - Object containing the target player ID
 */
function handleVote(gameState: GameState, playerId: string, details: Record<string, any>): void {
    if (gameState.gameDetails?.gameMode !== 'imposter' || gameState.gameDetails.phase.phase !== 'voting') {
        return;
    }

    gameState.gameDetails.phase.votes[playerId] = details.target;
}

/**
 * Ends the voting phase and transitions to the reveal phase.
 *
 * @param gameState - The current game state
 */
function handleEndVoting(gameState: GameState): void {
    if (gameState.gameDetails?.gameMode !== 'imposter' || gameState.gameDetails.phase.phase !== 'voting') {
        return;
    }

    gameState.gameDetails.phase = {
        phase: 'reveal',
        votes: gameState.gameDetails.phase.votes,
    };
}
