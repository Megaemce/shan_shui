import PRNG from "../classes/PRNG";
import ChunkCache from "../classes/ChunkCache";

/**
 * Represents the properties for the ScrollableCanvas component.
 */
export interface IScrollableCanvas {
    /** Function to scroll the canvas by a specified value. */
    horizontalScroll: (value: number) => void;
    /** The height of the canvas. */
    windowHeight: number;
    /** The background image URL for the canvas. */
    background: string | undefined;
    /** The seed value for random number generation. */
    seed: string;
    /** The current x-coordinate of the canvas. */
    currentPosition: number;
    /** The width of the canvas. */
    windowWidth: number;
    /** PRNG (Pseudo-Random Number Generator) instance. */
    prng: PRNG;
    /** ChunkCache instance for caching and managing chunks. */
    chunkCache: ChunkCache;
}
