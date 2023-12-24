import PRNG from "../PRNG";
import Man from "./Man";
import Hut from "./Hut";
import Box from "./Box";
import Rail from "./Rail";
import ComplexSvg from "../ComplexSvg";

export default class Pavilion extends ComplexSvg {
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        seed: number = 0,
        height: number = 70,
        strokeWidth: number = 180,
        perspective: number = 5
    ) {
        super();

        const p = prng.random(0.4, 0.6);
        const h0 = height * p;
        const h1 = height * (1 - p);

        this.add(new Hut(prng, xOffset, yOffset - height, h0, strokeWidth));

        this.add(
            new Box(
                prng,
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
                prng,
                xOffset,
                yOffset,
                seed,
                true,
                10,
                strokeWidth,
                perspective * 2,
                prng.random(3, 6),
                false
            )
        );

        const poeple = prng.randomChoice([0, 1, 1, 2]);
        if (poeple === 1) {
            this.add(
                new Man(
                    prng,
                    xOffset +
                        prng.normalizedRandom(
                            -strokeWidth / 3,
                            strokeWidth / 3
                        ),
                    yOffset,
                    prng.randomChoice([true, false]),
                    0.42
                )
            );
        } else if (poeple === 2) {
            this.add(
                new Man(
                    prng,
                    xOffset +
                        prng.normalizedRandom(
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
                    prng,
                    xOffset +
                        prng.normalizedRandom(strokeWidth / 5, strokeWidth / 4),
                    yOffset,
                    true,
                    0.42
                )
            );
        }

        this.add(
            new Rail(
                prng,
                xOffset,
                yOffset,
                seed,
                false,
                10,
                strokeWidth,
                perspective * 2,
                prng.random(3, 6),
                true
            )
        );
    }
}
