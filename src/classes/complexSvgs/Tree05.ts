import Barkify from "./Barkify";
import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
import SvgPolyline from "../SvgPolyline";
import Twig from "./Twig";
import generateBranch from "../svgPolylines/generateBranch";

/**
 * Generates a tree-like structure with branches, bark, and twigs.
 */
export default class Tree05 extends ComplexSvg {
    /**
     * Constructor for the Tree05Generator class.
     * @param x - X-coordinate offset.
     * @param y - Y-coordinate offset.
     * @param height - The height of the tree.
     */
    constructor(x: number, y: number, height: number = 300) {
        super();

        const strokeWidth: number = 5;
        let color: string = "rgba(100,100,100,0.5)";

        const _trlist = generateBranch(height, strokeWidth, -Math.PI / 2, 0);
        this.add(new Barkify(x, y, _trlist));
        const pointArray = _trlist[0].concat(_trlist[1].reverse());

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
                const _brlist = generateBranch(
                    height * (0.3 * p - PRNG.random(0, 0.05)),
                    strokeWidth * 0.5,
                    angle,
                    0.5
                );

                _brlist[0].splice(0, 1);
                _brlist[1].splice(0, 1);

                for (let j = 0; j < _brlist[0].length; j++) {
                    if (j % 20 === 0 || j === _brlist[0].length - 1) {
                        this.add(
                            new Twig(
                                _brlist[0][j].x + pointArray[i].x + x,
                                _brlist[0][j].y + pointArray[i].y + y,
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

        this.add(new SvgPolyline(pointArrayModified, x, y, "white", color));

        pointArrayModified.splice(0, 1);
        pointArrayModified.splice(pointArrayModified.length - 1, 1);
        color = `rgba(100,100,100,${PRNG.random(0.4, 0.5).toFixed(3)})`;

        // Tree trunk
        this.add(
            new Stroke(
                pointArrayModified.map(function (p: Point) {
                    return new Point(p.x + x, p.y + y);
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
