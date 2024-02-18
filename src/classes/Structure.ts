import Element from "./Element";
import IStructure from "../interfaces/IStructure";

/**
 * Represents a complex SVG.
 *
 * @implements {IStructure}
 */
export default class Structure implements IStructure {
    elements: Array<Element> = [];

    /**
     * Adds an object to the elements array.
     *
     * @param {Element | Structure} object - The object to be added to this.elements
     */
    add(object: Element | Structure) {
        if (object instanceof Element) {
            this.elements.push(object);
        } else {
            this.elements = this.elements.concat(object.elements);
        }
    }

    /**
     * Adds an object at the beginning of elements array.
     * This way object will be rendered first, thus being a background.
     *
     * @param {Element | Structure} object - The object to be added to this.elements
     */
    addAtStart(object: Element | Structure) {
        if (object instanceof Element) {
            this.elements.unshift(object);
        } else {
            this.elements = object.elements.concat(this.elements);
        }
    }

    /**
     * Renders the SVG representation of the complex SVG.
     *
     * @returns {string} The SVG string.
     */
    stringify(): string {
        const result = this.elements.reduce((acc, element) => {
            acc += element.stringify + "\n";
            return acc;
        }, "");

        return result;
    }
}
