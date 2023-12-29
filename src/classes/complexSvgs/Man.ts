import Cloth from "./Cloth";
import ComplexSvg from "../ComplexSvg";
import Hat01 from "./Hat01";
import Hat02 from "./Hat02";
import IPoint from "../../interfaces/IPoint";
import PRNG from "../PRNG";
import Point from "../Point";
import Stick from "./Stick";
import SvgPolyline from "../SvgPolyline";
import { expand, generateBezierCurve } from "../../utils/utils";

/**
 * Class representing a man SVG complex structure.
 */
export default class Man extends ComplexSvg {
    /**
     * Constructs a Man instance.
     * @param {number} xOffset - X-coordinate offset for the man.
     * @param {number} yOffset - Y-coordinate offset for the man.
     * @param {boolean} [horizontalFlip=true] - Indicates whether the man is flipped horizontally.
     * @param {number} [scaling=0.5] - Scaling factor for the man.
     * @param {number[]} [bodyPartLengths=[0, 30, 20, 30, 30, 30, 30, 30, 30]] - Array representing the lengths of different body parts.
     * @param {boolean} hasStick - Indicates whether the man has a stick.
     * @param {number} [hatNumber=1] - Indicates whether the man has a hat and the hat version. 0 is no hat
     */
    constructor(
        xOffset: number,
        yOffset: number,
        horizontalFlip: boolean = true,
        scaling: number = 0.5,
        bodyPartLengths: number[] = [0, 30, 20, 30, 30, 30, 30, 30, 30],
        hasStick: boolean = false,
        hatNumber: number = 1
    ) {
        super();

        const pointArray: Point[] = [];
        const lengthArray = bodyPartLengths.map((length) => length * scaling);
        const angleArray: number[] = [
            0,
            -Math.PI / 2,
            PRNG.normalizedRandom(0, 0),
            PRNG.random(0, Math.PI / 4),
            PRNG.random(0, (Math.PI * 3) / 4),
            (Math.PI * 3) / 4,
            -Math.PI / 4,
            -Math.PI * PRNG.random(3 / 4, 1),
            -Math.PI / 4,
        ];
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
        const scalingSleeve = (value: number) =>
            scaling *
            8 *
            (Math.sin(0.5 * value * Math.PI) *
                Math.pow(Math.sin(value * Math.PI), 0.1) +
                (1 - value) * 0.4);

        const scalingHead = (value: number) =>
            scaling * 7 * Math.pow(0.25 - Math.pow(value - 0.5, 2), 0.3);

        const scalingBody = (value: number) =>
            scaling *
            11 *
            (Math.sin(0.5 * value * Math.PI) *
                Math.pow(Math.sin(value * Math.PI), 0.1) +
                (1 - value) * 0.5);
        const addCloth = (
            points: Point[],
            scalingFunction: (value: number) => number
        ) => this.add(new Cloth(toGlobal, points, scalingFunction));

        struct.forEach((_, i) => {
            let pos = new Point(0, 0);

            struct[i].forEach((par) => {
                let rot = 0;

                struct[par].forEach((j) => {
                    rot += angleArray[j];
                });

                pos.x += Math.cos(rot) * lengthArray[par];
                pos.y += Math.sin(rot) * lengthArray[par];
            });

            pointArray.push(pos);
        });

        yOffset -= pointArray[4].y;

        const hlist = generateBezierCurve([pointArray[1], pointArray[2]]);

        const [hlist1, hlist2] = expand(hlist, scalingHead);
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

        addCloth([pointArray[1], pointArray[7], pointArray[8]], scalingHead);
        addCloth(
            [pointArray[1], pointArray[0], pointArray[3], pointArray[4]],
            scalingBody
        );
        addCloth([pointArray[1], pointArray[5], pointArray[6]], scalingSleeve);

        if (hasStick) {
            this.add(
                new Stick(
                    toGlobal(pointArray[8]),
                    toGlobal(pointArray[6]),
                    horizontalFlip
                )
            );
        }

        if (hatNumber) {
            let hatElements = new Hat01(
                toGlobal(pointArray[1]),
                toGlobal(pointArray[2]),
                horizontalFlip
            );

            if (hatNumber === 2) {
                hatElements = new Hat02(
                    toGlobal(pointArray[1]),
                    toGlobal(pointArray[2]),
                    horizontalFlip
                );
            }

            this.add(hatElements);
        }
    }
}
