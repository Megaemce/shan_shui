import Barkify from "./Barkify";
import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
import SvgPolyline from "../SvgPolyline";
import Twig from "./Twig";
import generateBranch from "../svgPolylines/generateBranch";

/**
 * Class representing a generator for a fractal tree-like structure.
 */
export default class Tree06 extends ComplexSvg {
    /**
     * Generates a tree structure using fractal patterns.
     * @param x - X-coordinate offset.
     * @param y - Y-coordinate offset.
     * @param height - Height of the tree.
     * @returns An array of polylines representing the tree structure.
     */
    constructor(x: number, y: number, height: number = 100) {
        super();

        const strokeWidth: number = 6;
        let color: string = "rgba(100,100,100,0.5)";

        const pointArray = this.generateFractalTree06(
            x,
            y,
            3,
            height,
            strokeWidth,
            -Math.PI / 2,
            0
        );

        this.add(new SvgPolyline(pointArray, x, y, "white", color, 0));

        pointArray.shift();
        pointArray.pop();
        color = `rgba(100,100,100,${PRNG.random(0.4, 0.5).toFixed(3)})`;
        this.add(
            new Stroke(
                pointArray.map(function (v) {
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
        xOffset: number,
        yOffset: number,
        depth: number,
        height: number = 300,
        strokeWidth: number = 5,
        angle: number = 0,
        bendingAngle: number = 0.2 * Math.PI
    ): Point[] {
        const [leftBranches, rightBranches] = generateBranch(
            height,
            strokeWidth,
            angle,
            bendingAngle,
            height / 20
        );

        this.add(new Barkify(xOffset, yOffset, [leftBranches, rightBranches]));
        const branches = leftBranches.concat(rightBranches.reverse());

        let result: Point[] = [];

        branches.forEach((branch, i) => {
            if (
                ((PRNG.random() < 0.025 &&
                    i >= branches.length * 0.2 &&
                    i <= branches.length * 0.8) ||
                    i === ((branches.length / 2) | 0) - 1 ||
                    i === ((branches.length / 2) | 0) + 1) &&
                depth > 0
            ) {
                const branchRadian = PRNG.random(0.02, 0.1);
                const branchAngle =
                    branchRadian * Math.PI -
                    branchRadian *
                        2 *
                        Math.PI *
                        (i > branches.length / 2 ? 1 : 0);

                const brlist = this.generateFractalTree06(
                    branch.x + xOffset,
                    branch.y + yOffset,
                    depth - 1,
                    height * PRNG.random(0.7, 0.9),
                    strokeWidth * 0.6,
                    angle + branchAngle,
                    0.55
                );

                brlist.forEach((point) => {
                    if (PRNG.random() < 0.03) {
                        this.add(
                            new Twig(
                                point.x + branch.x + xOffset,
                                point.y + branch.y + yOffset,
                                2,
                                branchAngle * PRNG.random(0.75, 1.25),
                                0.3,
                                branchAngle > 0 ? 1 : -1,
                                1,
                                0
                            )
                        );
                    }
                });

                result = result.concat(
                    brlist.map(
                        (point) =>
                            new Point(point.x + branch.x, point.y + branch.y)
                    )
                );
            } else {
                result.push(branch);
            }
        });

        return result;
    }
}
