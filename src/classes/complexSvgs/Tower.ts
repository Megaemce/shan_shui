import PRNG from "../PRNG";
import Box from "./Box";
import Rail from "./Rail";
import PagodaRoof from "./PagodaRoof";
import ComplexSvg from "../ComplexSvg";

/**
 * Represents a series of arch structures with increasing size.
 */
export default class Tower extends ComplexSvg {
    /**
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {number} xOffset - The x-coordinate offset for the arches.
     * @param {number} yOffset - The y-coordinate offset for the arches.
     * @param {number} stories - The number of arches to generate.
     */
    constructor(
        private prng: PRNG,
        private xOffset: number,
        private yOffset: number,
        private stories: number = 2
    ) {
        super();

        const height = 15,
            strokeWidth = 30,
            rotation = 0.7,
            period = 5;

        let heightOffset = 0;

        for (let i = 0; i < this.stories; i++) {
            this.add(
                new Box(
                    this.prng,
                    this.xOffset,
                    this.yOffset - heightOffset,
                    height,
                    strokeWidth * Math.pow(0.85, i),
                    rotation,
                    period / 2,
                    true,
                    true,
                    1.5
                )
            );
            this.add(
                new Rail(
                    this.prng,
                    this.xOffset,
                    this.yOffset - heightOffset,
                    i * 0.2,
                    true,
                    height / 3,
                    strokeWidth * Math.pow(0.85, i) * 1.2,
                    period / 2,
                    3,
                    true,
                    rotation,
                    0.5
                )
            );
            this.add(
                new PagodaRoof(
                    this.prng,
                    this.xOffset,
                    this.yOffset - heightOffset - height,
                    height * 1,
                    strokeWidth * Math.pow(0.9, i),
                    1.5,
                    period
                )
            );
            heightOffset += height * 1.2;
        }
    }
}
