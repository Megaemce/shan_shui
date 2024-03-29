import Structure from "../Structure";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Element from "../Element";
import { lineDivider } from "../../utils/polytools";
/**
 * Represents a Roof element.
 * @extends {Structure}
 */
export default class Roof extends Structure {
    /**
     * Constructor for the class.
     *
     * @param {number} xOffset - The x offset value.
     * @param {number} yOffset - The y offset value.
     * @param {number} [height = 20] - The height value.
     * @param {number} [width = 120] - The width value.
     * @param {number} [rotation = 0.7] - The rotation value.
     * @param {number} [strokeWidth = 3] - The stroke width value.
     * @param {number} [perspective = 4] - The perspective value.
     * @param {number} [cor = 5] - The corner radius value.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        height: number = 20,
        width: number = 120,
        rotation: number = 0.7,
        strokeWidth: number = 3,
        perspective: number = 4,
        cor: number = 5
    ) {
        super();

        const opf = function (pointArray: Point[]) {
            if (rotation < 0.5) {
                return pointArray.map((point) => new Point(-point.x, point.y));
            } else {
                return pointArray;
            }
        };

        const rrot = rotation < 0.5 ? 1 - rotation : rotation;

        const mid = -width * 0.5 + width * rrot;
        const quat = (mid + width * 0.5) * 0.5 - mid;

        const pointArray = [];
        pointArray.push(
            lineDivider(
                opf([
                    new Point(-width * 0.5 + quat, -height - perspective / 2),
                    new Point(
                        -width * 0.5 + quat * 0.5,
                        -height / 2 - perspective / 4
                    ),
                    new Point(-width * 0.5 - cor, 0),
                ]),
                5
            )
        );
        pointArray.push(
            lineDivider(
                opf([
                    new Point(mid + quat, -height),
                    new Point((mid + quat + width * 0.5) / 2, -height / 2),
                    new Point(width * 0.5 + cor, 0),
                ]),
                5
            )
        );
        pointArray.push(
            lineDivider(
                opf([
                    new Point(mid + quat, -height),
                    new Point(mid + quat / 2, -height / 2 + perspective / 2),
                    new Point(mid + cor, perspective),
                ]),
                5
            )
        );

        pointArray.push(
            lineDivider(
                opf([
                    new Point(-width * 0.5 - cor, 0),
                    new Point(mid + cor, perspective),
                ]),
                5
            )
        );
        pointArray.push(
            lineDivider(
                opf([
                    new Point(width * 0.5 + cor, 0),
                    new Point(mid + cor, perspective),
                ]),
                5
            )
        );

        pointArray.push(
            lineDivider(
                opf([
                    new Point(-width * 0.5 + quat, -height - perspective / 2),
                    new Point(mid + quat, -height),
                ]),
                5
            )
        );

        const polist = opf([
            new Point(-width * 0.5, 0),
            new Point(-width * 0.5 + quat, -height - perspective / 2),
            new Point(mid + quat, -height),
            new Point(width * 0.5, 0),
            new Point(mid, perspective),
        ]);
        this.add(new Element(polist, xOffset, yOffset, "white", "none"));

        for (let i = 0; i < pointArray.length; i++) {
            this.add(
                new Stroke(
                    pointArray[i].map(
                        (p) => new Point(p.x + xOffset, p.y + yOffset)
                    ),
                    "rgba(100,100,100,0.4)",
                    "rgba(100,100,100,0.4)",
                    strokeWidth,
                    1,
                    1,
                    (_) => 1
                )
            );
        }
    }
}
