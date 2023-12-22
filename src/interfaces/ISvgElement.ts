import { ISvgAttributes } from "./ISvgAttributes";

/**
 * Represents a generic SVG element.
 */

export interface ISvgElement {
    /** Attribute object for additional SVG attributes. */
    attr: Partial<ISvgAttributes>;
    /** Renders the SVG element as a string. */
    render: () => string;
}
