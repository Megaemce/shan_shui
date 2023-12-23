import ISvgElement from "../interfaces/ISvgElement";
import ISvgAttributes from "../interfaces/ISvgAttributes";
import { attributesToString } from "../utils/utils";

/**
 * Represents a text element in SVG.
 */

export default class SvgText implements ISvgElement {
    /** Attribute object for additional SVG attributes. */
    attr: Partial<ISvgAttributes> = {};
    /** The content of the text element. */
    content: string = "";

    /**
     * Initializes a new instance of the SvgText class.
     * @param content - The content of the text element.
     * @param attr - Attribute object for additional SVG attributes.
     */
    constructor(content: string, attr: Partial<ISvgAttributes>) {
        this.content = content;
        this.attr = attr;
    }

    /**
     * Renders the text element as a string.
     * @returns The string representation of the text element.
     */
    render() {
        const attrstr = attributesToString(this.attr);
        return `<text ${attrstr}>${this.content}</text>`;
    }
}
