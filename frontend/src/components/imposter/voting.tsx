/**
 * ImposterVoting component for the voting phase of the Imposter game.
 * Players cast their votes for who they think is the imposter.
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Player, GameState } from '../../utils/types';
import { faArrowRight, faInfo, faVoteYea } from '@fortawesome/free-solid-svg-icons';
import { performGameAction } from '../../utils/api';
import { AnimatePresence, motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

/**
 * Props for the ImposterVoting component.
 */
type Props = {
    /** Current game state */
    gameState: GameState;
    /** The current player */
    player: Player;
};

/**
 * Renders the voting phase of the Imposter game.
 * Shows all players and allows voting. Displays current votes.
 * Host can end voting when all players have voted.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <ImposterVoting gameState={gameState} player={currentPlayer} />
 * ```
 */
export default function ImposterVoting({ gameState, player }: Props) {
    if (
        !gameState ||
        !gameState.gameDetails ||
        !gameState.gameDetails.phase ||
        gameState.gameDetails.phase.phase !== 'voting'
    ) {
        return <div>Es gibt eine falsche Zuordnung des Gamestats zum Component.</div>;
    }

    const gameId = gameState.gameId;

    const isImposter = gameState.gameDetails.imposter === player.id;
    const votes = gameState.gameDetails.phase.votes;
    const players = gameState.players.filter((p) => gameState.gameDetails?.activePlayers.includes(p.id));
    const isHost = gameState.players.find((p) => p.id === player.id)?.isHost;

    const handleVote = (target: string) => {
        performGameAction(gameId, 'vote', { target });
    };

    const handleEndVoting = () => {
        performGameAction(gameId, 'endVoting');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-lg">Aktuelle Phase: Abstimmung</h2>
                <div className="flex gap-2 items-center text-gray-400">
                    <FontAwesomeIcon icon={faVoteYea} />
                    <p>
                        Wähle einen Spieler aus, den du verdächtigst. Der Spieler mit den meisten Stimmen wird
                        eliminiert.
                    </p>
                </div>
            </div>
            <div className="h-0.5 w-full bg-gray-600" />
            <div className="flex flex-col gap-2">
                {isImposter ? (
                    <div className="p-4 bg-red-400/10 flex flex-col gap-2 border-2 border-red-300">
                        <div className="flex flex-row gap-1 items-center">
                            <p className="text-xl flex-1">{gameState.gameDetails.hint}</p>
                            <p className="text-red-300">
                                <b>Du bist der Imposter!</b>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-green-300/10 flex flex-col gap-2 border-2 border-green-300">
                        <div className="flex flex-row gap-1 items-center">
                            <p className="text-xl flex-1">{gameState.gameDetails.word}</p>
                            <p className="text-green-300">
                                <b>Du bist ein Crewmate!</b>
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {players.map((votePlayer) => (
                    <div
                        key={votePlayer.id}
                        className={twMerge(
                            'p-4 bg-background flex gap-2 cursor-pointer',
                            votePlayer.id == player.id && 'opacity-60 cursor-no-drop'
                        )}
                        onClick={votePlayer.id == player.id ? undefined : () => handleVote(votePlayer.id)}
                    >
                        <div className="flex flex-col px-8 max-w-32 items-center gap-1">
                            <img
                                src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${votePlayer.nickname}`}
                                alt="avatar"
                                className="size-8 rounded-full"
                            />
                            <p className="text-sm text-gray-400 max-w-full line-clamp-1">{votePlayer.nickname}</p>
                        </div>
                        <div className="h-full w-0.5 bg-gray-600" />
                        <div className="flex-1 text-center flex flex-col gap-2">
                            <p>Gevotet von:</p>
                            <div className="flex gap-2">
                                {Object.entries(votes)
                                    .filter(([voterId, vote]) => vote === votePlayer.id)
                                    .map(([voterId, vote]) => {
                                        const voter = gameState.players.find((p) => p.id === voterId);
                                        return (
                                            <span key={voterId} title={voter?.nickname}>
                                                <img
                                                    src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${voter?.nickname}`}
                                                    alt="avatar"
                                                    className="size-6 rounded-full"
                                                />
                                            </span>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isHost && Object.keys(votes).length == gameState.gameDetails.activePlayers.length && (
                <button className="button" onClick={handleEndVoting}>
                    <FontAwesomeIcon icon={faArrowRight} />
                    Abstimmung auflösen
                </button>
            )}
        </div>
    );
}
