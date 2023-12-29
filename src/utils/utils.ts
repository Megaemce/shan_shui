import { midPoint } from "./polytools";
import Point from "../classes/Point";
import Range from "../classes/Range";
import ISvgAttributes from "../interfaces/ISvgAttributes";
import ISvgStyles from "../interfaces/ISvgStyles";
import { config } from "../config";

/**
 * Computes the scaled cosine of the given value.
 * @param i - The input value.
 * @returns The scaled cosine value.
 */
export function scaledCosine(i: number): number {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
}

/**
 * Expands a given array of points using a width function.
 * @param {Point[]} pointArray - The array of points to be expanded.
 * @param {(v: number) => number} scalingFunction - The scaling function
 * @returns {Point[][]} An array containing two sets of expanded points.
 */
export function expand(
    pointArray: Point[],
    scalingFunction: (v: number) => number
): Point[][] {
    const vtxlist0 = new Array<Point>(pointArray.length);
    const vtxlist1 = new Array<Point>(pointArray.length);
    const lastIndex = pointArray.length - 1;

    for (let i = 1; i < lastIndex; i++) {
        const w = scalingFunction(i / pointArray.length);
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

        vtxlist0[i] = new Point(
            pointArray[i].x + w * Math.cos(a),
            pointArray[i].y + w * Math.sin(a)
        );

        vtxlist1[i] = new Point(
            pointArray[i].x - w * Math.cos(a),
            pointArray[i].y - w * Math.sin(a)
        );
    }
    // Calculate the angle perpendicular to the line connecting pointArray[0] and pointArray[1]
    const a0 =
        Math.atan2(
            pointArray[1].y - pointArray[0].y,
            pointArray[1].x - pointArray[0].x
        ) -
        Math.PI / 2;
    const a1 =
        Math.atan2(
            pointArray[lastIndex].y - pointArray[lastIndex - 1].y,
            pointArray[lastIndex].x - pointArray[lastIndex - 1].x
        ) -
        Math.PI / 2;
    const w0 = scalingFunction(0);
    const w1 = scalingFunction(1);

    vtxlist0[0] = new Point(
        pointArray[0].x + w0 * Math.cos(a0),
        pointArray[0].y + w0 * Math.sin(a0)
    );
    vtxlist1[0] = new Point(
        pointArray[0].x - w0 * Math.cos(a0),
        pointArray[0].y - w0 * Math.sin(a0)
    );

    vtxlist0[lastIndex] = new Point(
        pointArray[lastIndex].x + w1 * Math.cos(a1),
        pointArray[lastIndex].y + w1 * Math.sin(a1)
    );
    vtxlist1[lastIndex] = new Point(
        pointArray[lastIndex].x - w1 * Math.cos(a1),
        pointArray[lastIndex].y - w1 * Math.sin(a1)
    );

    return [vtxlist0, vtxlist1];
}

/**
 * Checks if a point is a local maximum within a circular area.
 * @param {Point} center - The center point to check.
 * @param {Function} getValue - The function to get the value at a given point.
 * @param {number} radius - The radius of the circular area.
 * @returns {boolean} True if the center point is a local maximum, false otherwise.
 */
export function isLocalMaximum(
    center: Point,
    getValue: Function,
    radius: number
): boolean {
    const centerValue = getValue(center);

    for (let x = center.x - radius; x <= center.x + radius; x++) {
        for (let y = center.y - radius; y <= center.y + radius; y++) {
            const neighborValue = getValue(new Point(x, y));

            if (centerValue < neighborValue) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Converts a camelCase string to kebab-case.
 * @param key - The input camelCase string.
 * @returns The converted kebab-case string.
 */
function camelToKebab(key: string): string {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.split(" ").join("-").toLowerCase();
}

/**
 * Converts a style attribute object to a string.
 * @param attr - The style attribute object.
 * @returns The string representation of the style attributes.
 */
function styleToString(attr: Partial<ISvgStyles>): string {
    const strlist = Object.entries(attr).map(
        ([key, value]) => `${camelToKebab(key)}:${value}`
    );
    return `${strlist.join(";")}`;
}

/**
 * Converts an attribute object to a string.
 * @param attr - The attribute object.
 * @returns The string representation of the attributes.
 */
export function attributesToString(attr: Partial<ISvgAttributes>): string {
    const strlist = Object.entries(attr).map(([key, value]) => {
        const vstr =
            key === "style" && attr.style ? styleToString(attr.style) : value;
        return `${camelToKebab(key)}='${vstr}'`;
    });
    return strlist.join(" ");
}

/**
 * Loop through a noise list, adjusting values and normalizing them.
 * @param {number[]} noiseArray - The noise list.
 * @returns {number[]} The normalized noise list.
 */
export function normalizeNoise(noiseArray: number[]): number[] {
    const dif = noiseArray[noiseArray.length - 1] - noiseArray[0];

    let leftBoundary = 100;
    let rightBoundary = -100;

    noiseArray.forEach((value, i) => {
        noiseArray[i] +=
            (dif * (noiseArray.length - 1 - i)) / (noiseArray.length - 1);
        leftBoundary = Math.min(leftBoundary, value);
        rightBoundary = Math.max(rightBoundary, value);
    });

    const inputRange = new Range(leftBoundary, rightBoundary);
    const outputRange = new Range(0, 1);

    return noiseArray.map((value) => inputRange.mapValue(value, outputRange));
}

/**
 * Generate a Bezier curve through a list of control points.
 * @param {Point[]} controlPoints - The list of control points.
 * @returns {Point[]} A list of points representing the Bezier curve.
 */
export function generateBezierCurve(controlPoints: Point[]): Point[] {
    const POINTCOUNT = config.utils.bezierCurvePoints;

    if (controlPoints.length === 2) {
        const midPointControl = midPoint(controlPoints);
        controlPoints = [controlPoints[0], midPointControl, controlPoints[1]];
    }

    const curvePoints: Point[] = [];

    for (let j = 0; j < controlPoints.length - 2; j++) {
        const p0 =
            j === 0
                ? controlPoints[j]
                : midPoint([controlPoints[j], controlPoints[j + 1]]);
        const p1 = controlPoints[j + 1];
        const p2 =
            j === controlPoints.length - 3
                ? controlPoints[j + 2]
                : midPoint([controlPoints[j + 1], controlPoints[j + 2]]);

        const hasBuffer = j === controlPoints.length - 3 ? 1 : 0;

        for (let i = 0; i < POINTCOUNT + hasBuffer; i += 1) {
            const t = i / POINTCOUNT;
            const a0 = (1 - t) * (1 - t);
            const a1 = 2 * t * (1 - t);
            const a2 = t * t;
            const x = a0 * p0.x + a1 * p1.x + a2 * p2.x;
            const y = a0 * p0.y + a1 * p1.y + a2 * p2.y;
            curvePoints.push(new Point(x, y));
        }
    }

    return curvePoints;
}
