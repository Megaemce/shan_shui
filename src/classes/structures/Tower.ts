import Box from "./Box";
import Structure from "../Structure";
import PagodaRoof from "./PagodaRoof";
import Rail from "./Rail";

/**
 * Represents a series of arch structures with increasing size.
 */
export default class Tower extends Structure {
    /**
     * @param {number} xOffset - The x-coordinate offset for the arches.
     * @param {number} yOffset - The y-coordinate offset for the arches.
     * @param {number} stories - The number of arches to generate.
     */
    constructor(
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
                    this.xOffset,
                    this.yOffset - heightOffset,
                    height,
                    strokeWidth * Math.pow(0.85, i),
                    rotation,
                    period / 2,
                    true,
                    true,
                    1.5,
                    666 // no style at all
                )
            );
            this.add(
                new Rail(
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
