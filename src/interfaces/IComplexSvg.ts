import ComplexSvg from "../classes/ComplexSvg";
import SvgPolyline from "../classes/SvgPolyline";

/**
 * Represents an interface for a ComplexSvg.
 *
 * @interface
 */
export default interface IComplexSvg {
    /**
     * An array of SvgPolyline elements.
     *
     * @type {Array<SvgPolyline>}
     */
    elements: Array<SvgPolyline>;

    /**
     * Renders the ComplexSvg and returns the resulting SVG string.
     *
     * @function
     * @returns {string} The SVG string representation.
     */
    render: () => string;

    /**
     * Adds an SvgPolyline or ComplexSvg to the ComplexSvg.
     *
     * @function
     * @param {SvgPolyline | ComplexSvg} object - The object to be added.
     */
    add: (object: SvgPolyline | ComplexSvg) => void;
}
