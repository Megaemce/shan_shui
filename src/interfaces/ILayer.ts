import { LayerType } from "../types/LayerType";

/**
 * Represents an interface for a Layer.
 *
 * @interface
 */
export default interface ILayer {
    /**
     * The tag associated with the Layer.
     *
     * @type {LayerType}
     */
    tag: LayerType;

    /**
     * The x-coordinate of the Layer.
     *
     * @type {number}
     */
    x: number;

    /**
     * The y-coordinate of the Layer.
     *
     * @type {number}
     */
    y: number;
}
