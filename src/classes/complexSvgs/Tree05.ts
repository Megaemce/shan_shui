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
        const trlist = _trlist[0].concat(_trlist[1].reverse());

        let trmlist: Point[] = [];

        for (let i = 0; i < trlist.length; i++) {
            const p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
            if (
                (i >= trlist.length * 0.2 &&
                    i <= trlist.length * 0.8 &&
                    i % 3 === 0 &&
                    PRNG.random() > p) ||
                i === trlist.length / 2 - 1
            ) {
                const bar = PRNG.random(0, 0.2);
                const angle =
                    -bar * Math.PI -
                    (1 - bar * 2) * Math.PI * (i > trlist.length / 2 ? 1 : 0);
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
                                _brlist[0][j].x + trlist[i].x + x,
                                _brlist[0][j].y + trlist[i].y + y,
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
                trmlist = trmlist.concat(
                    brlist.map(function (p) {
                        return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
                    })
                );
            } else {
                trmlist.push(trlist[i]);
            }
        }

        this.add(new SvgPolyline(trmlist, x, y, "white", color));

        trmlist.splice(0, 1);
        trmlist.splice(trmlist.length - 1, 1);
        color = `rgba(100,100,100,${PRNG.random(0.4, 0.5).toFixed(3)})`;

        // Tree trunk
        this.add(
            new Stroke(
                trmlist.map(function (p: Point) {
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
