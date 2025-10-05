/**
 * ImposterDiscussion component for the discussion phase of the Imposter game.
 * Players discuss and decide when they're ready to vote.
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Player, GameState } from '../../utils/types';
import { faInfo, faVoteYea } from '@fortawesome/free-solid-svg-icons';
import { performGameAction } from '../../utils/api';
import { AnimatePresence, motion } from 'motion/react';

/**
 * Props for the ImposterDiscussion component.
 */
type Props = {
    /** Current game state */
    gameState: GameState;
    /** The current player */
    player: Player;
};

/**
 * Renders the discussion phase of the Imposter game.
 * Shows the player their word (or hint if they're the imposter) and allows them
 * to signal when they're ready to vote.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <ImposterDiscussion gameState={gameState} player={currentPlayer} />
 * ```
 */
export default function ImposterDiscussion({ gameState, player }: Props) {
    if (
        !gameState ||
        !gameState.gameDetails ||
        !gameState.gameDetails.phase ||
        gameState.gameDetails.phase.phase !== 'discussion'
    ) {
        return <div>Es gibt eine falsche Zuordnung des Gamestats zum Component.</div>;
    }

    const gameId = gameState.gameId;

    const isImposter = gameState.gameDetails.imposter === player.id;
    const wantsToVote = gameState.gameDetails.phase.wantsToVote;
    const wantsToVotePlayers = gameState.players.filter((p) => wantsToVote.includes(p.id));
    const playerWantsToVote = wantsToVote.includes(player.id);
    const beginner = gameState.players.find((p) => p.id === gameState.gameDetails?.beginner);

    const handleWantsToVote = () => {
        performGameAction(gameId, 'wantsToVote');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-lg">Aktuelle Phase: Diskussion</h2>
                <div className="flex gap-2 items-center text-gray-400">
                    <FontAwesomeIcon icon={faInfo} />
                    <p>Hier können die Spieler diskutieren und ihre Strategien planen.</p>
                </div>
            </div>
            <div className="h-0.5 w-full bg-gray-600" />
            <div className="flex flex-col gap-2">
                {isImposter ? (
                    <div className="p-4 bg-red-400/10 flex flex-col gap-2 text-center border-2 border-red-300">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm opacity-60">Dein Wort</p>
                            <p className="text-xl">{gameState.gameDetails.hint}</p>
                        </div>
                        <p className="text-red-300">
                            <b>Du bist der Imposter!</b> Dein Ziel: Täusche die anderen Spieler oder errate das richtige
                            Wort.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 bg-green-300/10 flex flex-col gap-2 text-center border-2 border-green-300">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm opacity-60">Dein Wort</p>
                            <p className="text-xl">{gameState.gameDetails.word}</p>
                        </div>
                        <p className="text-green-300">
                            <b>Du bist ein Crewmate!</b> Dein Ziel: Arbeite mit anderen zusammen, um den Imposter zu
                            finden.
                        </p>
                    </div>
                )}
            </div>
            <p>{beginner?.nickname} beginnt die Diskussion mit seinem ersten Wort.</p>
            <div className="h-0.5 w-full bg-gray-600" />
            <div className="flex flex-col gap-2">
                <button className="button w-full" onClick={handleWantsToVote}>
                    <FontAwesomeIcon icon={faVoteYea} />{' '}
                    {playerWantsToVote ? 'Ich habe abgestimmt' : 'Ich würde gerne abstimmen'}
                    <span className="opacity-60 text-sm tracking-widest">
                        ({wantsToVote.length}/{gameState.gameDetails.activePlayers.length})
                    </span>
                </button>
                <AnimatePresence>
                    {wantsToVotePlayers.length > 0 && (
                        <motion.div
                            className="flex flex-row items-center justify-center gap-6 p-4 bg-background overflow-hidden"
                            initial={{ opacity: 0, height: 0, padding: 0 }}
                            animate={{ opacity: 1, height: 'auto', padding: '16px' }}
                            exit={{ opacity: 0, height: 0, padding: 0 }}
                        >
                            <AnimatePresence>
                                {wantsToVotePlayers.map((player) => (
                                    <motion.div
                                        key={player.id}
                                        className="flex flex-col items-center gap-1"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                    >
                                        <img
                                            src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${player.nickname}`}
                                            alt="avatar"
                                            className="size-8 rounded-full"
                                        />
                                        <p className="text-gray-400">{player.nickname}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
