import ISvgAttributes from "./ISvgAttributes";

/**
 * Represents a generic SVG element.
 *
 * @interface
 */
export default interface ISvgElement {
    /**
     * Attribute object for additional SVG attributes.
     *
     * @type {Partial<ISvgAttributes>}
     */
    attr: Partial<ISvgAttributes>;

    /**
     * Renders the SVG element as a string.
     *
     * @function
     * @returns {string} The SVG string representation.
     */
    render: () => string;
}
