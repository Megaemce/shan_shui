import Structure from "../Structure";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Element from "../Element";
import { transformPointsAlongLine, flipPolyline } from "../../utils/polytools";

/**
 * Class for generating stick SVG polylines.
 */
export default class Stick extends Structure {
    /**
     * Generates a stick SVG polyline.
     * @param {Point} p0 - The start point.
     * @param {Point} p1 - The end point.
     * @param {boolean} [horizontalFlip=false] - Whether to horizontally flip the stick.
     */
    constructor(p0: Point, p1: Point, horizontalFlip: boolean = false) {
        super();

        const qlist1 = [];
        const length = 12;
        for (let i = 0; i < length; i++) {
            qlist1.push(
                new Point(
                    -Perlin.noise(i * 0.1, PRNG.random()) *
                        0.1 *
                        Math.sin((i / length) * Math.PI) *
                        5,
                    0 + i * 0.3
                )
            );
        }

        this.add(
            new Element(
                transformPointsAlongLine(
                    p0,
                    p1,
                    flipPolyline(qlist1, horizontalFlip)
                ),
                0,
                0,
                "rgba(0,0,0,0)",
                "rgba(100,100,100,0.5)",
                1
            )
        );
    }
}
