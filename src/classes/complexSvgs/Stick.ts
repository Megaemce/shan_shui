import ComplexSvg from "../ComplexSvg";
import Perlin from "../Perlin";
import Point from "../Point";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import { transformPolyline, flipPolyline } from "../../utils/polytools";

/**
 * Class for generating stick SVG polylines.
 */
export default class Stick extends ComplexSvg {
    /**
     * Generates a stick SVG polyline.
     *
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {Point} p0 - The start point.
     * @param {Point} p1 - The end point.
     * @param {boolean} [horizontalFlip=false] - Whether to horizontally flip the stick.
     */
    constructor(
        prng: PRNG,
        p0: Point,
        p1: Point,
        horizontalFlip: boolean = false
    ) {
        super();

        const qlist1 = [];
        const length = 12;
        for (let i = 0; i < length; i++) {
            qlist1.push(
                new Point(
                    -Perlin.noise(prng, i * 0.1, prng.random()) *
                        0.1 *
                        Math.sin((i / length) * Math.PI) *
                        5,
                    0 + i * 0.3
                )
            );
        }

        this.add(
            new SvgPolyline(
                transformPolyline(p0, p1, flipPolyline(qlist1, horizontalFlip)),
                0,
                0,
                "rgba(0,0,0,0)",
                "rgba(100,100,100,0.5)",
                1
            )
        );
    }
}
