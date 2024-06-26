import Box from "./Box";
import Structure from "../Structure";
import Hut from "./Hut";
import Man from "./Man";
import PRNG from "../PRNG";
import Rail from "./Rail";

export default class Pavilion extends Structure {
    /**
     * Initializes a new instance of the Pavilion class with the specified parameters.
     *
     * @param {number} xOffset - The x-coordinate offset for the pavilion.
     * @param {number} yOffset - The y-coordinate offset for the pavilion.
     * @param {number} [seed=0] - The seed value for random number generation.
     * @param {number} [height=70] - The height of the pavilion.
     * @param {number} [strokeWidth=180] - The stroke width for the pavilion.
     * @param {number} [perspective=5] - The perspective value for the pavilion.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        seed: number = 0,
        height: number = 70,
        strokeWidth: number = 180,
        perspective: number = 5
    ) {
        super();

        const p = PRNG.random(0.4, 0.8);
        const h0 = height * p;
        const h1 = height * (1 - p);

        this.add(new Hut(xOffset, yOffset - height, h0, strokeWidth));

        this.add(
            new Box(
                xOffset,
                yOffset,
                h1,
                (strokeWidth * 2) / 3,
                0.7,
                perspective,
                true,
                false
            )
        );

        this.add(
            new Rail(
                xOffset,
                yOffset,
                seed,
                true,
                10,
                strokeWidth,
                perspective * 2,
                Math.floor(PRNG.random(3, 6)),
                false
            )
        );

        const people = PRNG.randomChoice([0, 1, 1, 2]);
        if (people === 1) {
            this.add(
                new Man(
                    xOffset +
                        PRNG.normalizedRandom(
                            -strokeWidth / 3,
                            strokeWidth / 3
                        ),
                    yOffset,
                    PRNG.randomChoice([true, false]),
                    0.42
                )
            );
        } else if (people === 2) {
            this.add(
                new Man(
                    xOffset +
                        PRNG.normalizedRandom(
                            -strokeWidth / 4,
                            -strokeWidth / 5
                        ),
                    yOffset,
                    false,
                    0.42
                )
            );
            this.add(
                new Man(
                    xOffset +
                        PRNG.normalizedRandom(strokeWidth / 5, strokeWidth / 4),
                    yOffset,
                    true,
                    0.42
                )
            );
        }

        this.add(
            new Rail(
                xOffset,
                yOffset,
                seed,
                false,
                10,
                strokeWidth,
                perspective * 2,
                Math.floor(PRNG.random(3, 6)),
                true
            )
        );
    }
}
