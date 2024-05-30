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
export default class Tree05 extends Structure {
    /**
     * Constructor for the Tree05Generator class.
     * @param {number} xOffset - X-coordinate offset.
     * @param {number} yOffset - Y-coordinate offset.
     * @param {number} height - The height of the tree.
     */
    constructor(xOffset: number, yOffset: number, height: number = 300) {
        super();

        const strokeWidth: number = 5;
        let color: string = "rgba(100,100,100,0.5)";

        const branches = Branch(height, strokeWidth, -Math.PI / 2, 0);
        const pointArray = [...branches[0]].concat([...branches[1]].reverse());

        let pointArrayModified: Point[] = [];

        for (let i = 0; i < pointArray.length; i++) {
            const p =
                Math.abs(i - pointArray.length * 0.5) /
                (pointArray.length * 0.5);
            if (
                (i >= pointArray.length * 0.2 &&
                    i <= pointArray.length * 0.8 &&
                    i % 3 === 0 &&
                    PRNG.random() > p) ||
                i === pointArray.length / 2 - 1
            ) {
                const bar = PRNG.random(0, 0.2);
                const angle =
                    -bar * Math.PI -
                    (1 - bar * 2) *
                        Math.PI *
                        (i > pointArray.length / 2 ? 1 : 0);
                const _brlist = Branch(
                    height * (0.3 * p - PRNG.random(0, 0.05)),
                    strokeWidth * 0.5,
                    angle,
                    0.5
                );

                _brlist[0].shift();
                _brlist[1].shift();

                for (let j = 0; j < _brlist[0].length; j++) {
                    if (j % 20 === 0 || j === _brlist[0].length - 1) {
                        this.add(
                            new Twig(
                                _brlist[0][j].x + pointArray[i].x + xOffset,
                                _brlist[0][j].y + pointArray[i].y + yOffset,
                                0,
                                angle > -Math.PI / 2 ? angle : angle + Math.PI,
                                (0.2 * height) / 300,
                                angle > -Math.PI / 2 ? 1 : -1,
                                height / 300,
                                5
                            )
                        );
                    }
                }
                const brlist = _brlist[0].concat(_brlist[1].reverse());
                pointArrayModified = pointArrayModified.concat(
                    brlist.map(function (p) {
                        return new Point(
                            p.x + pointArray[i].x,
                            p.y + pointArray[i].y
                        );
                    })
                );
            } else {
                pointArrayModified.push(pointArray[i]);
            }
        }

        this.addAtStart(
            new Element(pointArrayModified, xOffset, yOffset, "white", color)
        );

        pointArrayModified.shift();
        pointArrayModified.pop();
        color = `rgba(100,100,100,${PRNG.random(0.4, 0.5).toFixed(3)})`;

        this.add(new Barkify(xOffset, yOffset, branches));

        // Tree trunkB
        this.add(
            new Stroke(
                pointArrayModified.map((point: Point) => {
                    return new Point(point.x + xOffset, point.y + yOffset);
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
