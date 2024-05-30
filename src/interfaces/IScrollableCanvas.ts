import Renderer from "../classes/Renderer";

/**
 * Represents the properties for the ScrollableCanvas component.
 *
 * @interface
 */
export interface IScrollableCanvas {
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

    /**
     * SVG string of the main picture
     */
    svgContent: string;
    /**
     * Set SVG context of the main picture with the new value
     * @function
     * @param {string} svg - The SVG content.
     */
    setSvgContent: (svg: string) => void;
}
