import { PRNG } from "../../classes/PRNG";
import { Point } from "../../classes/Point";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { Vector } from "../../classes/Vector";
import { IPoint } from "../../interfaces/IPoint";
import { distance } from "../../utils/polytools";
import { generateBezierCurve } from "../../utils/utils";
import { generateHat01 } from "./generateHat01";
import { generateCloth } from "./generateCloth";

/**
 * Expands a given array of points using a width function.
 * @notExported
 * @param {Point[]} pointArray - The array of points to be expanded.
 * @param {(v: number) => number} wfun - The width function.
 * @returns {Point[][]} An array containing two sets of expanded points.
 */
export function expand(
    pointArray: Point[],
    wfun: (v: number) => number
): Point[][] {
    const vtxlist0: Point[] = [];
    const vtxlist1: Point[] = [];

    for (let i = 1; i < pointArray.length - 1; i++) {
        const w = wfun(i / pointArray.length);
        const a1 = Math.atan2(
            pointArray[i].y - pointArray[i - 1].y,
            pointArray[i].x - pointArray[i - 1].x
        );
        const a2 = Math.atan2(
            pointArray[i].y - pointArray[i + 1].y,
            pointArray[i].x - pointArray[i + 1].x
        );
        let a = (a1 + a2) / 2;
        if (a < a2) {
            a += Math.PI;
        }
        vtxlist0.push(
            new Point(
                pointArray[i].x + w * Math.cos(a),
                pointArray[i].y + w * Math.sin(a)
            )
        );
        vtxlist1.push(
            new Point(
                pointArray[i].x - w * Math.cos(a),
                pointArray[i].y - w * Math.sin(a)
            )
        );
    }
    const l = pointArray.length - 1;
    const a0 =
        Math.atan2(
            pointArray[1].y - pointArray[0].y,
            pointArray[1].x - pointArray[0].x
        ) -
        Math.PI / 2;
    const a1 =
        Math.atan2(
            pointArray[l].y - pointArray[l - 1].y,
            pointArray[l].x - pointArray[l - 1].x
        ) -
        Math.PI / 2;
    const w0 = wfun(0);
    const w1 = wfun(1);
    vtxlist0.unshift(
        new Point(
            pointArray[0].x + w0 * Math.cos(a0),
            pointArray[0].y + w0 * Math.sin(a0)
        )
    );
    vtxlist1.unshift(
        new Point(
            pointArray[0].x - w0 * Math.cos(a0),
            pointArray[0].y - w0 * Math.sin(a0)
        )
    );
    vtxlist0.push(
        new Point(
            pointArray[l].x + w1 * Math.cos(a1),
            pointArray[l].y + w1 * Math.sin(a1)
        )
    );
    vtxlist1.push(
        new Point(
            pointArray[l].x - w1 * Math.cos(a1),
            pointArray[l].y - w1 * Math.sin(a1)
        )
    );
    return [vtxlist0, vtxlist1];
}

/**
 * Transforms a polygon defined by a point array using a line segment.
 * @notExported
 * @param {Point} p0 - The starting point of the line segment.
 * @param {Point} p1 - The ending point of the line segment.
 * @param {Point[]} pointArray - The array of points defining the polygon.
 * @returns {Point[]} The transformed polygon.
 */
export function transformPolyline(
    p0: Point,
    p1: Point,
    pointArray: Point[]
): Point[] {
    const array = pointArray.map(function (v) {
        return new Point(-v.x, v.y);
    });
    const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x) - Math.PI / 2;
    const scl = distance(p0, p1);
    const qlist = array.map(function (v) {
        const d = distance(v, new Point(0, 0));
        const a = Math.atan2(v.y, v.x);
        return new Point(
            p0.x + d * scl * Math.cos(ang + a),
            p0.y + d * scl * Math.sin(ang + a)
        );
    });
    return qlist;
}

/**
 * Flips a polygon horizontally if the horizontalFlip is true. Otherwise return original array.
 *
 * @param {Point[]} pointArray - The array of points defining the polygon.
 * @param {boolean} horizontalFlip - Whether to perform a horizontal flip.
 * @returns {Point[]} The flipped polygon.
 */
export const flipPolyline = function (
    pointArray: Point[],
    horizontalFlip: boolean
): Point[] {
    return pointArray.map(function (v) {
        return horizontalFlip ? new Point(-v.x, v.y) : v;
    });
};
/**
 * Scaling function for sleeve.
 * @notExported
 * @param {number} scaling - The scaling factor.
 * @param {number} value - The input value.
 * @returns {number} The scaled output value.
 */
