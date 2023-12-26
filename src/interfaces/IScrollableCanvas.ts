import PRNG from "../classes/PRNG";
import ChunkCache from "../classes/ChunkCache";

/**
 * Represents the properties for the ScrollableCanvas component.
 *
 * @interface
 */
export interface IScrollableCanvas {
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
     * The background image URL for the canvas.
     *
     * @type {string | undefined}
     */
    background: string | undefined;

    /**
     * The seed value for random number generation.
     *
     * @type {string}
     */
    seed: string;

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
    prng: PRNG;

    /**
     * ChunkCache instance for caching and managing chunks.
     *
     * @type {ChunkCache}
     */
    chunkCache: ChunkCache;
}