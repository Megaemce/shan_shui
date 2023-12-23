import Point from "../Point";
import PRNG from "../PRNG";
import { generateBezierCurve } from "../../utils/utils";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import { expand } from "../../utils/utils";
import ComplexSvg from "../ComplexSvg";
/**
 * Class representing a cloth SVG polyline.
 */
export default class Cloth extends ComplexSvg {
    /**
     * Constructs a Cloth instance.
     *
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {(p: Point) => Point} toGlobal - Function to convert local points to global points.
     * @param {Point[]} pointArray - Array of points defining the cloth shape.
     * @param {(v: number) => number} fun - The scaling function.
     */
    constructor(
        prng: PRNG,
        toGlobal: (p: Point) => Point,
        pointArray: Point[],
        fun: (v: number) => number
    ) {
        super();
        const tlist = generateBezierCurve(pointArray);
        const [tlist1, tlist2] = expand(tlist, fun);

        const clothPoints = tlist1.concat(tlist2.reverse()).map(toGlobal);

        this.add(new SvgPolyline(clothPoints, 0, 0, "white"));

        // Additional strokes
        const stroke1 = new Stroke(
            prng,
            tlist1.map(toGlobal),
            "rgba(100,100,100,0.5)",
            "rgba(100,100,100,0.5)",
            1
        );

        const stroke2 = new Stroke(
            prng,
            tlist2.map(toGlobal),
            "rgba(100,100,100,0.6)",
            "rgba(100,100,100,0.6)",
            1
        );

        this.add(stroke1);
        this.add(stroke2);
    }
}