function fsleeve(scaling: number, value: number): number {
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
 * @notExported
 * @param {number} scaling - The scaling factor.
 * @param {number} value - The input value.
 * @returns {number} The scaled output value.
 */
function fbody(scaling: number, value: number): number {
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
 * @notExported
 * @param {number} scaling - The scaling factor.
 * @param {number} value - The input value.
 * @returns {number} The scaled output value.
 */
function fhead(scaling: number, value: number): number {
    return scaling * 7 * Math.pow(0.25 - Math.pow(value - 0.5, 2), 0.3);
}

//      2
//    1/
// 7/  | \_ 6
// 8| 0 \ 5
//      /3
//     4
/**
 * Generates a man using various parameters and styling functions.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - X-coordinate offset for the man.
 * @param {number} yOffset - Y-coordinate offset for the man.
 * @param {boolean} [horizontalFlip=true] - Indicates whether the man is flipped horizontally.
 * @param {number} [scalling=0.5] - Scaling factor for the man.
 * @param {number[]} [lengthArray=[0, 30, 20, 30, 30, 30, 30, 30, 30]] - Array representing the lengths of different body parts.
 * @param {(prng: PRNG, p1: Point, p2: Point, horizontalFlip: boolean) => SvgPolyline[]} ite
 *   - Iteration function for generating specific body parts.
 * @param {(prng: PRNG, p1: Point, p2: Point, horizontalFlip: boolean) => SvgPolyline[]} hat
 *   - Hat styling function.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the man.
 */
export function generateMan(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    horizontalFlip: boolean = true,
    scalling: number = 0.5,
    lengthArray: number[] = [0, 30, 20, 30, 30, 30, 30, 30, 30],
    ite: (
        prng: PRNG,
        p1: Point,
        p2: Point,
        horizontalFlip: boolean
    ) => SvgPolyline[] = (_1: PRNG, _2: Point, _3: Point, _4: boolean) => [],
    hat: (
        prng: PRNG,
        p1: Point,
        p2: Point,
        horizontalFlip: boolean
    ) => SvgPolyline[] = generateHat01
): SvgPolyline[] {
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
    const len = lengthArray.map(function (v) {
        return v * scalling;
    });

    const polylineArray: SvgPolyline[][] = [];

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

    const toGlobal = function (point: IPoint) {
        return new Point(
            (horizontalFlip ? -1 : 1) * point.x + xOffset,
            point.y + yOffset
        );
    };

    const vectorArray: Vector[] = [];
    for (let i = 0; i < ang.length; i++) {
        vectorArray.push(
            struct[i].reduce<Vector>((pos: Vector, par: number) => {
                // rotate angle of part[i]
                const rot = struct[par].reduce((s, j) => s + ang[j], 0);
                return pos.move(Vector.unit(rot).scale(len[par]));
            }, new Vector(0, 0))
        );
    }
    yOffset -= vectorArray[4].y;

    const _fsleeve = (value: number) => fsleeve(scalling, value);
    const _fbody = (value: number) => fbody(scalling, value);
    const _fhead = (value: number) => fhead(scalling, value);

    polylineArray.push(
        ite(
            prng,
            toGlobal(vectorArray[8]),
            toGlobal(vectorArray[6]),
            horizontalFlip
        )
    );

    polylineArray.push(
        generateCloth(
            prng,
            toGlobal,
            [vectorArray[1], vectorArray[7], vectorArray[8]].map((v) =>
                v.moveFrom(Point.O)
            ),
            _fsleeve
        )
    );
    polylineArray.push(
        generateCloth(
            prng,
            toGlobal,
            [
                vectorArray[1],
                vectorArray[0],
                vectorArray[3],
                vectorArray[4],
            ].map((vector) => vector.moveFrom(Point.O)),
            _fbody
        )
    );
    polylineArray.push(
        generateCloth(
            prng,
            toGlobal,
            [vectorArray[1], vectorArray[5], vectorArray[6]].map((vector) =>
                vector.moveFrom(Point.O)
            ),
            _fsleeve
        )
    );
    polylineArray.push(
        generateCloth(
            prng,
            toGlobal,
            [vectorArray[1], vectorArray[2]].map((vector) =>
                vector.moveFrom(Point.O)
            ),
            _fhead
        )
    );

    const hlist = generateBezierCurve(
        [vectorArray[1], vectorArray[2]].map((vector) =>
            vector.moveFrom(Point.O)
        )
    );
    const [hlist1, hlist2] = expand(hlist, _fhead);
    hlist1.splice(0, Math.floor(hlist1.length * 0.1));
    hlist2.splice(0, Math.floor(hlist2.length * 0.95));
    polylineArray.push([
        new SvgPolyline(
            hlist1.concat(hlist2.reverse()).map(toGlobal),
            0,
            0,
            "rgba(100,100,100,0.6)"
        ),
    ]);

    polylineArray.push(
        hat(
            prng,
            toGlobal(vectorArray[1]),
            toGlobal(vectorArray[2]),
            horizontalFlip
        )
    );

    return polylineArray.flat();
}
