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
     * Returns the ComplexSvg string representation.
     *
     * @function
     * @returns {string} The SVG string representation.
     */
    stringify: () => string;

    /**
     * Adds an SvgPolyline or ComplexSvg to the ComplexSvg.
     *
     * @function
     * @param {SvgPolyline | ComplexSvg} object - The object to be added.
     */
    add: (object: SvgPolyline | ComplexSvg) => void;

    /**
     * Adds an object at the beginning of elements array.
     * This way object will be rendered first, thus being a background.
     * @function
     * @param {SvgPolyline | ComplexSvg} object - The object to be added at the beginning of this.elements
     */
    addAtStart: (object: SvgPolyline | ComplexSvg) => void;
}
