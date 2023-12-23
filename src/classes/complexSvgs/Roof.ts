import Point from "../Point";
import PRNG from "../PRNG";
import { div } from "../../utils/div";
import ComplexSvg from "../ComplexSvg";
import SvgPolyline from "../SvgPolyline";
import SvgText from "../SvgText";
import Stroke from "../svgPolylines/Stroke";
import { midPoint } from "../../utils/polytools";

export default class Roof extends ComplexSvg {
    constructor(
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

        const polist = opf([
            new Point(-width * 0.5, 0),
            new Point(-width * 0.5 + quat, -height - perturbation / 2),
            new Point(mid + quat, -height),
            new Point(width * 0.5, 0),
            new Point(mid, perturbation),
        ]);
        this.add(new SvgPolyline(polist, xOffset, yOffset, "white", "none"));

        for (let i = 0; i < pointArray.length; i++) {
            this.add(
                new Stroke(
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

            this.add(newText);
        }
    }
}
