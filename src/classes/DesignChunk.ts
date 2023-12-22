import { ChunkTag } from "../types/ChunkTag";
import { IChunk } from "../interfaces/IChunk";

/**
 * Represents a design chunk with tag, coordinates, and height information.
 */

export class DesignChunk implements IChunk {
    /** The tag associated with the design chunk. */
    tag: ChunkTag = "?";
    /** The x-coordinate of the design chunk. */
    x: number = 0;
    /** The y-coordinate of the design chunk. */
    y: number = 0;
    /** The height information of the design chunk. */
    height: number = 0;

    /**
     * Creates an instance of DesignChunk.
     * @param tag - The tag associated with the design chunk.
     * @param x - The x-coordinate of the design chunk.
     * @param y - The y-coordinate of the design chunk.
     * @param height - The height information of the design chunk.
     */
    constructor(tag: ChunkTag, x: number, y: number, height: number = 0) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.height = height;
    }
}
