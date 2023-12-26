import Point from "../Point";
import { normalizeNoise } from "../../utils/utils";
import { Noise } from "../PerlinNoise";
import Stroke from "../svgPolylines/Stroke";
import Texture from "./Texture";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import ComplexSvg from "../ComplexSvg";

/**
 * Represents a rock with varying heights and textures.
 */
export default class Rock extends ComplexSvg {
    /**
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=0] - The seed for the noise function. Default is 0.
     * @param {number} [height=80] - The overall height of the rock. Default is 80.
     * @param {number} [shadow=10] - The shape parameter affecting texture. Default is 10.
     * @param {number} [strokeWidth=100] - The width of the rock. Default is 100.
     */
    constructor(
        private prng: PRNG,
        private xOffset: number,
        private yOffset: number,
        private seed: number = 0,
        private height: number = 80,
        private shadow: number = 10,
        private strokeWidth: number = 100
    ) {
        super();

        const textureCount = 40;
        const reso = [10, 50];
        const pointArray: Point[][] = [];

        for (let i = 0; i < reso[0]; i++) {
            pointArray.push([]);

            const nslist = [];
            for (let j = 0; j < reso[1]; j++) {
                nslist.push(Noise.noise(this.prng, i, j * 0.2, this.seed));
            }
            normalizeNoise(nslist);

            for (let j = 0; j < reso[1]; j++) {
                const a = (j / reso[1]) * Math.PI * 2 - Math.PI / 2;
                let l =
                    (this.strokeWidth * this.height) /
                    Math.sqrt(
                        Math.pow(this.height * Math.cos(a), 2) +
                            Math.pow(this.strokeWidth * Math.sin(a), 2)
                    );

                l *= 0.7 + 0.3 * nslist[j];

                const p = 1 - i / reso[0];

                const newX = Math.cos(a) * l * p;
                let newY = -Math.sin(a) * l * p;

                if (Math.PI < a || a < 0) {
                    newY *= 0.2;
                }

                newY += this.height * (i / reso[0]) * 0.2;

                pointArray[pointArray.length - 1].push(new Point(newX, newY));
            }
        }

        // WHITE BG
        this.add(
            new SvgPolyline(
                pointArray[0].concat([new Point(0, 0)]),
                this.xOffset,
                this.yOffset,
                "white",
                "none"
            )
        );

        // OUTLINE
        this.add(
            new Stroke(
                this.prng,
                pointArray[0].map(
                    (p) => new Point(p.x + this.xOffset, p.y + this.yOffset)
                ),
                "rgba(100,100,100,0.3)",
                "rgba(100,100,100,0.3)",
                3,
                1
            )
        );

        // TEXTURE
        this.add(
            new Texture(
                this.prng,
                pointArray,
                this.xOffset,
                this.yOffset,
                textureCount,
                this.shadow,
                () => 0.5 + this.prng.randomSign() * this.prng.random(0.2, 0.35)
            )
        );
    }
}