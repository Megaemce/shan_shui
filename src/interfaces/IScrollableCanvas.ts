import Renderer from "../classes/Renderer";

/**
 * Represents the properties for the ScrollableCanvas component.
 *
 * @interface
 */
export interface IScrollableCanvas {
    /**
     * The step value used in the settings.
     *
     * @type {number}
     */
    step: number;

    /**
     * Function to scroll the canvas horizontally by a specified value.
     *
     * @function
     * @param {number} value - The amount to scroll horizontally.
     */
    horizontalScroll: (value: number) => void;

    /**
     * The height of the canvas.
     *
     * @type {number}
     */
    windowHeight: number;

    /**
     * The new x-coordinate of the canvas.
     *
     * @type {number}
     */
    newPosition: number;

    /**
     * The width of the canvas.
     *
     * @type {number}
     */
    windowWidth: number;

    /**
     * Reference to Renderer.
     *
     * @type {Renderer}
     */
    renderer: Renderer;
}
