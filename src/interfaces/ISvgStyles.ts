/**
 * Represents styles for SVG elements.
 *
 * @interface
 */
export default interface ISvgStyles {
    /**
     * Fill color of the SVG element.
     *
     * @type {string}
     */
    fill: string;

    /**
     * Stroke color of the SVG element.
     *
     * @type {string}
     */
    stroke: string;

    /**
     * Stroke width of the SVG element.
     *
     * @type {number}
     */
    strokeWidth: number;
}
