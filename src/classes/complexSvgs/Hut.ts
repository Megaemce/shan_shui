import Point from "../Point";
import PRNG from "../PRNG";
import ComplexSvg from "../ComplexSvg";
import SvgPolyline from "../SvgPolyline";
import Texture from "./Texture";

/**
 * Represents a hut generated using procedural generation.
 */
export default class Hut extends ComplexSvg {
    /**
     * @param {PRNG} prng - The pseudorandom number generator.
     * @param {number} xOffset - The x-coordinate offset for the hut.
     * @param {number} yOffset - The y-coordinate offset for the hut.
     * @param {number} [height=40] - The height of the hut.
     * @param {number} [width=180] - The width of the hut.
     * @param {number} [textureCount=300] - The number of textures in the hut.
     */
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        height: number = 40,
        width: number = 180,
        textureCount: number = 300
    ) {
        super();

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

        this.add(
            new SvgPolyline(
                pointList[0]
                    .slice(0, -1)
                    .concat(
                        pointList[pointList.length - 1].slice(0, -1).reverse()
                    ),
                xOffset,
                yOffset,
                "white",
                "none"
            )
        );
        this.add(
            new SvgPolyline(
                pointList[0],
                xOffset,
                yOffset,
                "none",
                "rgba(100,100,100,0.3)",
                2
            )
        );
        this.add(
            new SvgPolyline(
                pointList[pointList.length - 1],
                xOffset,
                yOffset,
                "none",
                "rgba(100,100,100,0.3)",
                2
            )
        );

        this.add(
            new Texture(
                prng,
                pointList,
                xOffset,
                yOffset,
                textureCount,
                2,
                () => prng.weightedRandom((a) => a * a),
                (x) => 5,
                0.25
            )
        );
    }
}
