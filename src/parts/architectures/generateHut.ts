import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateTexture } from "../brushes/generateTexture";

/**
 * Generates a hut using procedural generation.
 * @notExported
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {number} xOffset - The x-coordinate offset for the hut.
 * @param {number} yOffset - The y-coordinate offset for the hut.
 * @param {number} [height=40] - The height of the hut.
 * @param {number} [width=180] - The width of the hut.
 * @param {number} [textureCount=300] - The number of textures in the hut.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the hut.
 */
export function generateHut(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 40,
    width: number = 180,
    textureCount: number = 300
): SvgPolyline[] {
    const resolution = [10, 10];
    const pointList: Point[][] = [];

    for (let i = 0; i < resolution[0]; i++) {
        pointList.push([]);
        const currentHeight = height * prng.random(1, 1.2);
        for (let j = 0; j < resolution[1]; j++) {
            const newX =
                width *
                (i / (resolution[0] - 1) - 0.5) *
                Math.pow(j / (resolution[1] - 1), 0.7);
            const newY = currentHeight * (j / (resolution[1] - 1));
            pointList[pointList.length - 1].push(new Point(newX, newY));
        }
    }

    const polylines: SvgPolyline[] = [];

    polylines.push(
        SvgPolyline.createPolyline(
            pointList[0]
                .slice(0, -1)
                .concat(pointList[pointList.length - 1].slice(0, -1).reverse()),
            xOffset,
            yOffset,
            "white",
            "none"
        )
    );
    polylines.push(
        SvgPolyline.createPolyline(
            pointList[0],
            xOffset,
            yOffset,
            "none",
            "rgba(100,100,100,0.3)",
            2
        )
    );
    polylines.push(
        SvgPolyline.createPolyline(
            pointList[pointList.length - 1],
            xOffset,
            yOffset,
            "none",
            "rgba(100,100,100,0.3)",
            2
        )
    );

    const textures = generateTexture(
        prng,
        pointList,
        xOffset,
        yOffset,
        textureCount,
        2,
        () => prng.weightedRandom((a) => a * a),
        (x) => 5,
        0.25
    );

    return polylines.concat(textures);
}
