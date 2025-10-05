/**
 * ImposterReveal component for the reveal phase of the Imposter game.
 * Shows the imposter's identity and determines the winner.
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Player, GameState } from '../../utils/types';
import { faArrowRight, faInfo, faUsers, faUserSecret, faVoteYea } from '@fortawesome/free-solid-svg-icons';
import { performGameAction } from '../../utils/api';
import { twMerge } from 'tailwind-merge';

/**
 * Props for the ImposterReveal component.
 */
type Props = {
    /** Current game state */
    gameState: GameState;
    /** The current player */
    player: Player;
};

/**
 * Renders the reveal phase of the Imposter game.
 * Displays who the imposter was, the voting results, and determines the winner.
 * The crew wins if the imposter received the most votes (no ties).
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <ImposterReveal gameState={gameState} player={currentPlayer} />
 * ```
 */
export default function ImposterReveal({ gameState, player }: Props) {
    if (
        !gameState ||
        !gameState.gameDetails ||
        !gameState.gameDetails.phase ||
        gameState.gameDetails.phase.phase !== 'reveal'
    ) {
        return <div>Es gibt eine falsche Zuordnung des Gamestats zum Component.</div>;
    }

    const gameId = gameState.gameId;

    const isImposter = gameState.gameDetails.imposter === player.id;
    const players = gameState.players.filter((p) => gameState.gameDetails?.activePlayers.includes(p.id));
    const isHost = gameState.players.find((p) => p.id === player.id)?.isHost;
    const votes = gameState.gameDetails.phase.votes;

    const imposter = gameState.players.find((p) => p.id === gameState.gameDetails!.imposter);

    const votesAgainstImposter = Object.entries(votes).filter(([_, v]) => v === imposter?.id);
    const votesAgainstImposterCount = votesAgainstImposter.length;

    // Check if the imposter is the player with the most votes. When its a tie, the imposter wins
    const crewmatesWin =
        votesAgainstImposterCount >
        Math.max(
            ...Object.values(votes)
                .filter((v) => v !== imposter?.id)
                .map((vi) => Object.values(votes).filter((v) => v === vi).length)
        );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-lg">Aktuelle Phase: Auflösung</h2>
                <div className="flex gap-2 items-center text-gray-400">
                    <FontAwesomeIcon icon={faInfo} />
                    <p>Die Abstimmung ist vorbei. Die Ergebnisse werden jetzt bekannt gegeben.</p>
                </div>
            </div>
            <div className="h-0.5 w-full bg-gray-600" />
            <div className="p-4 bg-red-400/10 flex flex-col gap-2 border-2 border-red-300">
                <div className="flex flex-col gap-4 items-center">
                    <p className="uppercase text-red-300 tracking-widest font-semibold text-lg">Imposter</p>
                    <div className="flex flex-col items-center gap-2">
                        <img
                            src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${imposter?.nickname}`}
                            alt="avatar"
                            className="size-16 rounded-full"
                        />
                        <p className="text-lg">{imposter?.nickname}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
                <p>
                    Es gab {votesAgainstImposterCount} Stimmen gegen den Imposter.{' '}
                    {crewmatesWin ? 'Der Imposter wurde entlarvt!' : 'Der Imposter bleibt im Verborgenen.'}
                </p>
                <div className="flex gap-2">
                    {Object.entries(votes)
                        .filter(([_, v]) => v === imposter?.id)
                        .map(([playerId, _]) => {
                            const votePlayer = gameState.players.find((p) => p.id === playerId);
                            return (
                                <div key={playerId} className="flex items-center gap-2">
                                    <span key={votePlayer?.id} title={votePlayer?.nickname}>
                                        <img
                                            src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${votePlayer?.nickname}`}
                                            alt="avatar"
                                            className="size-6 rounded-full"
                                        />
                                    </span>
                                </div>
                            );
                        })}
                </div>
                {crewmatesWin ? (
                    <div className="text-green-300 flex items-center gap-2 text-lg">
                        <FontAwesomeIcon icon={faUsers} />
                        <p>Die Crew hat gewonnen!</p>
                    </div>
                ) : (
                    <div className="text-red-300 flex items-center gap-2 text-lg">
                        <FontAwesomeIcon icon={faUserSecret} />
                        <p>Der Imposter hat gewonnen!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
