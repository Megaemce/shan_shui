import ILayer from "../interfaces/ILayer";
import Structure from "./Structure";
import { LayerType } from "../types/LayerType";

/**
 * Represents a layer of terrain with SVG elements.
 */
export default class Layer extends Structure implements ILayer {
    /**
     * Initializes a new instance with specified coordinates and tag.
     *
     * @param {LayerType} [tag] - The tag for the layer.
     * @param {number} [x=0] - The x-coordinate.
     * @param {number} [y=0] - The y-coordinate.
     */
    constructor(
        public tag: LayerType,
        public x: number = 0,
        public y: number = 0
    ) {
        super();
    }
}
