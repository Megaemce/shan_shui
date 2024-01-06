import ChunkCache from "../classes/ChunkCache";

/**
 * Represents the properties for the ScrollableCanvas component.
 *
 * @interface
 */
export interface IScrollableCanvas {
    /**
     * The step value used in the settings.
     *
     * @type {number}
     */
    step: number;

    /**
     * Function to scroll the canvas horizontally by a specified value.
     *
     * @function
     * @param {number} value - The amount to scroll horizontally.
     */
    horizontalScroll: (value: number) => void;

    /**
     * The height of the canvas.
     *
     * @type {number}
     */
    windowHeight: number;

    /**
     * The current x-coordinate of the canvas.
     *
     * @type {number}
     */
    currentPosition: number;

    /**
     * The width of the canvas.
     *
     * @type {number}
     */
    windowWidth: number;

    /**
     * PRNG (Pseudo-Random Number Generator) instance.
     *
     * @type {PRNG}
     */

    /**
     * ChunkCache instance for caching and managing chunks.
     *
     * @type {ChunkCache}
     */
    chunkCache: ChunkCache;
}
