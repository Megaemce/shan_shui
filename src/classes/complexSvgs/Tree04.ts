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
export default class Tree04 extends ComplexSvg {
    /**
     * Constructor for the Tree04Generator class.
     * @param x - X-coordinate offset.
     * @param y - Y-coordinate offset.
     */
    constructor(x: number, y: number) {
        super();

        const height: number = 300;
        const strokeWidth: number = 6;
        let color: string = "rgba(100,100,100,0.5)";

        const _trlist = generateBranch(height, strokeWidth, -Math.PI / 2);
        this.add(new Barkify(x, y, _trlist));
        const pointArray: Point[] = _trlist[0].concat(_trlist[1].reverse());

        let pointArrayModified: Point[] = [];

        pointArray.forEach((tr, i) => {
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
                const _brlist = generateBranch(
                    height * heightFactor,
                    strokeWidth * strokeWidthFactor,
                    angle
                );

                _brlist[0].shift();
                _brlist[1].shift();

                const foff = (p: Point) => new Point(p.x + tr.x, p.y + tr.y);

                this.add(
                    new Barkify(x, y, [
                        _brlist[0].map(foff),
                        _brlist[1].map(foff),
                    ])
                );

                _brlist[0].forEach((p, j) => {
                    if (PRNG.random() < 0.2 || j === _brlist[0].length - 1) {
                        const twigAngle =
                            angle > -Math.PI / 2 ? angle : angle + Math.PI;
                        const twigDirection = angle > -Math.PI / 2 ? 1 : -1;
                        const twigHeight = (0.5 * height) / 300;
                        const twigWidth = height / 300;

                        this.add(
                            new Twig(
                                p.x + tr.x + x,
                                p.y + tr.y + y,
                                1,
                                twigAngle,
                                twigHeight,
                                twigDirection,
                                twigWidth
                            )
                        );
                    }
                });

                const brlist = _brlist[0].concat(_brlist[1].reverse());
                pointArrayModified = pointArrayModified.concat(
                    brlist.map((p) => new Point(p.x + tr.x, p.y + tr.y))
                );
            } else {
                pointArrayModified.push(tr);
            }
        });

        this.add(new SvgPolyline(pointArrayModified, x, y, "white", color));

        pointArrayModified.splice(0, 1);
        pointArrayModified.splice(pointArrayModified.length - 1, 1);
        color = `rgba(100,100,100,${PRNG.random(0.4, 0.5).toFixed(3)})`;

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
