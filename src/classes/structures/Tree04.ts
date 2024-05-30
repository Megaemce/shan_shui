import Barkify from "./Barkify";
import Structure from "../Structure";
import PRNG from "../PRNG";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Element from "../Element";
import Twig from "./Twig";
import Branch from "../elements/Branch";

/**
 * Generates a tree-like structure with branches, bark, and twigs.
 */
export default class Tree04 extends Structure {
    /**
     * Constructor for the Tree04Generator class.
     * @param {number} xOffset - X-coordinate offset.
     * @param {number} yOffset - Y-coordinate offset.
     */
    constructor(xOffset: number, yOffset: number) {
        super();

        const height: number = 300;
        const strokeWidth: number = 6;
        let color: string = "rgba(100,100,100,0.5)";

        const branches = Branch(height, strokeWidth, -Math.PI / 2);
        const pointArray: Point[] = [...branches[0]].concat(
            [...branches[1]].reverse()
        );

        let pointArrayModified: Point[] = [];

        pointArray.forEach((point, i) => {
            if (
                (i >= pointArray.length * 0.3 &&
                    i <= pointArray.length * 0.7 &&
                    PRNG.random() < 0.1) ||
                i === pointArray.length / 2 - 1
            ) {
                const angle =
                    Math.PI * 0.2 -
                    Math.PI * 1.4 * (i > pointArray.length / 2 ? 1 : 0);
                const heightFactor = PRNG.random(0.3, 0.6);
                const strokeWidthFactor = 0.5;
                const [leftBranches, rightBranches] = Branch(
                    height * heightFactor,
                    strokeWidth * strokeWidthFactor,
                    angle
                );

                leftBranches.shift();
                rightBranches.shift();

                const offset = (p: Point) =>
                    new Point(p.x + point.x, p.y + point.y);

                this.add(
                    new Barkify(xOffset, yOffset, [
                        leftBranches.map(offset),
                        rightBranches.map(offset),
                    ])
                );

                leftBranches.forEach((p, j) => {
                    if (PRNG.random() < 0.2 || j === leftBranches.length - 1) {
                        const twigAngle =
                            angle > -Math.PI / 2 ? angle : angle + Math.PI;
                        const twigDirection = angle > -Math.PI / 2 ? 1 : -1;
                        const twigHeight = (0.5 * height) / 300;
                        const twigWidth = height / 300;

                        this.addAtStart(
                            new Twig(
                                p.x + point.x + xOffset,
                                p.y + point.y + yOffset,
                                1,
                                twigAngle,
                                twigHeight,
                                twigDirection,
                                twigWidth
                            )
                        );
                    }
                });

                const brlist = leftBranches.concat(rightBranches.reverse());
                pointArrayModified = pointArrayModified.concat(
                    brlist.map((p) => new Point(p.x + point.x, p.y + point.y))
                );
            } else {
                pointArrayModified.push(point);
            }
        });

        this.addAtStart(
            new Element(pointArrayModified, xOffset, yOffset, "white", color)
        );

        pointArrayModified.shift();
        pointArrayModified.pop();
        color = `rgba(100,100,100,${PRNG.random(0.4, 0.5).toFixed(3)})`;

        this.add(new Barkify(xOffset, yOffset, branches));

        this.add(
            new Stroke(
                pointArrayModified.map(function (p: Point) {
                    return new Point(p.x + xOffset, p.y + yOffset);
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
}
