import { IComplexSvg } from "../interfaces/IComplexSvg";
import SvgPolyline from "./SvgPolyline";
import SvgText from "./SvgText";

/**
 * Represents a complex SVG.
 * @implements {IComplexSvg}
 */
export default class ComplexSvg implements IComplexSvg {
    elements: Array<SvgPolyline | SvgText> = [];

    /**
     * Adds an object to the elements array.
     *
     * @param {SvgPolyline | ComplexSvg | SvgText} object - The object to be added to this.elements
     */
    add(object: SvgPolyline | ComplexSvg | SvgText) {
        if (object instanceof SvgPolyline) {
            this.elements = this.elements.concat(object);
        } else if (object instanceof ComplexSvg) {
            this.elements = this.elements.concat(object.elements);
        } else {
            this.elements = this.elements.concat(object);
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
