import { ISvgStyles } from "./ISvgStyles";

/**
 * Represents attributes for SVG elements.
 */

export interface ISvgAttributes {
    /** Style attributes for the SVG element. */
    style: Partial<ISvgStyles>;
    /** Font size of the text element. */
    fontSize: number;
    /** Font family of the text element. */
    fontFamily: string;
    /** Text anchor attribute for the text element. */
    textAnchor: string;
    /** Transform attribute for the SVG element. */
    transform: string;
}
