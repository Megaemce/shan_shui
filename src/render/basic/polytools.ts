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
 * @notExported
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
 * @notExported
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
 * @notExported
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
 * @notExported
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
 * @notExported
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
 * @notExported
 * @param pointArray - An array of points representing the polygon.
 * @returns An array of side lengths.
 */
function calculateSideLengths(pointArray: Point[]): number[] {
    return pointArray.map((point, i) => {
        const nextPoint = pointArray[i !== pointArray.length - 1 ? i + 1 : 0];
        return distance(point, nextPoint);
    });
}

/**
 * Calculates the area of a triangle using its side lengths.
 * @notExported
 * @param {Point[]} pointArray - An array of points representing the vertices of the triangle.
 * @returns {number} The area of the triangle.
 * @throws {Error} Thrown if pointArray is not a valid array of minimum 3 points.
 */
function calculatePolygonArea(pointArray: Point[]): number {
    // Input validation
    if (!Array.isArray(pointArray) || pointArray.length < 3) {
        throw new Error(
            "Invalid input: pointArray must be an array with at least three points."
        );
    }

    let area = 0;
    // Use the shoelace formula to calculate the area
    for (let i = 0; i < pointArray.length; i++) {
        const currentPoint = pointArray[i];
        const nextPoint = pointArray[(i + 1) % pointArray.length];

        area += currentPoint.x * nextPoint.y - nextPoint.x * currentPoint.y;
    }

    return Math.abs(area) / 2;
}

/**
 * Calculates the sliver ratio of a polygon.
 * @notExported
 * @param pointArray - An array of points representing the polygon.
 * @returns The sliver ratio of the polygon.
 */
function calculateSliverRatio(pointArray: Point[]): number {
    const area = calculatePolygonArea(pointArray);
    const perimeter = calculateSideLengths(pointArray).reduce(
        (acc, side) => acc + side,
        0
    );
    return area / perimeter;
}

/**
 * Finds the best ear in the polygon and returns it along with the remaining vertices.
 * @notExported
 * @param {Point[]} pointArray - The list of polygon vertices.
 * @param {boolean} isConvex - Indicates whether the polygon is convex.
 * @param {boolean} optimize - Indicates whether to optimize the ear finding.
 * @returns {Point[][]} A tuple containing the optimal ear and the remaining vertices.
 */
function findBestEar(
    pointArray: Point[],
    isConvex: boolean,
    optimize: boolean
): Point[][] {
    const potentialEars = [];

    // go throu all the possible pointArray permutation
    for (let i = 0; i < pointArray.length; i++) {
        const point = pointArray[i];
        const lastPoint = pointArray[i !== 0 ? i - 1 : pointArray.length - 1];
        const nextPoint = pointArray[i !== pointArray.length - 1 ? i + 1 : 0];
        const remainingVertices = pointArray.filter((_, index) => index !== i);

        if (isConvex || isLineInPolygon([lastPoint, nextPoint], pointArray)) {
            const potentialEar = [
                [lastPoint, point, nextPoint],
                remainingVertices,
            ];

            if (!optimize) {
                return potentialEar;
            }

            potentialEars.push(potentialEar);
        }
    }

    let bestEar = [pointArray, []];
    let bestRatio = 0;

    potentialEars.forEach((ear) => {
        const ratio = calculateSliverRatio(ear[0]);

        if (ratio >= bestRatio) {
            bestEar = ear;
            bestRatio = ratio;
        }
    });

    return bestEar;
}

/**
 * Divides a triangle into a series of triangles with areas not exceeding limitArea.
 * @notExported
 * @param {Point[]} pointArray - The triangle to be divided.
 * @param {number} limitArea - The upper limit for triangle areas.
 * @returns {Point[][]} A series of triangles.
 */
function shatterTriangle(pointArray: Point[], limitArea: number): Point[][] {
    if (pointArray.length === 0 || limitArea === 0) {
        return [];
    }

    if (calculatePolygonArea(pointArray) < limitArea) {
        return [pointArray];
    } else {
        try {
            const sideLengths = calculateSideLengths(pointArray);
            const indexOfLongestSide = sideLengths.reduce(
                (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
                0
            );
            const nextIndex = (indexOfLongestSide + 1) % pointArray.length;
            const lastIndex = (indexOfLongestSide + 2) % pointArray.length;
            const mid = midPoint([
                pointArray[indexOfLongestSide],
                pointArray[nextIndex],
            ]);

            const firstTriangle = shatterTriangle(
                [pointArray[indexOfLongestSide], mid, pointArray[lastIndex]],
                limitArea
            );

            const secondTriangle = shatterTriangle(
                [pointArray[lastIndex], pointArray[nextIndex], mid],
                limitArea
            );

            return [...firstTriangle, ...secondTriangle];
        } catch (err) {
            console.log(pointArray);
            console.log(err);
            return [];
        }
    }
}

/**
 * Triangulates a polygon and returns a list of triangles.
 * @notExported
 * @param pointArray The list of polygon vertices.
 * @param area Maximum area for each resulting triangle.
 * @param isConvex Indicates whether the polygon is isConvex.
 * @param optimize Indicates whether to optimize the triangulation.
 * @returns An array of triangles.
 */
export function triangulate(
    pointArray: Point[],
    area: number = 100,
    isConvex: boolean = false,
    optimize: boolean = false
): Point[][] {
    if (pointArray.length <= 3) {
        return shatterTriangle(pointArray, area);
    }

    const [ear, remainder] = findBestEar(pointArray, isConvex, optimize);

    return [
        ...shatterTriangle(ear, area),
        ...triangulate(remainder, area, isConvex, optimize),
    ];
}
