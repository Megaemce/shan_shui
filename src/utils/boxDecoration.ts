import Point from "../classes/Point";
import { lineDivider } from "./polytools";

/**
 * Generates decorative elements based on the specified style.
 * @param {number} style - The style of decoration to generate.
 * @param {Point} [upperLeftPoint=new Point(0,0)] - The upper-left point of the bounding box.
 * @param {Point} [upperRightPoint=new Point(0, 100)] - The upper-right point of the bounding box.
 * @param {Point} [bottomLeftPoint=new Point(100, 0)] - The lower-left point of the bounding box.
 * @param {Point} [bottomRightPoint=new Point(100, 100)] - The lower-right point of the bounding box.
 * @param {number} [horizontalSubPoints=3] - The horizontal sub points number.
 * @param {number} [verticalSubPoints=2] - The vertical sub points number.
 * @returns {Point[][]} An array of points representing the decorative elements.
 */
export default function boxDecoration(
    style: number,
    upperLeftPoint: Point = new Point(0, 0),
    upperRightPoint: Point = new Point(0, 100),
    bottomLeftPoint: Point = new Point(100, 0),
    bottomRightPoint: Point = new Point(100, 100),
    horizontalSubPoints: number = 3,
    verticalSubPoints: number = 2
): Point[][] {
    const pointArray: Point[][] = [];
    const leftLine = lineDivider(
        [upperLeftPoint, bottomLeftPoint],
        verticalSubPoints
    );
    const rightLine = lineDivider(
        [upperRightPoint, bottomRightPoint],
        verticalSubPoints
    );
    const upperLine = lineDivider(
        [upperLeftPoint, upperRightPoint],
        horizontalSubPoints
    );
    const bottomLine = lineDivider(
        [bottomLeftPoint, bottomRightPoint],
        horizontalSubPoints
    );

    if (style === 0) {
        // -| |-
        const middleLeftUpper = upperLine[1];
        const middleRightUpper = upperLine[upperLine.length - 2];
        const middleLeftBottom = bottomLine[1];
        const middleRightBottom = bottomLine[upperLine.length - 2];

        for (let i = 1; i < leftLine.length - 1; i++) {
            const nextLeft = leftLine[i];
            const nextRight = rightLine[i];
            const middleLeft = lineDivider(
                [middleLeftUpper, middleLeftBottom],
                verticalSubPoints
            )[i];
            const middleRight = lineDivider(
                [middleRightUpper, middleRightBottom],
                verticalSubPoints
            )[i];

            pointArray.push(lineDivider([middleLeft, nextLeft], 5));
            pointArray.push(lineDivider([middleRight, nextRight], 5));
        }

        pointArray.push(lineDivider([middleLeftUpper, middleLeftBottom], 5));
        pointArray.push(lineDivider([middleRightUpper, middleRightBottom], 5));
    } else if (style === 1) {
        // ||||
        for (let i = 1; i < upperLine.length - 1; i++) {
            const nextUpper = upperLine[i];
            const nextBottom = bottomLine[i];

            pointArray.push(lineDivider([nextUpper, nextBottom], 5));
        }
    } else if (style === 2) {
        // |##|
        const middleLeftUpper = upperLine[1];
        const middleRightUpper = upperLine[upperLine.length - 2];
        const middleLeftBottom = bottomLine[1];
        const middleRightBottom = bottomLine[upperLine.length - 2];

        for (let i = 1; i < leftLine.length - 1; i++) {
            const middleLeft = lineDivider(
                [middleLeftUpper, middleLeftBottom],
                verticalSubPoints
            )[i];
            const middleRight = lineDivider(
                [middleRightUpper, middleRightBottom],
                verticalSubPoints
            )[i];
            const middleUpper = lineDivider(
                [middleLeftUpper, middleRightUpper],
                verticalSubPoints
            )[i];
            const middleBottom = lineDivider(
                [middleLeftBottom, middleRightBottom],
                verticalSubPoints
            )[i];

            pointArray.push(lineDivider([middleLeft, middleRight], 5));
            pointArray.push(lineDivider([middleUpper, middleBottom], 5));
        }

        pointArray.push(lineDivider([middleLeftUpper, middleLeftBottom], 5));
        pointArray.push(lineDivider([middleRightUpper, middleRightBottom], 5));
    }
    return pointArray;
}
