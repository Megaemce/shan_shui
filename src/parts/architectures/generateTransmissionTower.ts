import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { div } from "../brushes/div";

/**
 * Generates a transmission tower using procedural generation.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the transmission tower.
 * @param yOffset - The y-coordinate offset for the transmission tower.
 * @returns An array of SvgPolyline representing the transmission tower.
 */

export function generateTransmissionTower(
    prng: PRNG,
    xOffset: number,
    yOffset: number
): SvgPolyline[] {
    const height = 100,
        strokeWidth = 20;

    const polylines: SvgPolyline[] = [];

    const toGlobal = (v: Point) => new Point(v.x + xOffset, v.y + yOffset);

    const quickStroke = function (points: Point[]) {
        return generateStroke(
            prng,
            div(points, 5).map(toGlobal),
            "rgba(100,100,100,0.4)",
            "rgba(100,100,100,0.4)",
            1,
            0.5,
            1,
            (_) => 0.5
        );
    };

    const p00 = new Point(-strokeWidth * 0.05, -height);
    const p01 = new Point(strokeWidth * 0.05, -height);

    const p10 = new Point(-strokeWidth * 0.1, -height * 0.9);
    const p11 = new Point(strokeWidth * 0.1, -height * 0.9);

    const p20 = new Point(-strokeWidth * 0.2, -height * 0.5);
    const p21 = new Point(strokeWidth * 0.2, -height * 0.5);

    const p30 = new Point(-strokeWidth * 0.5, 0);
    const p31 = new Point(strokeWidth * 0.5, 0);

    const bezierControlPoints = [
        new Point(0.7, -0.85),
        new Point(1, -0.675),
        new Point(0.7, -0.5),
    ];

    bezierControlPoints.forEach((controlPoint) => {
        polylines.push(
            quickStroke([
                new Point(
                    -controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(
                    controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
            ])
        );
        polylines.push(
            quickStroke([
                new Point(
                    -controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(0, (controlPoint.y - 0.05) * height),
            ])
        );
        polylines.push(
            quickStroke([
                new Point(
                    controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(0, (controlPoint.y - 0.05) * height),
            ])
        );

        polylines.push(
            quickStroke([
                new Point(
                    -controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(
                    -controlPoint.x * strokeWidth,
                    (controlPoint.y + 0.1) * height
                ),
            ])
        );
        polylines.push(
            quickStroke([
                new Point(
                    controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(
                    controlPoint.x * strokeWidth,
                    (controlPoint.y + 0.1) * height
                ),
            ])
        );
    });

    const line10 = div([p00, p10, p20, p30], 5);
    const line11 = div([p01, p11, p21, p31], 5);

    for (let i = 0; i < line10.length - 1; i++) {
        polylines.push(quickStroke([line10[i], line11[i + 1]]));
        polylines.push(quickStroke([line11[i], line10[i + 1]]));
    }

    polylines.push(quickStroke([p00, p01]));
    polylines.push(quickStroke([p10, p11]));
    polylines.push(quickStroke([p20, p21]));
    polylines.push(quickStroke([p00, p10, p20, p30]));
    polylines.push(quickStroke([p01, p11, p21, p31]));

    return polylines;
}
