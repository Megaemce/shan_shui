import SvgPolyline from "./SvgPolyline";
import IComplexSvg from "../interfaces/IComplexSvg";

/**
 * Represents a complex SVG.
 * @implements {IComplexSvg}
 */
export default class ComplexSvg implements IComplexSvg {
    elements: Array<SvgPolyline> = [];

    /**
     * Adds an object to the elements array.
     *
     * @param {SvgPolyline | ComplexSvg} object - The object to be added to this.elements
     */
    add(object: SvgPolyline | ComplexSvg) {
        if (object instanceof SvgPolyline) {
            this.elements.push(object);
        } else {
            this.elements = this.elements.concat(object.elements);
        }
    }

    /**
     * Adds an object at the beginning of elements array.
     * This way object will be rendered first, thus being a background.
     *
     * @param {SvgPolyline | ComplexSvg} object - The object to be added to this.elements
     */
    addAtStart(object: SvgPolyline | ComplexSvg) {
        if (object instanceof SvgPolyline) {
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
    render(): string {
        return this.elements.map((element) => element.render()).join("\n");
    }
}
