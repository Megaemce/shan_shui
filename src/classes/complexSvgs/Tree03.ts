import ComplexSvg from "../ComplexSvg";
import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import Blob from "../svgPolylines/Blob";

/**
 * Generates a tree with branches and leaves influenced by a custom bending function.
 */
export default class Tree03 extends ComplexSvg {
    /**
     * Constructor for the Tree03Generator class.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate of the tree base.
     * @param y - Y-coordinate of the tree base.
     * @param height - Height of the tree.
     * @param col - Color of the tree.
     * @param bendingAngle - Custom bending function.
     */
    constructor(
        prng: PRNG,
        x: number,
        y: number,
        height: number = 16,
        col: string = "rgba(100,100,100,0.5)",
        bendingAngle: (x: number) => number = (_) => 0
    ) {
        super();

        const strokeWidth: number = 5;

        const reso = 10;
        const nslist = [];
        for (let i = 0; i < reso; i++) {
            nslist.push([
                Noise.noise(prng, i * 0.5),
                Noise.noise(prng, i * 0.5, 0.5),
            ]);
        }

        let leafcol;
        if (col.includes("rgba(")) {
            leafcol = col.replace("rgba(", "").replace(")", "").split(",");
        } else {
            leafcol = ["100", "100", "100", "0.5"];
        }
        const line1: Point[] = [];
        const line2: Point[] = [];
        for (let i = 0; i < reso; i++) {
            const newX = x + bendingAngle(i / reso) * 100;
            const newY = y - (i * height) / reso;
            if (i >= reso / 5) {
                for (let j = 0; j < (reso - i) * 2; j++) {
                    const shape = (x: number) => Math.log(50 * x + 1) / 3.95;
                    const ox =
                        prng.random(0, 2) *
                        strokeWidth *
                        shape((reso - i) / reso);
                    const lcol = `rgba(${leafcol[0]},${leafcol[1]},${
                        leafcol[2]
                    },${(prng.random(0, 0.2) + parseFloat(leafcol[3])).toFixed(
                        3
                    )})`;
                    this.add(
                        new Blob(
                            prng,
                            newX + ox * prng.randomChoice([-1, 1]),
                            newY + prng.random(-1, 1) * strokeWidth,
                            (prng.random(-0.5, 0.5) * Math.PI) / 6,
                            lcol,
                            ox * 2,
                            prng.random(3, 9)
                        )
                    );
                }
            }
            line1.push(
                new Point(
                    newX +
                        (((nslist[i][0] - 0.5) * strokeWidth -
                            strokeWidth / 2) *
                            (reso - i)) /
                            reso,
                    newY
                )
            );
            line2.push(
                new Point(
                    newX +
                        (((nslist[i][1] - 0.5) * strokeWidth +
                            strokeWidth / 2) *
                            (reso - i)) /
                            reso,
                    newY
                )
            );
        }
        const lc = line1.concat(line2.reverse());
        this.add(new SvgPolyline(lc, 0, 0, "white", col, 1.5));
    }
}
