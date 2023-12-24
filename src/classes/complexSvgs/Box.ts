import Point from "../Point";
import PRNG from "../PRNG";
import ComplexSvg from "../ComplexSvg";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import { div } from "../../utils/div";

/**
 * Represents a box generated using procedural generation.
 */
export default class Box extends ComplexSvg {
    /**
     * @param {PRNG} prng - The pseudorandom number generator.
     * @param {number} xOffset - The x-coordinate offset for the box.
     * @param {number} yOffset - The y-coordinate offset for the box.
     * @param {number} [height=20] - The height of the box.
     * @param {number} [width=120] - The width of the box.
     * @param {number} [rotation=0.7] - The rotation factor of the box.
     * @param {number} [perspective=4] - The perspective factor of the box.
     * @param {boolean} [hasTransparency=true] - Indicates whether the box has transparency.
     * @param {boolean} [hasBottom=true] - Indicates whether the box has a bottom.
     * @param {number} [strokeWidth=3] - The stroke width of the box.
     * @param {(upperLeftPoint: Point, upperRightPoint: Point, bottomLeftPoint: Point, bottomRightPoint: Point) => Point[][]} [decorator=() => []] - The decorator function for additional features.
     */
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        height: number = 20,
        width: number = 120,
        rotation: number = 0.7,
        perspective: number = 4,
        hasTransparency: boolean = true,
        hasBottom: boolean = true,
        strokeWidth: number = 3,
        decorator: (
            upperLeftPoint: Point,
            upperRightPoint: Point,
            bottomLeftPoint: Point,
            bottomRightPoint: Point
        ) => Point[][] = () => []
    ) {
        super();

        const mid = -width * 0.5 + width * rotation;
        const bmid = -width * 0.5 + width * (1 - rotation);
        const pointList: Point[][] = [];
        pointList.push(
            div(
                [new Point(-width * 0.5, -height), new Point(-width * 0.5, 0)],
                5
            )
        );
        pointList.push(
            div([new Point(width * 0.5, -height), new Point(width * 0.5, 0)], 5)
        );
        if (hasBottom) {
            pointList.push(
                div(
                    [new Point(-width * 0.5, 0), new Point(mid, perspective)],
                    5
                )
            );
            pointList.push(
                div([new Point(width * 0.5, 0), new Point(mid, perspective)], 5)
            );
        }
        pointList.push(
            div([new Point(mid, -height), new Point(mid, perspective)], 5)
        );
        if (hasTransparency) {
            if (hasBottom) {
                pointList.push(
                    div(
                        [
                            new Point(-width * 0.5, 0),
                            new Point(bmid, -perspective),
                        ],
                        5
                    )
                );
                pointList.push(
                    div(
                        [
                            new Point(width * 0.5, 0),
                            new Point(bmid, -perspective),
                        ],
                        5
                    )
                );
            }
            pointList.push(
                div(
                    [new Point(bmid, -height), new Point(bmid, -perspective)],
                    5
                )
            );
        }

        const surface = (rotation < 0.5 ? 1 : 0) * 2 - 1;
        const extendedPointList = pointList.concat(
            decorator(
                new Point(surface * width * 0.5, -height),
                new Point(mid, -height + perspective),
                new Point(surface * width * 0.5, 0),
                new Point(mid, perspective)
            )
        );

        if (!hasTransparency) {
            this.add(
                new SvgPolyline(
                    [
                        new Point(width * 0.5, -height),
                        new Point(width * 0.5, -height),
                        new Point(width * 0.5, 0),
                        new Point(mid, perspective),
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
            this.add(
                new Stroke(
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
    }
}
