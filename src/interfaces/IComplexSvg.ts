import SvgPolyline from "../classes/SvgPolyline";
import SvgText from "../classes/SvgText";
import ComplexSvg from "../classes/ComplexSvg";

export interface IComplexSvg {
    elements: SvgPolyline[];
    render: () => string;
    add: (object: SvgPolyline | ComplexSvg | SvgText) => void;
}
