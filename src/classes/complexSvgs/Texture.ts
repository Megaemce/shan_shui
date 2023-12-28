import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
/**
 * Represents textured polylines based on a grid of points.
 */
export default class Texture extends ComplexSvg {
    /**
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
        pointArray: Point[][],
        xOffset: number = 0,
        yOffset: number = 0,
        textureCount: number = 400,
        shadow: number = 0,
        displacementFunction: () => number = () =>
            0.5 + (PRNG.random() > 0.5 ? -1 : 1) * PRNG.random(1 / 6, 0.5),
        noise: (x: number) => number = (x) => 30 / x,
        length: number = 0.2
    ) {
        super();

        const resolution = [pointArray.length, pointArray[0].length];
        const textureArray: Point[][] = [];

        for (let i = 0; i < textureCount; i++) {
            const mid = Math.floor(displacementFunction() * resolution[1]);
            const hlen = Math.floor(PRNG.random(0, resolution[1] * length));
            const start = Math.max(mid - hlen, 0);
            const end = Math.min(mid + hlen, resolution[1]);
            const layerIndex = i / textureCount;
            const layer = layerIndex * (resolution[0] - 1);
            const floorLayer = Math.floor(layer);
            const ceilLayer = Math.ceil(layer);
            const layerFraction = layer - floorLayer;

            const currentTexture = [];

            for (let j = start; j < end; j++) {
                const xInterpolated =
                    pointArray[floorLayer][j].x * layerFraction +
                    pointArray[ceilLayer][j].x * (1 - layerFraction);

                const yInterpolated =
                    pointArray[floorLayer][j].y * layerFraction +
                    pointArray[ceilLayer][j].y * (1 - layerFraction);

                const noiseScale = noise(layer + 1);
                const newX =
                    noiseScale * (Perlin.noise(xInterpolated, j * 0.5) - 0.5);
                const newY =
                    noiseScale * (Perlin.noise(yInterpolated, j * 0.5) - 0.5);

                currentTexture.push(
                    new Point(
                        xInterpolated + newX + xOffset,
                        yInterpolated + newY + yOffset
                    )
                );
            }

            textureArray.push(currentTexture);
        }

        // SHADE
        const step = shadow !== 0 ? 2 : 1;

        textureArray.forEach((texture, i) => {
            if (i % step === 0 && texture.length > 0) {
                this.add(
                    new Stroke(
                        texture,
                        "rgba(100,100,100,0.1)",
                        "rgba(100,100,100,0.1)",
                        shadow
                    )
                );
            }
        });
    }
}
