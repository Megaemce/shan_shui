import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { div } from "../brushes/div";

/**
 * Generates a box using procedural generation.
 * @notExported
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {number} xOffset - The x-coordinate offset for the box.
 * @param {number} yOffset - The y-coordinate offset for the box.
 * @param {number} [height=20] - The height of the box.
 * @param {number} [width=120] - The width of the box.
 * @param {number} [rotation=0.7] - The rotation factor of the box.
 * @param {number} [perturbation=4] - The perturbation factor of the box.
 * @param {boolean} [hasTransparency=true] - Indicates whether the box has transparency.
 * @param {boolean} [hasBottom=true] - Indicates whether the box has a bottom.
 * @param {number} [strokeWidth=3] - The stroke width of the box.
 * @param {(upperLeftPoint: Point, upperRightPoint: Point, bottomLeftPoint: Point, bottomRightPoint: Point) => Point[][]} [decorator=() => []] - The decorator function for additional features.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the box.
 */
export function generateBox(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 20,
    width: number = 120,
    rotation: number = 0.7,
    perturbation: number = 4,
    hasTransparency: boolean = true,
    hasBottom: boolean = true,
    strokeWidth: number = 3,
    decorator: (
        upperLeftPoint: Point,
        upperRightPoint: Point,
        bottomLeftPoint: Point,
        bottomRightPoint: Point
    ) => Point[][] = () => []
): SvgPolyline[] {
    const mid = -width * 0.5 + width * rotation;
    const bmid = -width * 0.5 + width * (1 - rotation);
    const pointList: Point[][] = [];
    pointList.push(
        div([new Point(-width * 0.5, -height), new Point(-width * 0.5, 0)], 5)
    );
    pointList.push(
        div([new Point(width * 0.5, -height), new Point(width * 0.5, 0)], 5)
    );
    if (hasBottom) {
        pointList.push(
            div([new Point(-width * 0.5, 0), new Point(mid, perturbation)], 5)
        );
        pointList.push(
            div([new Point(width * 0.5, 0), new Point(mid, perturbation)], 5)
        );
    }
    pointList.push(
        div([new Point(mid, -height), new Point(mid, perturbation)], 5)
    );
    if (hasTransparency) {
        if (hasBottom) {
            pointList.push(
                div(
                    [
                        new Point(-width * 0.5, 0),
                        new Point(bmid, -perturbation),
                    ],
                    5
                )
            );
            pointList.push(
                div(
                    [new Point(width * 0.5, 0), new Point(bmid, -perturbation)],
                    5
                )
            );
        }
        pointList.push(
            div([new Point(bmid, -height), new Point(bmid, -perturbation)], 5)
        );
    }

    const surface = (rotation < 0.5 ? 1 : 0) * 2 - 1;
    const extendedPointList = pointList.concat(
        decorator(
            new Point(surface * width * 0.5, -height),
            new Point(mid, -height + perturbation),
            new Point(surface * width * 0.5, 0),
            new Point(mid, perturbation)
        )
    );

    const polylineList: SvgPolyline[] = [];
    if (!hasTransparency) {
        polylineList.push(
            SvgPolyline.createPolyline(
                [
                    new Point(width * 0.5, -height),
                    new Point(width * 0.5, -height),
                    new Point(width * 0.5, 0),
                    new Point(mid, perturbation),
                    new Point(-width * 0.5, 0),
                ],
                xOffset,
                yOffset,
                "white",
                "none"
            )
        );
    }

    for (let i = 0; i < extendedPointList.length; i++) {
        polylineList.push(
            generateStroke(
                prng,
                extendedPointList[i].map(function (p) {
                    return new Point(p.x + xOffset, p.y + yOffset);
                }),
                "rgba(100,100,100,0.4)",
                "rgba(100,100,100,0.4)",
                strokeWidth,
                1,
                1,
                () => 1
            )
        );
    }
    return polylineList;
}
