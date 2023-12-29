import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";
import { generateBlobPoints } from "../../utils/generateBlobPoints";
import { midPoint, triangulate } from "../../utils/polytools";

/**
 * Class representing a generator for a tree structure with a specific pattern.
 */
export default class Tree07 extends ComplexSvg {
    /**
     * Generates a tree structure with a specific pattern.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate offset.
     * @param y - Y-coordinate offset.
     * @param height - Height of the tree.
     */
    constructor(x: number, y: number, height: number = 60) {
        super();

        const reso = 10;
        const strokeWidth: number = 4;
        const lines = new Array<Point>(reso * 2);
        const bendingAngle: (x: number) => number = (x: number) =>
            0.2 * Math.sqrt(x);

        let T: Point[][] = [];

        for (let i = 0; i < reso; i++) {
            const newX = x + bendingAngle(i / reso) * 100;
            const newY = y - (i * height) / reso;

            if (i >= reso / 4) {
                for (let j = 0; j < 1; j++) {
                    const bfunc = function (x: number) {
                        return x <= 1
                            ? 2.75 * x * Math.pow(1 - x, 1 / 1.8)
                            : 2.75 * (x - 2) * Math.pow(x - 1, 1 / 1.8);
                    };
                    const bpl = generateBlobPoints(
                        newX +
                            PRNG.random(-0.3, 0.3) * strokeWidth * (reso - i),
                        newY + PRNG.random(-0.25, 0.25) * strokeWidth,
                        PRNG.random(0, -Math.PI / 6),
                        PRNG.random(20, 70),
                        PRNG.random(12, 24),
                        0.5,
                        bfunc
                    );

                    T = T.concat(triangulate(bpl, 50, true, false));
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
            this.add(new SvgPolyline(T[k], 0, 0, co, co));
        }
    }
}
