import { GameState } from '../types';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { WORD_LIST } from './wordlist';

const randomArrayItem = <T>(items: T[]): T | undefined => {
    if (!items || items.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
};

export const imposterStartGame = (gameState: GameState) => {
    if (!gameState) {
        throw new Error('Game not found');
    }

    const randomWord = randomArrayItem<{ word: string; hint: string }>(WORD_LIST);

    if (!randomWord) {
        throw new Error('No words available');
    }

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

export const imposterHandleAction = (
    gameState: GameState,
    action: string,
    details: Record<string, any>,
    playerId: string
) => {
    if (!gameState || gameState.gameDetails?.gameMode !== 'imposter') {
        throw new Error('Invalid game state or action');
    }

    switch (action) {
        case 'wantsToVote':
            if (gameState.gameDetails.phase.phase == 'discussion') {
                // Add player or remove from voting list
                if (!gameState.gameDetails.phase.wantsToVote.includes(playerId)) {
                    gameState.gameDetails.phase.wantsToVote.push(playerId);
                } else {
                    gameState.gameDetails.phase.wantsToVote = gameState.gameDetails.phase.wantsToVote.filter(
                        (id) => id !== playerId
                    );
                }

                // Check if all players want to vote
                if (gameState.gameDetails.phase.wantsToVote.length === gameState.gameDetails.activePlayers.length) {
                    gameState.gameDetails.phase = {
                        phase: 'voting',
                        votes: {},
                    };
                }
            }
            break;
        case 'vote':
            if (gameState.gameDetails.phase.phase == 'voting') {
                gameState.gameDetails.phase.votes[playerId] = details.target;
            }
            break;
        case 'endVoting':
            if (gameState.gameDetails.phase.phase == 'voting') {
                gameState.gameDetails.phase = {
                    phase: 'reveal',
                    votes: gameState.gameDetails.phase.votes,
                };
            }
            break;
        default:
            throw new Error('Unknown action');
    }

    return gameState;
};
