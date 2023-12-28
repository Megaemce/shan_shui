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
            this.elements = this.elements.concat(object);
        } else {
            this.elements = this.elements.concat(object.elements);
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
