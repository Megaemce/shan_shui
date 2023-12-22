import { Point } from "../../classes/Point";

/**
 * Divides a polyline into a higher resolution.
 * @param pointArray - Array of points defining the original polyline.
 * @param resolution - Resolution factor.
 * @returns Array of points representing the higher resolution polyline.
 */

export function div(pointArray: Point[], resolution: number): Point[] {
    const totalLength = (pointArray.length - 1) * resolution;
    const result = [];

    for (let i = 0; i < totalLength; i += 1) {
        const lastPoint = pointArray[Math.floor(i / resolution)];
        const nextPoint = pointArray[Math.ceil(i / resolution)];
        const progress = (i % resolution) / resolution;
        const newX = lastPoint.x * (1 - progress) + nextPoint.x * progress;
        const newY = lastPoint.y * (1 - progress) + nextPoint.y * progress;

        result.push(new Point(newX, newY));
    }

    if (pointArray.length > 0) {
        result.push(pointArray[pointArray.length - 1]);
    }

    return result;
}
