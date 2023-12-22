import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateBlobPoints } from "./generateBlobPoints";

/**
 * Generates a blob with a stylized outline.
 * @param prng - PRNG instance for random number generation.
 * @param x - X-coordinate of the blob.
 * @param y - Y-coordinate of the blob.
 * @param angle - Angle of the blob.
 * @param fillColor - Fill fillColor of the blob.
 * @param length - Length of the blob.
 * @param strokeWidth - Width of the blob's outline.
 * @param noise - Amount of noise applied to the blob's outline.
 * @param strokeWidthFunction - Function to modulate the blob's outline width (default is sin function).
 * @returns SvgPolyline representing the blob.
 */

export function generateBlob(
    prng: PRNG,
    x: number,
    y: number,
    angle: number = 0,
    fillColor: string = "rgba(200,200,200,0.9)",
    length: number = 20,
    strokeWidth: number = 5,
    noise: number = 0.5,
    strokeWidthFunction: (x: number) => number = (x: number) =>
        x <= 1
            ? Math.pow(Math.sin(x * Math.PI), 0.5)
            : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5)
): SvgPolyline {
    const pointArray = generateBlobPoints(
        prng,
        x,
        y,
        angle,
        length,
        strokeWidth,
        noise,
        strokeWidthFunction
    );
    return SvgPolyline.createPolyline(pointArray, 0, 0, fillColor, fillColor);
}
