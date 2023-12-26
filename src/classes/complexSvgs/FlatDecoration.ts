import Tree08 from "./Tree08";
import Tree07 from "./Tree07";
import Tree06 from "./Tree06";
import Tree05 from "./Tree05";
import Tree04 from "./Tree04";
import Tree02 from "./Tree02";
import Pavilion from "./Pavilion";
import Bound from "../Bound";
import PRNG from "../PRNG";
import Rock from "./Rock";
import ComplexSvg from "../ComplexSvg";

export default class FlatDecoration extends ComplexSvg {
    constructor(prng: PRNG, xOffset: number, yOffset: number, bounding: Bound) {
        super();

        const tt = prng.randomChoice([0, 0, 1, 2, 3, 4]);

        for (let j = 0; j < prng.random(0, 5); j++) {
            this.add(
                new Rock(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        prng.normalizedRandom(-10, 10) +
                        10,
                    prng.random(0, 100),
                    prng.random(10, 30),
                    2,
                    prng.random(10, 30)
                )
            );
        }

        for (let j = 0; j < prng.randomChoice([0, 0, 1, 2]); j++) {
            const xr =
                xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax);
            const yr =
                yOffset +
                (bounding.yMin + bounding.yMax) / 2 +
                prng.normalizedRandom(-5, 5) +
                20;

            for (let k = 0; k < prng.random(2, 5); k++) {
                this.add(
                    new Tree08(
                        prng,
                        xr +
                            Math.min(
                                Math.max(
                                    prng.normalizedRandom(-30, 30),
                                    bounding.xMin
                                ),
                                bounding.xMax
                            ),
                        yr,
                        prng.random(60, 100)
                    )
                );
            }
        }

        if (tt === 0) {
            for (let j = 0; j < prng.random(0, 3); j++) {
                this.add(
                    new Rock(
                        prng,
                        xOffset +
                            prng.normalizedRandom(bounding.xMin, bounding.xMax),
                        yOffset +
                            (bounding.yMin + bounding.yMax) / 2 +
                            prng.normalizedRandom(-5, 5) +
                            20,
                        prng.random(0, 100),
                        prng.random(40, 60),
                        5,
                        prng.random(50, 70)
                    )
                );
            }
        }

        if (tt === 1) {
            const xMid = (bounding.xMin + bounding.xMax) / 2;
            const xMin = prng.random(bounding.xMin, xMid);
            const xMax = prng.random(xMid, bounding.xMax);

            for (let i = xMin; i < xMax; i += 30) {
                this.add(
                    new Tree05(
                        prng,
                        xOffset + i + 20 * prng.normalizedRandom(-1, 1),
                        yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                        prng.random(100, 300)
                    )
                );
            }

            for (let j = 0; j < prng.random(0, 4); j++) {
                this.add(
                    new Rock(
                        prng,
                        xOffset +
                            prng.normalizedRandom(bounding.xMin, bounding.xMax),
                        yOffset +
                            (bounding.yMin + bounding.yMax) / 2 +
                            prng.normalizedRandom(-5, 5) +
                            20,
                        prng.random(0, 100),
                        prng.random(40, 60),
                        5,
                        prng.random(50, 70)
                    )
                );
            }
        } else if (tt === 2) {
            for (let i = 0; i < prng.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
                const xr = prng.normalizedRandom(bounding.xMin, bounding.xMax);
                const yr = (bounding.yMin + bounding.yMax) / 2;
                this.add(new Tree04(prng, xOffset + xr, yOffset + yr + 20));

                for (let j = 0; j < prng.random(0, 2); j++) {
                    this.add(
                        new Rock(
                            prng,
                            xOffset +
                                Math.max(
                                    bounding.xMin,
                                    Math.min(
                                        bounding.xMax,
                                        xr + prng.normalizedRandom(-50, 50)
                                    )
                                ),
                            yOffset + yr + prng.normalizedRandom(-5, 5) + 20,
                            prng.random(100 * i * j),
                            prng.random(40, 60),
                            5,
                            prng.random(50, 70)
                        )
                    );
                }
            }
        } else if (tt === 3) {
            for (let i = 0; i < prng.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
                this.add(
                    new Tree06(
                        prng,
                        xOffset +
                            prng.normalizedRandom(bounding.xMin, bounding.xMax),
                        yOffset + (bounding.yMin + bounding.yMax) / 2,
                        prng.random(60, 120)
                    )
                );
            }
        } else if (tt === 4) {
            const xMid = (bounding.xMin + bounding.xMax) / 2;
            const xMin = prng.random(bounding.xMin, xMid);
            const xMax = prng.random(xMid, bounding.xMax);

            for (let i = xMin; i < xMax; i += 20) {
                this.add(
                    new Tree07(
                        prng,
                        xOffset + i + 20 * prng.normalizedRandom(-1, 1),
                        yOffset +
                            (bounding.yMin + bounding.yMax) / 2 +
                            prng.normalizedRandom(-1, 1) +
                            0,
                        prng.normalizedRandom(40, 80)
                    )
                );
            }
        }

        for (let i = 0; i < prng.random(0, 50); i++) {
            this.add(
                new Tree02(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        prng.normalizedRandom(bounding.yMin, bounding.yMax)
                )
            );
        }

        const ts = prng.randomChoice([0, 0, 0, 0, 1]);
        if (ts === 1 && tt !== 4) {
            this.add(
                new Pavilion(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                    prng.random(),
                    prng.normalizedRandom(80, 100),
                    prng.normalizedRandom(160, 200),
                    prng.random()
                )
            );
        }
    }
}
