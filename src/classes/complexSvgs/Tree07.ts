import Perlin from "../Perlin";
import Point from "../Point";
import PRNG from "../PRNG";
import { midPoint, triangulate } from "../../utils/polytools";
import SvgPolyline from "../SvgPolyline";
import { generateBlobPoints } from "../../utils/generateBlobPoints";
import ComplexSvg from "../ComplexSvg";

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
    constructor(prng: PRNG, x: number, y: number, height: number = 60) {
        super();

        const strokeWidth: number = 4;
        const bendingAngle: (x: number) => number = (x: number) =>
            0.2 * Math.sqrt(x);
        const reso = 10;
        const noiseArray = [];
        for (let i = 0; i < reso; i++) {
            noiseArray.push([
                Perlin.noise(prng, i * 0.5),
                Perlin.noise(prng, i * 0.5, 0.5),
            ]);
        }

        const line1: Point[] = [];
        const line2: Point[] = [];
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
                        prng,
                        newX +
                            prng.random(-0.3, 0.3) * strokeWidth * (reso - i),
                        newY + prng.random(-0.25, 0.25) * strokeWidth,
                        prng.random(0, -Math.PI / 6),
                        prng.random(20, 70),
                        prng.random(12, 24),
                        0.5,
                        bfunc
                    );

                    T = T.concat(triangulate(bpl as Point[], 50, true, false));
                }
            }
            line1.push(
                new Point(
                    newX +
                        (noiseArray[i][0] - 0.5) * strokeWidth -
                        strokeWidth / 2,
                    newY
                )
            );
            line2.push(
                new Point(
                    newX +
                        (noiseArray[i][1] - 0.5) * strokeWidth +
                        strokeWidth / 2,
                    newY
                )
            );
        }

        T = triangulate(line1.concat(line2.reverse()), 50, true, true).concat(
            T
        );

        for (let k = 0; k < T.length; k++) {
            const m = midPoint(T[k]);
            const c =
                (Perlin.noise(prng, m.x * 0.02, m.y * 0.02) * 200 + 50) | 0;
            const co = `rgba(${c},${c},${c},0.8)`;
            this.add(new SvgPolyline(T[k], 0, 0, co, co));
        }
    }
}
