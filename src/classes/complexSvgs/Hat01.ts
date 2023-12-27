import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";
import { transformPolyline, flipPolyline } from "../../utils/polytools";

/**
 * Class representing a hat (version 01) using procedural generation.
 */
export default class Hat01 extends ComplexSvg {
    /**
     * Constructs a Hat01 instance.
     * @param {Point} p0 - The starting point of the line segment.
     * @param {Point} p1 - The ending point of the line segment.
     * @param {boolean} [horizontalFlip=false] - Indicates whether to horizontally flip the hat.
     */
    constructor(p0: Point, p1: Point, horizontalFlip: boolean = false) {
        super();
        const shapePoint = [
            new Point(-0.3, 0.5),
            new Point(0.3, 0.8),
            new Point(0.2, 1),
            new Point(0, 1.1),
            new Point(-0.3, 1.15),
            new Point(-0.55, 1),
            new Point(-0.65, 0.5),
        ];
        const hatShape = transformPolyline(
            p0,
            p1,
            flipPolyline(shapePoint, horizontalFlip)
        );

        this.add(new SvgPolyline(hatShape, 0, 0, "rgba(100,100,100,0.8)"));

        const qlist1: Point[] = [];

        for (let i = 0; i < 10; i++) {
            qlist1.push(
                new Point(
                    -0.3 - Perlin.noise(i * 0.2, PRNG.random()) * i * 0.1,
                    0.5 - i * 0.3
                )
            );
        }

        const noiseShape = transformPolyline(
            p0,
            p1,
            flipPolyline(qlist1, horizontalFlip)
        );

        this.add(
            new SvgPolyline(
                noiseShape,
                0,
                0,
                "rgba(0, 0, 0, 0)",
                "rgba(100,100,100,0.8)",
                1
            )
        );
    }
}
