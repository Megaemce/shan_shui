import Point from "../Point";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import Twig from "./Twig";
import Barkify from "./Barkify";
import ComplexSvg from "../ComplexSvg";
import generateBranch from "../svgPolylines/generateBranch";

/**
 * Class representing a generator for a fractal tree-like structure.
 */
export default class Tree06 extends ComplexSvg {
    /**
     * Generates a tree structure using fractal patterns.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate offset.
     * @param y - Y-coordinate offset.
     * @param height - Height of the tree.
     * @returns An array of polylines representing the tree structure.
     */
    constructor(prng: PRNG, x: number, y: number, height: number = 100) {
        super();

        const strokeWidth: number = 6;
        const col: string = "rgba(100,100,100,0.5)";

        const trmlist = this.generateFractalTree06(
            prng,
            x,
            y,
            3,
            height,
            strokeWidth,
            -Math.PI / 2,
            0
        );

        this.add(new SvgPolyline(trmlist, x, y, "white", col, 0));

        trmlist.splice(0, 1);
        trmlist.splice(trmlist.length - 1, 1);
        const color = `rgba(100,100,100,${prng.random(0.4, 0.5).toFixed(3)})`;
        this.add(
            new Stroke(
                prng,
                trmlist.map(function (v) {
                    return new Point(v.x + x, v.y + y);
                }),
                color,
                color,
                2.5,
                0.9,
                0,
                (_) => Math.sin(1)
            )
        );
    }

    /**
     * Recursive function to generate a fractal tree-like structure.
     * @param prng - The pseudo-random number generator.
     * @param txpolylinelists - Lists to store trunk and bark polylines.
     * @param twpolylinelists - Lists to store twig polylines.
     * @param xOffset - X-coordinate offset.
     * @param yOffset - Y-coordinate offset.
     * @param depth - Current depth of recursion.
     * @param height - Height of the tree.
     * @param strokeWidth - Width of the strokes.
     * @param angle - Initial angle of the tree.
     * @param bendingAngle - Bending angle of the tree.
     * @returns An array of points representing the tree-like structure.
     * @notExported
     */
    private generateFractalTree06(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        depth: number,
        height: number = 300,
        strokeWidth: number = 5,
        angle: number = 0,
        bendingAngle: number = 0.2 * Math.PI
    ): Point[] {
        const _trlist = generateBranch(
            prng,
            height,
            strokeWidth,
            angle,
            bendingAngle,
            height / 20
        );

        this.add(new Barkify(prng, xOffset, yOffset, _trlist));
        const trlist = _trlist[0].concat(_trlist[1].reverse());

        let trmlist: Point[] = [];

        for (let i = 0; i < trlist.length; i++) {
            if (
                ((prng.random() < 0.025 &&
                    i >= trlist.length * 0.2 &&
                    i <= trlist.length * 0.8) ||
                    i === ((trlist.length / 2) | 0) - 1 ||
                    i === ((trlist.length / 2) | 0) + 1) &&
                depth > 0
            ) {
                const bar = prng.random(0.02, 0.1);
                const ba =
                    bar * Math.PI -
                    bar * 2 * Math.PI * (i > trlist.length / 2 ? 1 : 0);

                const brlist = this.generateFractalTree06(
                    prng,
                    trlist[i].x + xOffset,
                    trlist[i].y + yOffset,
                    depth - 1,
                    height * prng.random(0.7, 0.9),
                    strokeWidth * 0.6,
                    angle + ba,
                    0.55
                );

                for (let j = 0; j < brlist.length; j++) {
                    if (prng.random() < 0.03) {
                        this.add(
                            new Twig(
                                prng,
                                brlist[j].x + trlist[i].x + xOffset,
                                brlist[j].y + trlist[i].y + yOffset,
                                2,
                                ba * prng.random(0.75, 1.25),
                                0.3,
                                ba > 0 ? 1 : -1,
                                1,
                                [false, 0]
                            )
                        );
                    }
                }

                trmlist = trmlist.concat(
                    brlist.map(function (v) {
                        return new Point(v.x + trlist[i].x, v.y + trlist[i].y);
                    })
                );
            } else {
                trmlist.push(trlist[i]);
            }
        }

        return trmlist;
    }
}
