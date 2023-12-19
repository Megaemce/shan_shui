import { distance, Point } from "./point";

/**
 * Calculates the midpoint of an array of points.
 * @param points - An array of Point instances.
 * @returns The midpoint as a new Point.
 */
export function midPoint(points: Point[]): Point {
    const sum = points.reduce(
        (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
        { x: 0, y: 0 }
    );
    return new Point(sum.x / points.length, sum.y / points.length);
}

/**
 * Calculates the slope and y-intercept of a line passing through two points.
 * @param point0 - The first point.
 * @param point1 - The second point.
 * @returns An array containing the slope and y-intercept.
 */
function lineExpression(point0: Point, point1: Point): [number, number] {
    const denominator = point1.x - point0.x;
    const slope =
        denominator === 0 ? Infinity : (point1.y - point0.y) / denominator;
    const intercept = point0.y - slope * point0.x;
    return [slope, intercept];
}

/**
 * Checks if a point lies on a line segment.
 * @param point - The point to check.
 * @param line - An array representing the line segment [start, end].
 * @returns `true` if the point lies on the segment, otherwise `false`.
 */
function isOnSegment(point: Point, line: Point[]): boolean {
    return (
        Math.min(line[0].x, line[1].x) <= point.x &&
        point.x <= Math.max(line[0].x, line[1].x) &&
        Math.min(line[0].y, line[1].y) <= point.y &&
        point.y <= Math.max(line[0].y, line[1].y)
    );
}

/**
 * Checks if two line segments intersect.
 * @param line0 - The first line segment [start, end].
 * @param line1 - The second line segment [start, end].
 * @returns `true` if the line segments intersect, otherwise `false`.
 */
function doIntersect(line0: Point[], line1: Point[]): boolean {
    const [slope0, intercept0] = lineExpression(line0[0], line0[1]);
    const [slope1, intercept1] = lineExpression(line1[0], line1[1]);

    const denominator = slope0 - slope1;
    if (denominator === 0) {
        return false;
    }

    const x = (intercept1 - intercept0) / denominator;
    const y = slope0 * x + intercept0;
    const intersectionPoint = new Point(x, y);

    return (
        isOnSegment(intersectionPoint, line0) &&
        isOnSegment(intersectionPoint, line1)
    );
}

/**
 * Checks if a point is inside a polygon.
 * @param point - The point to check.
 * @param polygon - An array of points representing the polygon.
 * @returns `true` if the point is inside the polygon, otherwise `false`.
 */
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
    let intersectionCount = 0;
    for (let i = 0; i < polygon.length; i++) {
        const nextPoint =
            i !== polygon.length - 1 ? polygon[i + 1] : polygon[0];
        const doesIntersect = doIntersect(
            [polygon[i], nextPoint],
            [point, new Point(point.x + 999, point.y + 999)]
        );
        if (doesIntersect) {
            intersectionCount++;
        }
    }
    return intersectionCount % 2 === 1;
}

/**
 * Checks if a line segment is inside a polygon.
 * @param line - The line segment [start, end].
 * @param polygon - An array of points representing the polygon.
 * @returns `true` if the line segment is inside the polygon, otherwise `false`.
 */
function isLineInPolygon(line: Point[], polygon: Point[]): boolean {
    const extendedLine = [new Point(), new Point()];
    const epsilon = 0.01;

    extendedLine[0].x = line[0].x * (1 - epsilon) + line[1].x * epsilon;
    extendedLine[0].y = line[0].y * (1 - epsilon) + line[1].y * epsilon;
    extendedLine[1].x = line[0].x * epsilon + line[1].x * (1 - epsilon);
    extendedLine[1].y = line[0].y * epsilon + line[1].y * (1 - epsilon);

    for (let i = 0; i < polygon.length; i++) {
        const currentPoint = polygon[i];
        const nextPoint =
            i !== polygon.length - 1 ? polygon[i + 1] : polygon[0];
        if (doIntersect(extendedLine, [currentPoint, nextPoint])) {
            return false;
        }
    }
    const mid = midPoint([line[0], line[1]]);
    if (!isPointInPolygon(mid, polygon)) {
        return false;
    }
    return true;
}

