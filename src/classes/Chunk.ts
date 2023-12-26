import { ChunkTag } from "../types/ChunkTag";
import IChunk from "../interfaces/IChunk";
import ComplexSvg from "./ComplexSvg";

/**
 * Represents a chunk of terrain with SVG elements.
 */
export default class Chunk extends ComplexSvg implements IChunk {
    /** The tag associated with the chunk. */
    tag: ChunkTag = "?";
    /** The x-coordinate of the chunk. */
    x: number = 0;
    /** The y-coordinate of the chunk. */
    y: number = 0;
    /** The SVG elements that make up the chunk. */
    /**
     * Creates an instance of Chunk.
     * @param tag - The tag associated with the chunk.
     * @param x - The x-coordinate of the chunk.
     * @param y - The y-coordinate of the chunk.
     * @param elements - The SVG elements that make up the chunk.
     */
    constructor(tag: ChunkTag = "?", x: number = 0, y: number = 0) {
        super();
        this.tag = tag;
        this.x = x;
        this.y = y;
    }
}
