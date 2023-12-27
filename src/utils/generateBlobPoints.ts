import Perlin from "../classes/Perlin";
import Point from "../classes/Point";
import PRNG from "../classes/PRNG";
import { normalizeNoise } from "./utils";

/**
 * Generates a list of points for a blob with a stylized outline.
 * @param prng - PRNG instance for random number generation.
 * @param x - X-coordinate of the blob.
 * @param y - Y-coordinate of the blob.
 * @param angle - Angle of the blob.
 * @param length - Length of the blob.
 * @param strokeWidth - Width of the blob's outline.
 * @param noise - Amount of noise applied to the blob's outline.
 * @param strokeWidthFunction - Function to modulate the blob's outline width (default is sin function).
 * @returns Array of points representing the Blob.
 */

export function generateBlobPoints(
    prng: PRNG,
    x: number,
    y: number,
    angle: number = 0,
    length: number = 20,
    strokeWidth: number = 5,
    noise: number = 0.5,
    strokeWidthFunction: (x: number) => number = (x: number) =>
        x <= 1
            ? Math.pow(Math.sin(x * Math.PI), 0.5)
            : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5)
): Point[] {
    const resolution = 20;
    const lalist = [];

    for (let i = 0; i < resolution + 1; i++) {
        const p = (i / resolution) * 2;
        const xo = length / 2 - Math.abs(p - 1) * length;
        const yo = (strokeWidthFunction(p) * strokeWidth) / 2;
        const a = Math.atan2(yo, xo);
        const l = Math.sqrt(xo * xo + yo * yo);
        lalist.push([l, a]);
    }

    let noiseArray = [];
    const n0 = prng.random(0, 10);

    for (let i = 0; i < resolution + 1; i++) {
        noiseArray.push(Perlin.noise(prng, i * 0.05, n0));
    }

    noiseArray = normalizeNoise(noiseArray);
    const pointArray = [];

    for (let i = 0; i < lalist.length; i++) {
        const ns = noiseArray[i] * noise + (1 - noise);
        const newX = x + Math.cos(lalist[i][1] + angle) * lalist[i][0] * ns;
        const newY = y + Math.sin(lalist[i][1] + angle) * lalist[i][0] * ns;
        pointArray.push(new Point(newX, newY));
    }

    return pointArray;
}
