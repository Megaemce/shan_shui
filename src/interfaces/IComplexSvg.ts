import ComplexSvg from "../classes/ComplexSvg";
import SvgPolyline from "../classes/SvgPolyline";
import SvgText from "../classes/SvgText";

/**
 * Represents an interface for a ComplexSvg.
 *
 * @interface
 */
export default interface IComplexSvg {
    /**
     * An array of SvgPolyline elements.
     *
     * @type {Array<SvgPolyline | SvgText>}
     */
    elements: Array<SvgPolyline | SvgText>;

    /**
     * Renders the ComplexSvg and returns the resulting SVG string.
     *
     * @function
     * @returns {string} The SVG string representation.
     */
    render: () => string;

    /**
     * Adds an SvgPolyline, ComplexSvg, or SvgText to the ComplexSvg.
     *
     * @function
     * @param {SvgPolyline | ComplexSvg | SvgText} object - The object to be added.
     */
    add: (object: SvgPolyline | ComplexSvg | SvgText) => void;
}
