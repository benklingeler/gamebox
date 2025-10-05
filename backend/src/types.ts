/**
 * Represents a player in the game session.
 */
export type Player = {
    /** Unique identifier for the player */
    id: string;
    /** Display name chosen by the player */
    nickname: string;
    /** Whether this player is the host (can start games, etc.) */
    isHost: boolean;
    /** Player's current score */
    score: number;
};

/**
 * Discussion phase of the Imposter game where players talk and decide when to vote.
 */
export type ImposterDiscussionPhase = {
    /** Current phase identifier */
    phase: 'discussion';
    /** Array of player IDs who want to proceed to voting */
    wantsToVote: string[];
};

/**
 * Voting phase where players cast their votes for who they think is the imposter.
 */
export type ImposterVotingPhase = {
    /** Current phase identifier */
    phase: 'voting';
    /** Map of player IDs to their vote targets (player ID or null if not voted) */
    votes: Record<string, string | null>;
};

/**
 * Reveal phase where voting results are shown to all players.
 */
export type ImposterRevealPhase = {
    /** Current phase identifier */
    phase: 'reveal';
    /** Map of player IDs to their vote targets */
    votes: Record<string, string | null>;
};

/**
 * Scoring phase showing the outcome of the round.
 */
export type ImposterScoringPhase = {
    /** Current phase identifier */
    phase: 'scoring';
    /** Outcome of the round */
    outcome: 'imposter_win' | 'imposter_close' | 'crewmate_win';
};

/**
 * Complete game state for the Imposter game mode.
 * In this game, one player is the imposter who receives a different word than everyone else.
 */
export type ImposterGame = {
    /** Game mode identifier */
    gameMode: 'imposter';
    /** Current phase of the game */
    phase: ImposterDiscussionPhase | ImposterVotingPhase | ImposterRevealPhase | ImposterScoringPhase;
    /** The word that most players receive */
    word: string;
    /** A hint related to the word */
    hint: string;
    /** Player ID of the imposter */
    imposter: string;
    /** Player ID who starts the discussion */
    beginner: string;
};

/**
 * Main game state structure containing all information about a game session.
 */
export type GameState = {
    /** Unique identifier for the game session */
    gameId: string;
    /** List of all players in the game */
    players: Array<Player>;
    /** Current game details, null if no game is active */
    gameDetails:
        | ({
              /** List of player IDs who are still active in the current round */
              activePlayers: string[];
          } & ImposterGame)
        | null;
};
