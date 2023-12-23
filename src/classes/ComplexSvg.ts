import { IComplexSvg } from "../interfaces/IComplexSvg";
import SvgPolyline from "./SvgPolyline";
import SvgText from "./SvgText";

export default class ComplexSvg implements IComplexSvg {
    elements: SvgPolyline[] = [];

    add(object: SvgPolyline | ComplexSvg | SvgText) {
        if (object instanceof SvgPolyline) this.elements.concat(object);
        else if (object instanceof ComplexSvg)
            this.elements.concat(object.elements);
    }

    /**
     * Renders the SVG representation of complex svg
     *
     * @returns {string} The SVG string.
     */
    render(): string {
        return this.elements.map((element) => element.render()).join("\n");
    }
}
