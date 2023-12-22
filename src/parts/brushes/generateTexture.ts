import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { Vector } from "../../classes/Vector";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "./generateStroke";

/**
 * Generates textured polylines based on a grid of points.
 * @param prng - PRNG instance for random number generation.
 * @param pointArray - 2D array of points representing the grid.
 * @param xOffset - X-offset for the texture.
 * @param yOffset - Y-offset for the texture.
 * @param textureCount - Number of textures to generate.
 * @param strokeWidth - Width of the polylines.
 * @param shadow - Shade factor for additional shading.
 * @param fillColor - Function to determine the fillColor of each texture.
 * @param displacementFunction - Function to determine the displacement of each texture.
 * @param noise - Function to determine the noise of each texture.
 * @param length - Length factor for the textures.
 * @returns Array of textured polylines.
 */

export function generateTexture(
    prng: PRNG,
    pointArray: Point[][],
    xOffset: number = 0,
    yOffset: number = 0,
    textureCount: number = 400,
    shadow: number = 0,
    displacementFunction: () => number = () =>
        0.5 + (prng.random() > 0.5 ? -1 : 1) * prng.random(1 / 6, 0.5),
    noise: (x: number) => number = (x) => 30 / x,
    length: number = 0.2
): SvgPolyline[] {
    const offset = new Vector(xOffset, yOffset);
    const resolution = [pointArray.length, pointArray[0].length];
    const texlist: Point[][] = [];

    for (let i = 0; i < textureCount; i++) {
        const mid = (displacementFunction() * resolution[1]) | 0;
        const hlen = Math.floor(prng.random(0, resolution[1] * length));

        let start = mid - hlen;
        let end = mid + hlen;
        start = Math.min(Math.max(start, 0), resolution[1]);
        end = Math.min(Math.max(end, 0), resolution[1]);

        const layer = (i / textureCount) * (resolution[0] - 1);

        texlist.push([]);
        for (let j = start; j < end; j++) {
            const p = layer - Math.floor(layer);
            const x =
                pointArray[Math.floor(layer)][j].x * p +
                pointArray[Math.ceil(layer)][j].x * (1 - p);

            const y =
                pointArray[Math.floor(layer)][j].y * p +
                pointArray[Math.ceil(layer)][j].y * (1 - p);

            const newX =
                noise(layer + 1) * (Noise.noise(prng, x, j * 0.5) - 0.5);
            const newY =
                noise(layer + 1) * (Noise.noise(prng, y, j * 0.5) - 0.5);

            texlist[texlist.length - 1].push(new Point(x + newX, y + newY));
        }
    }

    const polylines: SvgPolyline[] = [];

    // SHADE
    if (shadow) {
        const step = 1 + (shadow !== 0 ? 1 : 0);
        for (let j = 0; j < texlist.length; j += step) {
            if (texlist[j].length > 0) {
                polylines.push(
                    generateStroke(
                        prng,
                        texlist[j].map((p) => p.move(offset)),
                        "rgba(100,100,100,0.1)",
                        "rgba(100,100,100,0.1)",
                        shadow
                    )
                );
            }
        }
    }
    return polylines;
}
