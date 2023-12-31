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
     * @param {Point[][]} elements - 2D array of points representing the grid.
     * @param {number} [xOffset=0] - X-offset for the texture.
     * @param {number} [yOffset=0] - Y-offset for the texture.
     * @param {number} [textureCount=400] - Number of textures to generate.
     * @param {number} [shadow=0] - Shade factor for additional shading.
     * @param {() => number} [displacementFunction] - Function to determine the displacement of each texture.
     * @param {(x: number) => number} [noise] - Function to determine the noise of each texture.
     * @param {number} [length=0.2] - Length factor for the textures.
     */
    constructor(
        elements: Point[][],
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

        const elementNumber = elements.length;
        const elementDetails = elements[0].length; // all elements had the same amount of details
        const textureArray = new Array<Point[]>(textureCount);
        const step = shadow !== 0 ? 2 : 1;

        for (let i = 0; i < textureCount; i++) {
            const mid = Math.floor(displacementFunction() * elementDetails);
            const hlen = Math.floor(PRNG.random(0, elementDetails * length));
            const start = Math.max(mid - hlen, 0);
            const end = Math.min(mid + hlen, elementDetails);
            const layerIndex = i / textureCount;
            const layer = layerIndex * (elementNumber - 1);
            const floorLayer = Math.floor(layer);
            const ceilLayer = Math.ceil(layer);
            const layerFraction = layer - floorLayer;

            let currentTexture = new Array<Point>(end - start);
            let counter = 0; // as the below for loop starts from start

            for (let j = start; j < end; j++) {
                const xInterpolated =
                    elements[floorLayer][j].x * layerFraction +
                    elements[ceilLayer][j].x * (1 - layerFraction);

                const yInterpolated =
                    elements[floorLayer][j].y * layerFraction +
                    elements[ceilLayer][j].y * (1 - layerFraction);

                const noiseScale = noise(layer + 1);
                const newX =
                    noiseScale * (Perlin.noise(xInterpolated, j * 0.5) - 0.5);
                const newY =
                    noiseScale * (Perlin.noise(yInterpolated, j * 0.5) - 0.5);

                currentTexture[counter] = new Point(
                    xInterpolated + newX + xOffset,
                    yInterpolated + newY + yOffset
                );

                counter++;
            }

            textureArray[i] = currentTexture;
        }

        // SHADE

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
