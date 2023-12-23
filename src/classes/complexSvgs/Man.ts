import PRNG from "../PRNG";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";
import Vector from "../Vector";
import IPoint from "../../interfaces/IPoint";
import { expand, generateBezierCurve } from "../../utils/utils";
import Hat01 from "./Hat01";
import Cloth from "./Cloth";
import Stick from "./Stick";
import Hat02 from "./Hat02";
import ComplexSvg from "../ComplexSvg";

/**
 * Class representing a man SVG complex structure.
 */
export default class Man extends ComplexSvg {
    /**
     * Constructs a Man instance.
     *
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {number} xOffset - X-coordinate offset for the man.
     * @param {number} yOffset - Y-coordinate offset for the man.
     * @param {boolean} [horizontalFlip=true] - Indicates whether the man is flipped horizontally.
     * @param {number} [scalling=0.5] - Scaling factor for the man.
     * @param {number[]} [lengthArray=[0, 30, 20, 30, 30, 30, 30, 30, 30]] - Array representing the lengths of different body parts.
     * @param {boolean} hasStick - Indicates whether the man has a stick.
     * @param {number} [hatNumber=1] - Indicates whether the man has a hat and the hat version. 0 is no hat
     */
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        horizontalFlip: boolean = true,
        scalling: number = 0.5,
        lengthArray: number[] = [0, 30, 20, 30, 30, 30, 30, 30, 30],
        hasStick: boolean = true,
        hatNumber: number = 1
    ) {
        super();

        const ang: number[] = [
            0,
            -Math.PI / 2,
            prng.normalizedRandom(0, 0),
            prng.random(0, Math.PI / 4),
            prng.random(0, (Math.PI * 3) / 4),
            (Math.PI * 3) / 4,
            -Math.PI / 4,
            -Math.PI * prng.random(3 / 4, 1),
            -Math.PI / 4,
        ];
        const len = lengthArray.map((v) => v * scalling);

        const struct = [
            [0],
            [0, 1],
            [0, 1, 2],
            [0, 3],
            [0, 3, 4],
            [0, 1, 5],
            [0, 1, 5, 6],
            [0, 1, 7],
            [0, 1, 7, 8],
        ];

        const toGlobal = (point: IPoint) =>
            new Point(
                (horizontalFlip ? -1 : 1) * point.x + xOffset,
                point.y + yOffset
            );

        const vectorArray: Vector[] = struct.map((_, i) =>
            struct[i].reduce<Vector>((pos, par) => {
                const rot = struct[par].reduce((s, j) => s + ang[j], 0);
                return pos.move(Vector.unit(rot).scale(len[par]));
            }, new Vector(0, 0))
        );

        yOffset -= vectorArray[4].y;

        const cloth = (
            vertices: Vector[],
            scalingFunction: (value: number) => number
        ) =>
            this.add(
                new Cloth(
                    prng,
                    toGlobal,
                    vertices.map((vector) => vector.moveFrom(Point.O)),
                    scalingFunction
                )
            );

        const hlist = generateBezierCurve(
            [vectorArray[1], vectorArray[2]].map((vector) =>
                vector.moveFrom(Point.O)
            )
        );

        const [hlist1, hlist2] = expand(hlist, this.fhead.bind(this, scalling));
        hlist1.splice(0, Math.floor(hlist1.length * 0.1));
        hlist2.splice(0, Math.floor(hlist2.length * 0.95));

        this.add(
            new SvgPolyline(
                hlist1.concat(hlist2.reverse()).map(toGlobal),
                0,
                0,
                "rgba(100,100,100,0.6)"
            )
        );

        cloth(
            [vectorArray[1], vectorArray[7], vectorArray[8]],
            this.fsleeve.bind(this, scalling)
        );
        cloth(
            [vectorArray[1], vectorArray[0], vectorArray[3], vectorArray[4]],
            this.fbody.bind(this, scalling)
        );
        cloth(
            [vectorArray[1], vectorArray[5], vectorArray[6]],
            this.fsleeve.bind(this, scalling)
        );

        if (hasStick) {
            this.add(
                new Stick(
                    prng,
                    toGlobal(vectorArray[8]),
                    toGlobal(vectorArray[6]),
                    horizontalFlip
                )
            );
        }

        if (hatNumber) {
            let hatElements = new Hat01(
                prng,
                toGlobal(vectorArray[1]),
                toGlobal(vectorArray[2]),
                horizontalFlip
            );

            if (hatNumber === 2) {
                hatElements = new Hat02(
                    prng,
                    toGlobal(vectorArray[1]),
                    toGlobal(vectorArray[2]),
                    horizontalFlip
                );
            }

            this.add(hatElements);
        }
    }

    /**
     * Scaling function for sleeve.
     * @private
     */
    private fsleeve(scaling: number, value: number): number {
        return (
            scaling *
            8 *
            (Math.sin(0.5 * value * Math.PI) *
                Math.pow(Math.sin(value * Math.PI), 0.1) +
                (1 - value) * 0.4)
        );
    }

    /**
     * Scaling function for body.
     * @private
     */
    private fbody(scaling: number, value: number): number {
        return (
            scaling *
            11 *
            (Math.sin(0.5 * value * Math.PI) *
                Math.pow(Math.sin(value * Math.PI), 0.1) +
                (1 - value) * 0.5)
        );
    }

    /**
     * Scaling function for head.
     * @private
     */
    private fhead(scaling: number, value: number): number {
        return scaling * 7 * Math.pow(0.25 - Math.pow(value - 0.5, 2), 0.3);
    }
}
