import Structure from "../Structure";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Element from "../Element";
import { expand } from "../../utils/utils";
import { generateBezierCurve } from "../../utils/utils";
/**
 * Class representing a cloth SVG polyline.
 */
export default class Cloth extends Structure {
    /**
     * Constructs a Cloth instance.
     * @param {(p: Point) => Point} toGlobal - Function to convert local points to global points.
     * @param {Point[]} pointArray - Array of points defining the cloth shape.
     * @param {(v: number) => number} fun - The scaling function.
     */
    constructor(
        toGlobal: (p: Point) => Point,
        pointArray: Point[],
        fun: (v: number) => number
    ) {
        super();
        const tlist = generateBezierCurve(pointArray);
        const [tlist1, tlist2] = expand(tlist, fun);

        const clothPoints = tlist1.concat(tlist2.reverse()).map(toGlobal);

        this.add(new Element(clothPoints, 0, 0, "white"));

        // Additional strokes
        const stroke1 = new Stroke(
            tlist1.map(toGlobal),
            "rgba(100,100,100,0.5)",
            "rgba(100,100,100,0.5)",
            1
        );

        const stroke2 = new Stroke(
            tlist2.map(toGlobal),
            "rgba(100,100,100,0.6)",
            "rgba(100,100,100,0.6)",
            1
        );

        this.add(stroke1);
        this.add(stroke2);
    }
}
