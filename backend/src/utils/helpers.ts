/**
 * Utility functions used across the backend.
 */

/**
 * Selects a random item from an array.
 *
 * @template T - The type of items in the array
 * @param items - Array to select from
 * @returns A random item from the array, or undefined if the array is empty
 *
 * @example
 * ```typescript
 * const fruits = ['apple', 'banana', 'orange'];
 * const random = randomArrayItem(fruits); // returns one of the fruits
 * ```
 */
export const randomArrayItem = <T>(items: T[]): T | undefined => {
    if (!items || items.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
};

/**
 * Generates a random alphanumeric game ID.
 *
 * @param length - The length of the ID to generate (default: 6)
 * @returns A random alphanumeric string
 *
 * @example
 * ```typescript
 * const gameId = generateGameId(); // returns something like "a7x9k2"
 * ```
 */
export const generateGameId = (length: number = 6): string => {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length);
};
