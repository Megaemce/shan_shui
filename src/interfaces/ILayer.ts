import { LayerType } from "../types/LayerType";

/**
 * Represents an interface for a Chunk.
 *
 * @interface
 */
export default interface ILayer {
    /**
     * The tag associated with the Chunk.
     *
     * @type {LayerType}
     */
    tag: LayerType;

    /**
     * The x-coordinate of the Chunk.
     *
     * @type {number}
     */
    x: number;

    /**
     * The y-coordinate of the Chunk.
     *
     * @type {number}
     */
    y: number;
}
