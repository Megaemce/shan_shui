import { Point } from "../../classes/Point";
import { normalizeNoise } from "../../utils/utils";
import { Noise } from "../../classes/PerlinNoise";
import { generateStroke } from "../brushes/generateStroke";
import { generateTexture } from "../brushes/generateTexture";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";

/**
 * Generate a generateRock with varying heights and textures.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-axis offset.
 * @param {number} yOffset - The y-axis offset.
 * @param {number} [seed=0] - The seed for the noise function. Default is 0.
 * @param {number} [height=80] - The overall height of the generateRock. Default is 80.
 * @param {number} [shadow=10] - The shape parameter affecting texture. Default is 10.
 * @param {number} [strokeWidth=100] - The width of the generateRock. Default is 100.
 * @returns {SvgPolyline[]} An array of polylines representing the generateRock.
 */

export function generateRock(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    height: number = 80,
    shadow: number = 10,
    strokeWidth: number = 100
): SvgPolyline[] {
    const textureCount = 40;

    const polylineArray: SvgPolyline[][] = [];

    const reso = [10, 50];
    const pointArray: Point[][] = [];

    for (let i = 0; i < reso[0]; i++) {
        pointArray.push([]);

        const nslist = [];
        for (let j = 0; j < reso[1]; j++) {
            nslist.push(Noise.noise(prng, i, j * 0.2, seed));
        }
        normalizeNoise(nslist);

        for (let j = 0; j < reso[1]; j++) {
            const a = (j / reso[1]) * Math.PI * 2 - Math.PI / 2;
            let l =
                (strokeWidth * height) /
                Math.sqrt(
                    Math.pow(height * Math.cos(a), 2) +
                        Math.pow(strokeWidth * Math.sin(a), 2)
                );

            l *= 0.7 + 0.3 * nslist[j];

            const p = 1 - i / reso[0];

            const newX = Math.cos(a) * l * p;
            let newY = -Math.sin(a) * l * p;

            if (Math.PI < a || a < 0) {
                newY *= 0.2;
            }

            newY += height * (i / reso[0]) * 0.2;

            pointArray[pointArray.length - 1].push(new Point(newX, newY));
        }
    }

    //WHITE BG
    polylineArray.push([
        new SvgPolyline(
            pointArray[0].concat([new Point(0, 0)]),
            xOffset,
            yOffset,
            "white",
            "none"
        ),
    ]);
    //OUTLINE
    polylineArray.push([
        generateStroke(
            prng,
            pointArray[0].map(function (p) {
                return new Point(p.x + xOffset, p.y + yOffset);
            }),
            "rgba(100,100,100,0.3)",
            "rgba(100,100,100,0.3)",
            3,
            1
        ),
    ]);
    polylineArray.push(
        generateTexture(
            prng,
            pointArray,
            xOffset,
            yOffset,
            textureCount,
            shadow,
            () => 0.5 + prng.randomSign() * prng.random(0.2, 0.35)
        )
    );

    return polylineArray.flat();
}
