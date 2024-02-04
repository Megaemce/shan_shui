import ILayer from "../interfaces/ILayer";
import { LayerType } from "../types/LayerType";

/**
 * Represents a design chunk with tag and coordinates.
 */
export default class SketchLayer implements ILayer {
    /**
     * Creates an instance of DesignChunk.
     * @param {LayerType} [tag="?"] - The tag associated with the design chunk.
     * @param {number} [x=0] - The x-coordinate of the design chunk.
     * @param {number} [y=0] - The y-coordinate of the design chunk.
     */
    constructor(
        public tag: LayerType = "?",
        public x: number = 0,
        public y: number = 0
    ) {}
}
