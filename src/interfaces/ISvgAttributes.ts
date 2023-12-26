import ISvgStyles from "./ISvgStyles";

/**
 * Represents attributes for SVG elements.
 *
 * @interface
 */
export default interface ISvgAttributes {
    /**
     * Style attributes for the SVG element.
     *
     * @type {Partial<ISvgStyles>}
     */
    style: Partial<ISvgStyles>;

    /**
     * Font size of the text element.
     *
     * @type {number}
     */
    fontSize: number;

    /**
     * Font family of the text element.
     *
     * @type {string}
     */
    fontFamily: string;

    /**
     * Text anchor attribute for the text element.
     *
     * @type {string}
     */
    textAnchor: string;

    /**
     * Transform attribute for the SVG element.
     *
     * @type {string}
     */
    transform: string;
}
