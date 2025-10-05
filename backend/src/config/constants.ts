/**
 * Application-wide constants and configuration values.
 */

/**
 * Server configuration
 */
export const SERVER_CONFIG = {
    /** Port the server listens on */
    PORT: 8080,
    /** Interval in milliseconds for pushing game state updates */
    GAME_STATE_UPDATE_INTERVAL: 1000,
} as const;

/**
 * CORS configuration
 */
export const CORS_CONFIG = {
    /** Allowed origins for CORS. Should be configured for production */
    ORIGIN: '*',
    /** Allowed HTTP methods */
    METHODS: ['GET', 'POST'] as string[],
} as const;

/**
 * Game-related constants
 */
export const GAME_CONFIG = {
    /** Default game ID length */
    GAME_ID_LENGTH: 6,
} as const;
