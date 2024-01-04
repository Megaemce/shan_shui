import IChunk from "../interfaces/IChunk";
import { ChunkTag } from "../types/ChunkTag";

/**
 * Represents a design chunk with tag and coordinates.
 */

export default class DesignChunk implements IChunk {
    /** The tag associated with the design chunk. */
    tag: ChunkTag = "?";
    /** The x-coordinate of the design chunk. */
    x: number = 0;
    /** The y-coordinate of the design chunk. */
    y: number = 0;

    /**
     * Creates an instance of DesignChunk.
     * @param tag - The tag associated with the design chunk.
     * @param x - The x-coordinate of the design chunk.
     * @param y - The y-coordinate of the design chunk.
     */
    constructor(tag: ChunkTag, x: number, y: number, height: number = 0) {
        this.tag = tag;
        this.x = x;
        this.y = y;
    }
}
