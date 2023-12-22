import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { midPoint } from "../../utils/polytools";
import { ISvgElement } from "../../interfaces/ISvgElement";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { SvgText } from "../../classes/SvgText";
import { generateStroke } from "../brushes/generateStroke";
import { div } from "../brushes/div";

/**
 * Generates Roof SVG elements.
 * @notExported
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [height=20] - The height of the Roof.
 * @param {number} [width=120] - The width of the Roof.
 * @param {number} [rotation=0.7] - The rotation parameter for Roof.
 * @param {number} [strokeWidth=3] - The stroke width of the Roof.
 * @param {number} [perturbation=4] - The perturbation parameter for Roof generation.
 * @param {string} [text=""] - Additional text to put on the Roof.
 * @param {number} [cor=5] - The cor parameter for Roof generation.
 * @returns {ISvgElement[]} An array of SVG elements representing Roof.
 */
export function generateRoof(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 20,
    width: number = 120,
    rotation: number = 0.7,
    strokeWidth: number = 3,
    perturbation: number = 4,
    text: string = "",
    cor: number = 5
): ISvgElement[] {
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
        div(
            opf([
                new Point(-width * 0.5 + quat, -height - perturbation / 2),
                new Point(
                    -width * 0.5 + quat * 0.5,
                    -height / 2 - perturbation / 4
                ),
                new Point(-width * 0.5 - cor, 0),
            ]),
            5
        )
    );
    pointArray.push(
        div(
            opf([
                new Point(mid + quat, -height),
                new Point((mid + quat + width * 0.5) / 2, -height / 2),
                new Point(width * 0.5 + cor, 0),
            ]),
            5
        )
    );
    pointArray.push(
        div(
            opf([
                new Point(mid + quat, -height),
                new Point(mid + quat / 2, -height / 2 + perturbation / 2),
                new Point(mid + cor, perturbation),
            ]),
            5
        )
    );

    pointArray.push(
        div(
            opf([
                new Point(-width * 0.5 - cor, 0),
                new Point(mid + cor, perturbation),
            ]),
            5
        )
    );
    pointArray.push(
        div(
            opf([
                new Point(width * 0.5 + cor, 0),
                new Point(mid + cor, perturbation),
            ]),
            5
        )
    );

    pointArray.push(
        div(
            opf([
                new Point(-width * 0.5 + quat, -height - perturbation / 2),
                new Point(mid + quat, -height),
            ]),
            5
        )
    );

    const polylines: ISvgElement[] = [];

    const polist = opf([
        new Point(-width * 0.5, 0),
        new Point(-width * 0.5 + quat, -height - perturbation / 2),
        new Point(mid + quat, -height),
        new Point(width * 0.5, 0),
        new Point(mid, perturbation),
    ]);
    polylines.push(new SvgPolyline(polist, xOffset, yOffset, "white", "none"));

    for (let i = 0; i < pointArray.length; i++) {
        polylines.push(
            generateStroke(
                prng,
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

    if (text) {
        let pp = opf([
            new Point(mid + quat / 2, -height / 2 + perturbation / 2),
            new Point(
                -strokeWidth * 0.5 + quat * 0.5,
                -height / 2 - perturbation / 4
            ),
        ]);
        if (pp[0].x > pp[1].x) {
            pp = [pp[1], pp[0]];
        }
        const mp = midPoint(pp);
        const a = Math.atan2(pp[1].y - pp[0].y, pp[1].x - pp[0].x);
        const adeg = (a * 180) / Math.PI;

        const newText = new SvgText(text, {
            fontSize: height * 0.6,
            fontFamily: "Verdana",
            textAnchor: "middle",
            transform: `translate(${mp.x + xOffset},${
                mp.y + yOffset
            }) rotate(${adeg})`,
            style: {
                fill: "rgba(100, 100, 100, 0.9)",
            },
        });

        polylines.push(newText);
    }

    return polylines;
}
