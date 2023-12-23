import ComplexSvg from "../ComplexSvg";
import Point from "../Point";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import generateBranch from "../svgPolylines/generateBranch";
import Twig from "./Twig";
import Barkify from "./Barkify";

/**
 * Generates a tree-like structure with branches, bark, and twigs.
 */
export default class Tree04 extends ComplexSvg {
    /**
     * Constructor for the Tree04Generator class.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate offset.
     * @param y - Y-coordinate offset.
     */
    constructor(prng: PRNG, x: number, y: number) {
        super();

        const height: number = 300;
        const strokeWidth: number = 6;
        const col: string = "rgba(100,100,100,0.5)";

        const _trlist = generateBranch(prng, height, strokeWidth, -Math.PI / 2);
        this.add(new Barkify(prng, x, y, _trlist));
        const trlist: Point[] = _trlist[0].concat(_trlist[1].reverse());

        let trmlist: Point[] = [];

        for (let i = 0; i < trlist.length; i++) {
            if (
                (i >= trlist.length * 0.3 &&
                    i <= trlist.length * 0.7 &&
                    prng.random() < 0.1) ||
                i === trlist.length / 2 - 1
            ) {
                const ba =
                    Math.PI * 0.2 -
                    Math.PI * 1.4 * (i > trlist.length / 2 ? 1 : 0);
                const _brlist: Point[][] = generateBranch(
                    prng,
                    height * prng.random(0.3, 0.6),
                    strokeWidth * 0.5,
                    ba
                );

                _brlist[0].splice(0, 1);
                _brlist[1].splice(0, 1);
                const foff = function (p: Point) {
                    return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
                };

                this.add(
                    new Barkify(prng, x, y, [
                        _brlist[0].map(foff),
                        _brlist[1].map(foff),
                    ])
                );

                for (let j = 0; j < _brlist[0].length; j++) {
                    if (prng.random() < 0.2 || j === _brlist[0].length - 1) {
                        this.add(
                            new Twig(
                                prng,
                                _brlist[0][j].x + trlist[i].x + x,
                                _brlist[0][j].y + trlist[i].y + y,
                                1,
                                ba > -Math.PI / 2 ? ba : ba + Math.PI,
                                (0.5 * height) / 300,
                                ba > -Math.PI / 2 ? 1 : -1,
                                height / 300
                            )
                        );
                    }
                }
                const brlist = _brlist[0].concat(_brlist[1].reverse());
                trmlist = trmlist.concat(
                    brlist.map(function (p: Point) {
                        return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
                    })
                );
            } else {
                trmlist.push(trlist[i]);
            }
        }

        this.add(new SvgPolyline(trmlist, x, y, "white", col));

        trmlist.splice(0, 1);
        trmlist.splice(trmlist.length - 1, 1);
        const color = `rgba(100,100,100,${prng.random(0.4, 0.5).toFixed(3)})`;

        this.add(
            new Stroke(
                prng,
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
