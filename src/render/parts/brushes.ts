import { Noise } from "../basic/perlinNoise";
import { Point, Vector } from "../basic/point";
import { PRNG } from "../basic/PRNG";
import { normalizeNoise } from "../basic/utils";
import { createPolyline } from "../svg/createPolyline";
import { SvgPolyline } from "../svg";

/**
 * Generates a stylized stroke using Perlin noise.
 * @param prng - PRNG instance for random number generation.
 * @param pointArray - List of points defining the stroke.
 * @param fillColor - Fill fillColor for the stroke.
 * @param strokeColor - Stroke fillColor.
 * @param width - Width of the stroke.
 * @param noise - Amount of noise applied to the stroke.
 * @param strokWidth - Outer width of the stroke.
 * @param strokeWidthFunction - Function to modulate stroke width (default is sin function).
 * @returns SvgPolyline representing the stylized stroke.
 */
export function stroke(
    prng: PRNG,
    pointArray: Point[],
    fillColor: string = "rgba(200,200,200,0.9)",
    strokeColor: string = "rgba(200,200,200,0.9)",
    width: number = 2,
    noise: number = 0.5,
    strokWidth: number = 1,
    strokeWidthFunction: (x: number) => number = (x: number) =>
        Math.sin(x * Math.PI)
): SvgPolyline {
    console.assert(pointArray.length > 0);

    const vtxlist0 = [];
    const vtxlist1 = [];
    const n0 = prng.random(0, 10);

    for (let i = 1; i < pointArray.length - 1; i++) {
        let newWidth = width * strokeWidthFunction(i / pointArray.length);
        newWidth =
            newWidth * (1 - noise) +
            newWidth * noise * Noise.noise(prng, i * 0.5, n0);

        const a1 = Math.atan2(
            pointArray[i].y - pointArray[i - 1].y,
            pointArray[i].x - pointArray[i - 1].x
        );
        const a2 = Math.atan2(
            pointArray[i].y - pointArray[i + 1].y,
            pointArray[i].x - pointArray[i + 1].x
        );
        let a = (a1 + a2) / 2;

        if (a < a2) {
            a += Math.PI;
        }

        vtxlist0.push(
            new Point(
                pointArray[i].x + newWidth * Math.cos(a),
                pointArray[i].y + newWidth * Math.sin(a)
            )
        );
        vtxlist1.push(
            new Point(
                pointArray[i].x - newWidth * Math.cos(a),
                pointArray[i].y - newWidth * Math.sin(a)
            )
        );
    }

    const vtxlist = [pointArray[0]]
        .concat(
            vtxlist0.concat(
                vtxlist1.concat([pointArray[pointArray.length - 1]]).reverse()
            )
        )
        .concat([pointArray[0]]);

    return createPolyline(vtxlist, 0, 0, fillColor, strokeColor, strokWidth);
}

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
 * @returns Array of points representing the generateBlob.
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
    const resolution = 20.0;
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
        noiseArray.push(Noise.noise(prng, i * 0.05, n0));
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
    return createPolyline(pointArray, 0, 0, fillColor, fillColor);
}

/**
 * Divides a polyline into a higher resolution.
 * @param pointArray - Array of points defining the original polyline.
 * @param resolution - Resolution factor.
 * @returns Array of points representing the higher resolution polyline.
 */
export function div(pointArray: Point[], resolution: number): Point[] {
    const totalLength = (pointArray.length - 1) * resolution;
    const result = [];

    for (let i = 0; i < totalLength; i += 1) {
        const lastPoint = pointArray[Math.floor(i / resolution)];
        const nextPoint = pointArray[Math.ceil(i / resolution)];
        const progress = (i % resolution) / resolution;
        const newX = lastPoint.x * (1 - progress) + nextPoint.x * progress;
        const newY = lastPoint.y * (1 - progress) + nextPoint.y * progress;

        result.push(new Point(newX, newY));
    }

    if (pointArray.length > 0) {
        result.push(pointArray[pointArray.length - 1]);
    }

    return result;
}

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
                    stroke(
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
