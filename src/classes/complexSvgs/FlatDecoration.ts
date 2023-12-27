import Bound from "../Bound";
import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Pavilion from "./Pavilion";
import Rock from "./Rock";
import Tree02 from "./Tree02";
import Tree04 from "./Tree04";
import Tree05 from "./Tree05";
import Tree06 from "./Tree06";
import Tree07 from "./Tree07";
import Tree08 from "./Tree08";

export default class FlatDecoration extends ComplexSvg {
    constructor(xOffset: number, yOffset: number, bounding: Bound) {
        super();

        const tt = PRNG.randomChoice([0, 0, 1, 2, 3, 4]);

        for (let j = 0; j < PRNG.random(0, 5); j++) {
            this.add(
                new Rock(
                    xOffset +
                        PRNG.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        PRNG.normalizedRandom(-10, 10) +
                        10,
                    PRNG.random(0, 100),
                    PRNG.random(10, 30),
                    2,
                    PRNG.random(10, 30)
                )
            );
        }

        for (let j = 0; j < PRNG.randomChoice([0, 0, 1, 2]); j++) {
            const xr =
                xOffset + PRNG.normalizedRandom(bounding.xMin, bounding.xMax);
            const yr =
                yOffset +
                (bounding.yMin + bounding.yMax) / 2 +
                PRNG.normalizedRandom(-5, 5) +
                20;

            for (let k = 0; k < PRNG.random(2, 5); k++) {
                this.add(
                    new Tree08(
                        xr +
                            Math.min(
                                Math.max(
                                    PRNG.normalizedRandom(-30, 30),
                                    bounding.xMin
                                ),
                                bounding.xMax
                            ),
                        yr,
                        PRNG.random(60, 100)
                    )
                );
            }
        }

        if (tt === 0) {
            for (let j = 0; j < PRNG.random(0, 3); j++) {
                this.add(
                    new Rock(
                        xOffset +
                            PRNG.normalizedRandom(bounding.xMin, bounding.xMax),
                        yOffset +
                            (bounding.yMin + bounding.yMax) / 2 +
                            PRNG.normalizedRandom(-5, 5) +
                            20,
                        PRNG.random(0, 100),
                        PRNG.random(40, 60),
                        5,
                        PRNG.random(50, 70)
                    )
                );
            }
        }

        if (tt === 1) {
            const xMid = (bounding.xMin + bounding.xMax) / 2;
            const xMin = PRNG.random(bounding.xMin, xMid);
            const xMax = PRNG.random(xMid, bounding.xMax);

            for (let i = xMin; i < xMax; i += 30) {
                this.add(
                    new Tree05(
                        xOffset + i + 20 * PRNG.normalizedRandom(-1, 1),
                        yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                        PRNG.random(100, 300)
                    )
                );
            }

            for (let j = 0; j < PRNG.random(0, 4); j++) {
                this.add(
                    new Rock(
                        xOffset +
                            PRNG.normalizedRandom(bounding.xMin, bounding.xMax),
                        yOffset +
                            (bounding.yMin + bounding.yMax) / 2 +
                            PRNG.normalizedRandom(-5, 5) +
                            20,
                        PRNG.random(0, 100),
                        PRNG.random(40, 60),
                        5,
                        PRNG.random(50, 70)
                    )
                );
            }
        } else if (tt === 2) {
            for (let i = 0; i < PRNG.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
                const xr = PRNG.normalizedRandom(bounding.xMin, bounding.xMax);
                const yr = (bounding.yMin + bounding.yMax) / 2;
                this.add(new Tree04(xOffset + xr, yOffset + yr + 20));

                for (let j = 0; j < PRNG.random(0, 2); j++) {
                    this.add(
                        new Rock(
                            xOffset +
                                Math.max(
                                    bounding.xMin,
                                    Math.min(
                                        bounding.xMax,
                                        xr + PRNG.normalizedRandom(-50, 50)
                                    )
                                ),
                            yOffset + yr + PRNG.normalizedRandom(-5, 5) + 20,
                            PRNG.random(100 * i * j),
                            PRNG.random(40, 60),
                            5,
                            PRNG.random(50, 70)
                        )
                    );
                }
            }
        } else if (tt === 3) {
            for (let i = 0; i < PRNG.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
                this.add(
                    new Tree06(
                        xOffset +
                            PRNG.normalizedRandom(bounding.xMin, bounding.xMax),
                        yOffset + (bounding.yMin + bounding.yMax) / 2,
                        PRNG.random(60, 120)
                    )
                );
            }
        } else if (tt === 4) {
            const xMid = (bounding.xMin + bounding.xMax) / 2;
            const xMin = PRNG.random(bounding.xMin, xMid);
            const xMax = PRNG.random(xMid, bounding.xMax);

            for (let i = xMin; i < xMax; i += 20) {
                this.add(
                    new Tree07(
                        xOffset + i + 20 * PRNG.normalizedRandom(-1, 1),
                        yOffset +
                            (bounding.yMin + bounding.yMax) / 2 +
                            PRNG.normalizedRandom(-1, 1) +
                            0,
                        PRNG.normalizedRandom(40, 80)
                    )
                );
            }
        }

        for (let i = 0; i < PRNG.random(0, 50); i++) {
            this.add(
                new Tree02(
                    xOffset +
                        PRNG.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        PRNG.normalizedRandom(bounding.yMin, bounding.yMax)
                )
            );
        }

        const ts = PRNG.randomChoice([0, 0, 0, 0, 1]);
        if (ts === 1 && tt !== 4) {
            this.add(
                new Pavilion(
                    xOffset +
                        PRNG.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                    PRNG.random(),
                    PRNG.normalizedRandom(80, 100),
                    PRNG.normalizedRandom(160, 200),
                    PRNG.random()
                )
            );
        }
    }
}
