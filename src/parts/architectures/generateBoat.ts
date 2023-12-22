import { Chunk } from "../../classes/Chunk";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { generateMan } from "../man/generateMan";
import { generateStick } from "../man/generateStick";
import { generateHat02 } from "../man/generateHat02";

/**
 * Generates a boat using procedural generation.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the boat.
 * @param yOffset - The y-coordinate offset for the boat.
 * @param scale - The scale factor for the boat.
 * @param flip - Indicates whether to flip the boat horizontally.
 * @returns A Chunk representing the boat.
 */

export function generateBoat(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    scale: number = 1,
    flip: boolean = false
): Chunk {
    const length = 120;
    const polylineArray: SvgPolyline[][] = [];

    const direction = flip ? -1 : 1;
    polylineArray.push(
        generateMan(
            prng,
            xOffset + 20 * scale * direction,
            yOffset,
            !flip,
            0.5 * scale,
            [0, 30, 20, 30, 10, 30, 30, 30, 30],
            generateStick,
            generateHat02
        )
    );

    const pointList1: Point[] = [];
    const pointList2: Point[] = [];
    const function1 = (x: number) =>
        Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * scale;
    const function2 = (x: number) =>
        Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * scale;

    for (let i = 0; i < length * scale; i += 5 * scale) {
        pointList1.push(new Point(i * direction, function1(i / length)));
        pointList2.push(new Point(i * direction, function2(i / length)));
    }
    const pointList: Point[] = pointList1.concat(pointList2.reverse());
    polylineArray.push([
        SvgPolyline.createPolyline(pointList, xOffset, yOffset, "white"),
    ]);
    polylineArray.push([
        generateStroke(
            prng,
            pointList.map((v) => new Point(xOffset + v.x, yOffset + v.y)),
            "rgba(100,100,100,0.4)",
            "rgba(100,100,100,0.4)",
            1,
            0.5,
            1,
            (x) => Math.sin(x * Math.PI * 2)
        ),
    ]);

    const chunk: Chunk = new Chunk(
        "boat",
        xOffset,
        yOffset,
        polylineArray.flat()
    );
    return chunk;
}
