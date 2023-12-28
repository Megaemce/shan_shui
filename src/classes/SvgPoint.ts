import IPoint from "../interfaces/IPoint";
import ISvgElement from "../interfaces/ISvgElement";

/**
 * Represents a point in SVG coordinates.
 *
 * @implements {ISvgElement} - Interface representing an SVG element.
 * @implements {IPoint} - Interface representing a point in coordinates.
 */
export default class SvgPoint implements ISvgElement, IPoint {
    /**
     * The x-coordinate of the point.
     * @type {number}
     */
    x: number;

    /**
     * The y-coordinate of the point.
     * @type {number}
     */
    y: number;

    /**
     * Attribute object for additional SVG attributes.
     * @type {Record<string, any>}
     */
    attr: Record<string, any> = {};

    /**
     * Initializes a new instance of the SvgPoint class.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     */
    constructor(x: number, y: number) {
        /**
         * The x-coordinate of the point.
         * @type {number}
         */
        this.x = x;

        /**
         * The y-coordinate of the point.
         * @type {number}
         */
        this.y = y;
    }

    /**
     * Renders the point as a string.
     * @returns {string} The string representation of the point.
     */
    render(): string {
        // remove object after 1 second to save memory
        return `${this.x.toFixed(1)},${this.y.toFixed(1)}`;
    }
}