/**
 * Calculates the lengths of sides in a polygon.
 * @param plist - An array of points representing the polygon.
 * @returns An array of side lengths.
 */
function calculateSideLengths(plist: Point[]): number[] {
    return plist.map((pt, i) => {
        const np = plist[i !== plist.length - 1 ? i + 1 : 0];
        return distance(pt, np);
    });
}

/**
 * Calculates the area of a triangle using its side lengths.
 * @param sideLengths - An array of side lengths [a, b, c].
 * @returns The area of the triangle.
 */
function calculateTriangleArea(sideLengths: number[]): number {
    const [a, b, c] = sideLengths;
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

/**
 * Calculates the sliver ratio of a polygon.
 * @param plist - An array of points representing the polygon.
 * @returns The sliver ratio of the polygon.
 */
function calculateSliverRatio(plist: Point[]): number {
    const area = calculateTriangleArea(calculateSideLengths(plist));
    const perimeter = calculateSideLengths(plist).reduce(
        (acc, side) => acc + side,
        0
    );
    return area / perimeter;
}

/**
 * Finds the best ear in the polygon and returns the ear and the remaining vertices.
 * @param plist The list of polygon vertices.
 * @param convex Indicates whether the polygon is convex.
 * @param optimize Indicates whether to optimize the ear finding.
 * @returns A tuple containing the ear and the remaining vertices.
 */
function findBestEar(plist: Point[], convex: boolean, optimize: boolean) {
    const cuts = [];
    for (let i = 0; i < plist.length; i++) {
        const pt = plist[i];
        const lp = plist[i !== 0 ? i - 1 : plist.length - 1];
        const np = plist[i !== plist.length - 1 ? i + 1 : 0];
        const qlist = plist.slice();
        qlist.splice(i, 1);
        if (convex || isLineInPolygon([lp, np], plist)) {
            const c = [[lp, pt, np], qlist];
            if (!optimize) return c;
            cuts.push(c);
        }
    }
    let best = [plist, []];
    let bestRatio = 0;
    cuts.forEach((i) => {
        const r = calculateSliverRatio(i[0]);
        if (r >= bestRatio) {
            best = i;
            bestRatio = r;
        }
    });
    return best;
}

/**
 * Break a triangle into a series of triangles with an area not exceeding a.
 * @param plist The triangle to be broken.
 * @param a Maximum area for each resulting triangle.
 * @returns An array of triangles.
 */
function shatterTriangle(plist: Point[], a: number): Point[][] {
    if (plist.length === 0 || a === 0) {
        return [];
    }

    if (calculateTriangleArea(calculateSideLengths(plist)) < a) {
        return [plist];
    } else {
        try {
            const sideLengths = calculateSideLengths(plist);
            const ind = sideLengths.reduce(
                (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
                0
            );
            const nind = (ind + 1) % plist.length;
            const lind = (ind + 2) % plist.length;
            const mid = midPoint([plist[ind], plist[nind]]);
            return shatterTriangle([plist[ind], mid, plist[lind]], a).concat(
                shatterTriangle([plist[lind], plist[nind], mid], a)
            );
        } catch (err) {
            console.log(plist);
            console.log(err);
            return [];
        }
    }
}

/**
 * Triangulates a polygon and returns a list of triangles.
 * @param plist The list of polygon vertices.
 * @param area Maximum area for each resulting triangle.
 * @param convex Indicates whether the polygon is convex.
 * @param optimize Indicates whether to optimize the triangulation.
 * @returns An array of triangles.
 */
export function triangulate(
    plist: Point[],
    area: number = 100,
    convex: boolean = false,
    optimize: boolean = false
): Point[][] {
    if (plist.length <= 3) {
        return shatterTriangle(plist, area);
    }

    const [ear, remainder] = findBestEar(plist, convex, optimize);

    return [
        ...shatterTriangle(ear, area),
        ...triangulate(remainder, area, convex, optimize),
    ];
}
