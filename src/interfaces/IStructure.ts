import Structure from "../classes/Structure";
import Element from "../classes/Element";

/**
 * Represents an interface for a ComplexSvg.
 *
 * @interface
 */
export default interface IStructure {
    /**
     * An array of Elements.
     *
     * @type {Array<Element>}
     */
    elements: Array<Element>;

    /**
     * Returns the ComplexSvg string representation.
     *
     * @function
     * @returns {string} The SVG string representation.
     */
    stringify: () => string;

    /**
     * Adds an Element or Structure to the given Structure.
     *
     * @function
     * @param {Element | Structure} object - The object to be added.
     */
    add: (object: Element | Structure) => void;

    /**
     * Adds an object at the beginning of elements array.
     * This way object will be rendered first, thus being a background.
     * @function
     * @param {Element | Structure} object - The object to be added at the beginning of this.elements
     */
    addAtStart: (object: Element | Structure) => void;
}
