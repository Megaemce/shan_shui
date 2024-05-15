import Element from "./Element";
import IStructure from "../interfaces/IStructure";
import Range from "./Range";

/**
 * Represents a complex SVG.
 *
 * @implements {IStructure}
 */
export default class Structure implements IStructure {
    elements: Array<Element> = [];
    range: Range = new Range(0, 0);

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

        // update the range if the new object is expanding beyond current range
        if (this.range.start > object.range.start) {
            this.range.start = object.range.start;
        }
        if (this.range.end < object.range.end) {
            this.range.end = object.range.end;
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

        // update the range if the new object is expanding beyond current range
        if (this.range.start > object.range.start) {
            this.range.start = object.range.start;
        }
        if (this.range.end < object.range.end) {
            this.range.end = object.range.end;
        }
    }
}
