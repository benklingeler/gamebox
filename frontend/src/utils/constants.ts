/**
 * Application-wide constants and configuration values for the frontend.
 */

/**
 * Avatar configuration
 */
export const AVATAR_CONFIG = {
    /** Base URL for generating player avatars */
    BASE_URL: 'https://api.dicebear.com/9.x/avataaars-neutral/svg',
    /** Default size classes for avatars */
    SIZES: {
        SMALL: 'size-6',
        MEDIUM: 'size-8',
        LARGE: 'size-16',
    },
} as const;

/**
 * Validation constraints
 */
export const VALIDATION = {
    /** Minimum nickname length */
    NICKNAME_MIN_LENGTH: 3,
    /** Maximum nickname length */
    NICKNAME_MAX_LENGTH: 20,
    /** Maximum game ID length */
    GAME_ID_MAX_LENGTH: 10,
} as const;

/**
 * Game mode identifiers
 */
export const GAME_MODES = {
    IMPOSTER: 'imposter',
} as const;

/**
 * Game phase identifiers for Imposter game
 */
export const IMPOSTER_PHASES = {
    DISCUSSION: 'discussion',
    VOTING: 'voting',
    REVEAL: 'reveal',
    SCORING: 'scoring',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
    PLAYER: 'player',
} as const;
