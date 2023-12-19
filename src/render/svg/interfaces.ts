/**
 * Represents styles for SVG elements.
 */
export interface ISvgStyles {
    /** Fill color of the SVG element. */
    fill: string;
    /** Stroke color of the SVG element. */
    stroke: string;
    /** Stroke width of the SVG element. */
    strokeWidth: number;
}

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

/**
 * Represents a generic SVG element.
 */
export interface ISvgElement {
    /** Attribute object for additional SVG attributes. */
    attr: Partial<ISvgAttributes>;
    /** Renders the SVG element as a string. */
    render: () => string;
}
