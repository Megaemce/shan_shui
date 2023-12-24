import { ChunkTag } from "../../types/ChunkTag";
import IChunk from "../../interfaces/IChunk";

/**
 * Represents a design chunk with tag, coordinates, and height information.
 */

export default class DesignChunk implements IChunk {
    /** The tag associated with the design chunk. */
    tag: ChunkTag = "?";
    /** The x-coordinate of the design chunk. */
    x: number = 0;
    /** The y-coordinate of the design chunk. */
    y: number = 0;
    /** The height information of the design chunk. */

    /**
     * Creates an instance of DesignChunk.
     * @param tag - The tag associated with the design chunk.
     * @param x - The x-coordinate of the design chunk.
     * @param y - The y-coordinate of the design chunk.
     */
    constructor(tag: ChunkTag, x: number, y: number) {
        this.tag = tag;
        this.x = x;
        this.y = y;
    }
}
