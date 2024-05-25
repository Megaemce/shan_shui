import ILayer from "../interfaces/ILayer";
import { LayerType } from "../types/LayerType";

/**
 * Represents a design layer with tag and coordinates.
 */
export default class SketchLayer implements ILayer {
    /**
     * Creates an instance of sketch layer.
     *
     * @param {LayerType} [tag] - The tag associated with the design layer.
     * @param {number} [x=0] - The x-coordinate of the design layer.
     * @param {number} [y=0] - The y-coordinate of the design layer.
     */
    constructor(
        public tag: LayerType,
        public x: number = 0,
        public y: number = 0
    ) {}
}
