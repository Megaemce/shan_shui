import ILayer from "../interfaces/ILayer";
import { LayerType } from "../types/LayerType";

/**
 * Represents a design chunk with tag and coordinates.
 */

export default class SketchLayer implements ILayer {
    /** The tag associated with the design chunk. */
    tag: LayerType = "?";
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
    constructor(tag: LayerType, x: number, y: number, height: number = 0) {
        this.tag = tag;
        this.x = x;
        this.y = y;
    }
}
