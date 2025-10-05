export type Player = {
    id: string;
    nickname: string;
    isHost: boolean;
    score: number;
};

export type ImposterDiscussionPhase = {
    phase: 'discussion';
    wantsToVote: string[];
};

export type ImposterVotingPhase = {
    phase: 'voting';
    votes: Record<string, string | null>;
};

export type ImposterRevealPhase = {
    phase: 'reveal';
    votes: Record<string, string | null>;
};

export type ImposterScoringPhase = {
    phase: 'scoring';
    outcome: 'imposter_win' | 'imposter_close' | 'crewmate_win';
};

export type ImposterGame = {
    gameMode: 'imposter';
    phase: ImposterDiscussionPhase | ImposterVotingPhase | ImposterRevealPhase | ImposterScoringPhase;
    word: string;
    hint: string;
    imposter: string;
    beginner: string;
};

export type GameState = {
    gameId: string;
    players: Array<Player>;

    gameDetails:
        | ({
              activePlayers: string[];
          } & ImposterGame)
        | null;
};
