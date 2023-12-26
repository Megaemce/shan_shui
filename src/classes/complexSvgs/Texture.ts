import Point from "../Point";
import Vector from "../Vector";
import PRNG from "../PRNG";
import Stroke from "../svgPolylines/Stroke";
import { Noise } from "../PerlinNoise";
import ComplexSvg from "../ComplexSvg";

/**
 * Represents textured polylines based on a grid of points.
 */
export default class Texture extends ComplexSvg {
    /**
     * @param {PRNG} prng - PRNG instance for random number generation.
     * @param {Point[][]} pointArray - 2D array of points representing the grid.
     * @param {number} [xOffset=0] - X-offset for the texture.
     * @param {number} [yOffset=0] - Y-offset for the texture.
     * @param {number} [textureCount=400] - Number of textures to generate.
     * @param {number} [shadow=0] - Shade factor for additional shading.
     * @param {() => number} [displacementFunction] - Function to determine the displacement of each texture.
     * @param {(x: number) => number} [noise] - Function to determine the noise of each texture.
     * @param {number} [length=0.2] - Length factor for the textures.
     */
    constructor(
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
    ) {
        super();

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

        // SHADE
        if (shadow) {
            const step = 1 + (shadow !== 0 ? 1 : 0);
            for (let j = 0; j < texlist.length; j += step) {
                if (texlist[j].length > 0) {
                    this.add(
                        new Stroke(
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
    }
}
