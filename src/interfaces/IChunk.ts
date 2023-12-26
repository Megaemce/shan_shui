import { ChunkTag } from "../types/ChunkTag";

/**
 * Represents an interface for a Chunk.
 *
 * @interface
 */
export default interface IChunk {
    /**
     * The tag associated with the Chunk.
     *
     * @type {ChunkTag}
     */
    tag: ChunkTag;

    /**
     * The x-coordinate of the Chunk.
     *
     * @type {number}
     */
    x: number;

    /**
     * The y-coordinate of the Chunk.
     *
     * @type {number}
     */
    y: number;
}
