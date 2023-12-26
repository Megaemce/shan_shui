import Point from "../Point";
import PRNG from "../PRNG";
import ComplexSvg from "../ComplexSvg";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import { lineDivider } from "../../utils/polytools";

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

        const left = -width / 2;
        const right = width / 2;
        const top = -height;
        const bottom = 0;
        const front_x = left + width * rotation;
        const front_y = perspective;
        const back_x = left + width * (1 - rotation);
        const back_y = -perspective;

        const pointList: Point[][] = [];
        pointList.push(
            lineDivider([new Point(left, top), new Point(left, bottom)], 5)
        );
        pointList.push(
            lineDivider([new Point(right, top), new Point(right, bottom)], 5)
        );
        if (hasBottom) {
            pointList.push(
                lineDivider(
                    [new Point(left, bottom), new Point(front_x, front_y)],
                    5
                )
            );
            pointList.push(
                lineDivider(
                    [new Point(right, bottom), new Point(front_x, front_y)],
                    5
                )
            );
        }
        pointList.push(
            lineDivider(
                [new Point(front_x, top), new Point(front_x, front_y)],
                5
            )
        );
        if (hasTransparency) {
            if (hasBottom) {
                pointList.push(
                    lineDivider(
                        [new Point(left, bottom), new Point(back_x, back_y)],
                        5
                    )
                );
                pointList.push(
                    lineDivider(
                        [new Point(right, bottom), new Point(back_x, back_y)],
                        5
                    )
                );
            }
            pointList.push(
                lineDivider(
                    [new Point(back_x, top), new Point(back_x, back_y)],
                    5
                )
            );
        }

        const surface = (rotation < 0.5 ? 1 : 0) * 2 - 1;
        const extendedPointList = pointList.concat(
            decorator(
                new Point(surface * right, top),
                new Point(front_x, top + front_y),
                new Point(surface * right, bottom),
                new Point(front_x, front_y)
            )
        );

        if (!hasTransparency) {
            this.add(
                new SvgPolyline(
                    [
                        new Point(left, top),
                        new Point(right, top),
                        new Point(right, bottom),
                        new Point(front_x, front_y),
                        new Point(left, bottom),
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
