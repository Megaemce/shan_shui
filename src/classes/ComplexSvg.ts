import { IComplexSvg } from "../interfaces/IComplexSvg";
import SvgPolyline from "./SvgPolyline";
import SvgText from "./SvgText";

export default class ComplexSvg implements IComplexSvg {
    elements: Array<SvgPolyline | SvgText> = [];

    add(object: SvgPolyline | ComplexSvg | SvgText) {
        console.log("Adding object:", object);
        if (object instanceof SvgPolyline) this.elements.concat(object);
        else if (object instanceof ComplexSvg)
            this.elements.concat(object.elements);
        else this.elements.concat(object);
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
