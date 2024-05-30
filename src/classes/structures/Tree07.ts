import Blob from "../elements/Blob";
import Structure from "../Structure";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Element from "../Element";
import { midPoint, triangulate } from "../../utils/polytools";
/**
 * Class representing a generator for a tree structure with a specific pattern.
 */
export default class Tree07 extends Structure {
    /**
     * Generates a tree structure with a specific pattern.
     * @param {number} xOffset - X-coordinate offset.
     * @param {number} yOffset - Y-coordinate offset.
     * @param {number} height - Height of the tree.
     */
    constructor(xOffset: number, yOffset: number, height: number = 60) {
        super();

        const resolution = 10;
        const strokeWidth: number = 4;
        const lines = new Array<Point>(resolution * 2);
        const bendingAngle: (x: number) => number = (x: number) =>
            0.2 * Math.sqrt(x);

        let T: Point[][] = [];

        for (let i = 0; i < resolution; i++) {
            const newX = xOffset + bendingAngle(i / resolution) * 100;
            const newY = yOffset - (i * height) / resolution;

            if (i >= resolution / 4) {
                for (let j = 0; j < 1; j++) {
                    const bfunc = function (x: number) {
                        return x <= 1
                            ? 2.75 * x * Math.pow(1 - x, 1 / 1.8)
                            : 2.75 * (x - 2) * Math.pow(x - 1, 1 / 1.8);
                    };
                    const bpl = new Blob(
                        newX +
                            PRNG.random(-0.3, 0.3) *
                                strokeWidth *
                                (resolution - i),
                        newY + PRNG.random(-0.25, 0.25) * strokeWidth,
                        PRNG.random(0, -Math.PI / 6),
                        undefined,
                        PRNG.random(20, 70),
                        PRNG.random(12, 24),
                        0.5,
                        bfunc,
                        true
                    );

                    T = T.concat(triangulate(bpl.points, 50, true, false));
                }
            }

            lines[i] = new Point(
                newX +
                    (Perlin.noise(i * 0.5) - 0.5) * strokeWidth -
                    strokeWidth / 2,
                newY
            );
            lines[lines.length - 1 - i] = new Point(
                newX +
                    (Perlin.noise(i * 0.5, 0.5) - 0.5) * strokeWidth +
                    strokeWidth / 2,
                newY
            );
        }

        T = triangulate(lines, 50, true, true).concat(T);

        for (let k = 0; k < T.length; k++) {
            const m = midPoint(T[k]);
            const c = (Perlin.noise(m.x * 0.02, m.y * 0.02) * 200 + 50) | 0;
            const co = `rgba(${c},${c},${c},0.8)`;
            this.addAtStart(new Element(T[k], 0, 0, co, co));
        }
    }
}
