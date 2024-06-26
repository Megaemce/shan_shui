import Structure from "../Structure";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Element from "../Element";
import { lineDivider } from "../../utils/polytools";
import boxDecoration from "../../utils/boxDecoration";

/**
 * Represents a box generated using procedural generation.
 */
export default class Box extends Structure {
    /**
     * Constructs a Box object with the specified parameters.
     *
     * @param {number} xOffset - The x-coordinate offset for the box.
     * @param {number} yOffset - The y-coordinate offset for the box.
     * @param {number} [height=20] - The height of the box.
     * @param {number} [width=120] - The width of the box.
     * @param {number} [rotation=0.7] - The rotation factor of the box.
     * @param {number} [perspective=4] - The perspective factor of the box.
     * @param {boolean} [hasTransparency=true] - Indicates whether the box has transparency.
     * @param {boolean} [hasBottom=true] - Indicates whether the box has a bottom.
     * @param {number} [strokeWidth=3] - The stroke width of the box.
     * @param {number} [style=666] - The style of the box (no style at all).
     * @param {number} [horizontalSubPoints=3] - The number of horizontal sub-points.
     * @param {number} [verticalSubPoints=2] - The number of vertical sub-points.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        height: number = 20,
        width: number = 120,
        rotation: number = 0.7,
        perspective: number = 4,
        hasTransparency: boolean = true,
        hasBottom: boolean = true,
        strokeWidth: number = 3,
        style: number = 666, // no style at all
        horizontalSubPoints: number = 3,
        verticalSubPoints: number = 2
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
            boxDecoration(
                style,
                new Point(surface * right, top),
                new Point(front_x, top + front_y),
                new Point(surface * right, bottom),
                new Point(front_x, front_y),
                horizontalSubPoints,
                verticalSubPoints
            )
        );

        if (!hasTransparency) {
            this.add(
                new Element(
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
