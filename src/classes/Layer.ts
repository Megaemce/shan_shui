import Structure from "./Structure";
import ILayer from "../interfaces/ILayer";
import { LayerType } from "../types/LayerType";

/**
 * Represents a chunk of terrain with SVG elements.
 */
export default class Layer extends Structure implements ILayer {
    /** The tag associated with the chunk. */
    tag: LayerType = "?";
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
    constructor(tag: LayerType = "?", x: number = 0, y: number = 0) {
        super();
        this.tag = tag;
        this.x = x;
        this.y = y;
    }
}
