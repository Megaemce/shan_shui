import Point from "../Point";
import Vector from "../Vector";
import PRNG from "../PRNG";
import Stroke from "../svgPolylines/Stroke";
import { distance } from "../../utils/polytools";
import { div } from "../../utils/div";
import ComplexSvg from "../ComplexSvg";
import generateBranch from "../svgPolylines/generateBranch";
import SvgPolyline from "../SvgPolyline";

/**
 * Class representing a generator for a fractal tree-like structure.
 */
export default class Tree08 extends ComplexSvg {
    /**
     * Constructor for the Tree08 class.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate of the base point.
     * @param y - Y-coordinate of the base point.
     * @param height - Height of the tree.
     */
    constructor(prng: PRNG, x: number, y: number, height: number = 80) {
        super();

        const strokeWidth: number = 1;
        const col: string = "rgba(100,100,100,0.5)";

        // Generate a random angle to add variety to the tree structure
        const angle = prng.normalizedRandom(-1, 1) * Math.PI * 0.2;

        // Generate the main trunk of the tree
        const _trlist = generateBranch(
            prng,
            height,
            strokeWidth,
            -Math.PI / 2 + angle,
            Math.PI * 0.2,
            height / 20
        );
        const trlist = _trlist[0].concat(_trlist[1].reverse());

        // Iterate over each point in the trunk
        for (let i = 0; i < trlist.length; i++) {
            // Randomly generate branches
            if (prng.random() < 0.2) {
                this.generateFractalTree(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    Math.floor(prng.random(0, 4)),
                    -Math.PI / 2 + prng.random(-angle, 0)
                );
            } else if (i === Math.floor(trlist.length / 2)) {
                // Generate a specific branch at the middle of the trunk
                this.generateFractalTree(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    3,
                    -Math.PI / 2 + angle
                );
            }
        }

        // Add the main trunk to the polyline array
        this.add(new SvgPolyline(trlist, x, y, "white", col));

        // Add a colored stroke to the main trunk
        const color = `rgba(100,100,100,${prng.random(0.6, 0.7).toFixed(3)})`;
        this.add(
            new Stroke(
                prng,
                trlist.map(function (v) {
                    return new Point(v.x + x, v.y + y);
                }),
                color,
                color,
                2.5,
                0.9,
                0,
                (x) => Math.sin(1)
            )
        );
    }

    /**
     * Recursive function to generate a fractal tree-like structure.
     * @param prng - The pseudo-random number generator.
     * @param xOffset - X-coordinate offset.
     * @param yOffset - Y-coordinate offset.
     * @param depth - Current depth of recursion.
     * @param angle - Initial angle of the tree.
     * @param len - Length of the branches.
     * @param bendingAngle - Bending angle of the tree.
     */
    private generateFractalTree(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        depth: number,
        angle: number = -Math.PI / 2,
        len: number = 15,
        bendingAngle: number = 0
    ): void {
        const fun = (x: number) => (depth ? 1 : Math.cos(0.5 * Math.PI * x));
        const spt = new Vector(xOffset, yOffset);
        const ept = new Point(
            xOffset + Math.cos(angle) * len,
            yOffset + Math.sin(angle) * len
        );

        const _trmlist = [
            new Point(xOffset, yOffset),
            new Point(xOffset + len, yOffset),
        ];

        const bfun = prng.randomChoice([
            (x: number) => Math.sin(x * Math.PI),
            (x: number) => -Math.sin(x * Math.PI),
        ]);

        const trmlist = div(_trmlist, 10);

        for (let i = 0; i < trmlist.length; i++) {
            trmlist[i].y += bfun(i / trmlist.length) * 2;
        }

        for (let i = 0; i < trmlist.length; i++) {
            const d = distance(trmlist[i], spt.moveFrom(Point.O));
            const a = Math.atan2(trmlist[i].y - spt.y, trmlist[i].x - spt.x);
            trmlist[i].x = spt.x + d * Math.cos(a + angle);
            trmlist[i].y = spt.y + d * Math.sin(a + angle);
        }

        this.add(
            new Stroke(
                prng,
                trmlist,
                "rgba(100,100,100,0.5)",
                "rgba(100,100,100,0.5)",
                0.8,
                0.5,
                1,
                fun
            )
        );

        if (depth !== 0) {
            const nben =
                bendingAngle +
                prng.randomChoice([-1, 1]) * Math.PI * 0.001 * depth * depth;
            if (prng.random() < 0.5) {
                this.generateFractalTree(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            prng.randomChoice([
                                prng.normalizedRandom(-1, 0.5),
                                prng.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                );
                this.generateFractalTree(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            prng.randomChoice([
                                prng.normalizedRandom(-1, -0.5),
                                prng.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                );
            } else {
                this.generateFractalTree(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle + bendingAngle,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                );
            }
        }
    }
}
