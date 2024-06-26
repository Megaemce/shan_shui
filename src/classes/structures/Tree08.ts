import Structure from "../Structure";
import PRNG from "../PRNG";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Element from "../Element";
import Branch from "../elements/Branch";
import { distance } from "../../utils/polytools";
import { lineDivider } from "../../utils/polytools";

/**
 * Class representing a generator for a fractal tree-like structure.
 */
export default class Tree08 extends Structure {
    /**
     * Constructor for the Tree08 class.
     * @param {number} xOffset - X-coordinate offset of tree08.
     * @param {number} yOffset - Y-coordinate offset of tree08.
     * @param {number} height - Height of the tree.
     */
    constructor(xOffset: number, yOffset: number, height: number = 80) {
        super();

        const strokeWidth: number = 1;
        let color: string = "rgba(100,100,100,0.5)";

        // Generate a random angle to add variety to the tree structure
        const angle = PRNG.normalizedRandom(-1, 1) * Math.PI * 0.2;

        // Generate the main trunk of the tree
        const [leftBranches, rightBranches] = Branch(
            height,
            strokeWidth,
            -Math.PI / 2 + angle,
            Math.PI * 0.2,
            height / 20
        );
        const pointArray = leftBranches.concat(rightBranches.reverse());

        // Iterate over each point in the trunk
        for (let i = 0; i < pointArray.length; i++) {
            // Randomly generate branches
            if (PRNG.random() < 0.2) {
                this.generateFractalTree(
                    xOffset + pointArray[i].x,
                    yOffset + pointArray[i].y,
                    Math.floor(PRNG.random(0, 4)),
                    -Math.PI / 2 + PRNG.random(-angle, 0)
                );
            } else if (i === Math.floor(pointArray.length / 2)) {
                // Generate a specific branch at the middle of the trunk
                this.generateFractalTree(
                    xOffset + pointArray[i].x,
                    yOffset + pointArray[i].y,
                    3,
                    -Math.PI / 2 + angle
                );
            }
        }

        // Add the main trunk to the polyline array
        this.add(new Element(pointArray, xOffset, yOffset, "white", color));

        // Add a colored stroke to the main trunk
        color = `rgba(100,100,100,${PRNG.random(0.6, 0.7).toFixed(3)})`;
        this.add(
            new Stroke(
                pointArray.map(
                    (point) => new Point(point.x + xOffset, point.y + yOffset)
                ),
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

        const pointArrayModified = lineDivider(_trmlist, 10);

        pointArrayModified.forEach((point, i) => {
            point.y += bfun(i / pointArrayModified.length) * 2;

            const d = distance(point, new Point(xOffset, yOffset));
            const a = Math.atan2(point.y - yOffset, point.x - xOffset);

            point.x = xOffset + d * Math.cos(a + angle);
            point.y = yOffset + d * Math.sin(a + angle);
        });

        this.addAtStart(
            new Stroke(
                pointArrayModified,
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
