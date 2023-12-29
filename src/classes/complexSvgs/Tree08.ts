import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
import SvgPolyline from "../SvgPolyline";
import generateBranch from "../svgPolylines/generateBranch";
import { distance } from "../../utils/polytools";
import { lineDivider } from "../../utils/polytools";

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
    constructor(x: number, y: number, height: number = 80) {
        super();

        const strokeWidth: number = 1;
        let color: string = "rgba(100,100,100,0.5)";

        // Generate a random angle to add variety to the tree structure
        const angle = PRNG.normalizedRandom(-1, 1) * Math.PI * 0.2;

        // Generate the main trunk of the tree
        const _trlist = generateBranch(
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
            if (PRNG.random() < 0.2) {
                this.generateFractalTree(
                    x + trlist[i].x,
                    y + trlist[i].y,
                    Math.floor(PRNG.random(0, 4)),
                    -Math.PI / 2 + PRNG.random(-angle, 0)
                );
            } else if (i === Math.floor(trlist.length / 2)) {
                // Generate a specific branch at the middle of the trunk
                this.generateFractalTree(
                    x + trlist[i].x,
                    y + trlist[i].y,
                    3,
                    -Math.PI / 2 + angle
                );
            }
        }

        // Add the main trunk to the polyline array
        this.add(new SvgPolyline(trlist, x, y, "white", color));

        // Add a colored stroke to the main trunk
        color = `rgba(100,100,100,${PRNG.random(0.6, 0.7).toFixed(3)})`;
        this.add(
            new Stroke(
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
        xOffset: number,
        yOffset: number,
        depth: number,
        angle: number = -Math.PI / 2,
        len: number = 15,
        bendingAngle: number = 0
    ): void {
        const fun = (x: number) => (depth ? 1 : Math.cos(0.5 * Math.PI * x));
        const ept = new Point(
            xOffset + Math.cos(angle) * len,
            yOffset + Math.sin(angle) * len
        );

        const _trmlist = [
            new Point(xOffset, yOffset),
            new Point(xOffset + len, yOffset),
        ];

        const bfun = PRNG.randomChoice([
            (x: number) => Math.sin(x * Math.PI),
            (x: number) => -Math.sin(x * Math.PI),
        ]);

        const trmlist = lineDivider(_trmlist, 10);

        for (let i = 0; i < trmlist.length; i++) {
            trmlist[i].y += bfun(i / trmlist.length) * 2;
        }

        for (let i = 0; i < trmlist.length; i++) {
            const d = distance(trmlist[i], new Point(xOffset, yOffset));
            const a = Math.atan2(
                trmlist[i].y - yOffset,
                trmlist[i].x - xOffset
            );
            trmlist[i].x = xOffset + d * Math.cos(a + angle);
            trmlist[i].y = yOffset + d * Math.sin(a + angle);
        }

        this.add(
            new Stroke(
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
                PRNG.randomChoice([-1, 1]) * Math.PI * 0.001 * depth * depth;
            if (PRNG.random() < 0.5) {
                this.generateFractalTree(
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            PRNG.randomChoice([
                                PRNG.normalizedRandom(-1, 0.5),
                                PRNG.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * PRNG.normalizedRandom(0.8, 0.9),
                    nben
                );
                this.generateFractalTree(
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            PRNG.randomChoice([
                                PRNG.normalizedRandom(-1, -0.5),
                                PRNG.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * PRNG.normalizedRandom(0.8, 0.9),
                    nben
                );
            } else {
                this.generateFractalTree(
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle + bendingAngle,
                    len * PRNG.normalizedRandom(0.8, 0.9),
                    nben
                );
            }
        }
    }
}
