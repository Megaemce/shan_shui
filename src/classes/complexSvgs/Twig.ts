import Blob from "../svgPolylines/Blob";
import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";

/**
 * Class representing a generator for a twig with branches and leaves.
 */
export default class Twig extends ComplexSvg {
    /**
     * Generates a twig with branches and leaves.
     *
     * @param prng - The pseudo-random number generator.
     * @param tx - X-coordinate of the twig base.
     * @param ty - Y-coordinate of the twig base.
     * @param depth - Depth of the twig branches.
     * @param angle - Initial angle of the twig.
     * @param scale - Scale factor of the twig.
     * @param direction - Direction of the twig branches.
     * @param strokeWidth - Width of the twig branches.
     * @param leaves - Tuple representing whether leaves should be generated and their number.
     */
    constructor(
        tx: number,
        ty: number,
        depth: number,
        angle: number = 0,
        scale: number = 1,
        direction: number = 1,
        strokeWidth: number = 1,
        leaves: [boolean, number] = [true, 12]
    ) {
        super();
        const twlist: Point[] = [];
        const tl = 10;
        const hs = PRNG.random(0.5, 1);
        const fun2 = (x: number) => -1 / Math.pow(x / tl + 1, 5) + 1;
        const a0 = ((PRNG.random() * Math.PI) / 6) * direction + angle;

        for (let i = 0; i < tl; i++) {
            const mx = direction * fun2(i / tl) * 50 * scale * hs;
            const my = -i * 5 * scale;

            const a = Math.atan2(my, mx);
            const d = Math.pow(mx * mx + my * my, 0.5);

            const newX = Math.cos(a + a0) * d;
            const newY = Math.sin(a + a0) * d;

            twlist.push(new Point(newX + tx, newY + ty));
            if (
                (i === ((tl / 3) | 0) || i === (((tl * 2) / 3) | 0)) &&
                depth > 0
            ) {
                this.add(
                    new Twig(
                        newX + tx,
                        newY + ty,
                        depth - 1,
                        angle,
                        scale * 0.8,
                        direction * PRNG.randomChoice([-1, 1]),
                        strokeWidth,
                        leaves
                    )
                );
            }
            if (i === tl - 1 && leaves[0]) {
                for (let j = 0; j < 5; j++) {
                    const dj = (j - 2.5) * 5;
                    const bfunc = function (x: number) {
                        return x <= 1
                            ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
                            : -Math.pow(
                                  Math.sin((x - 2) * Math.PI * (x - 2)),
                                  0.5
                              );
                    };
                    this.add(
                        new Blob(
                            newX + tx + Math.cos(angle) * dj * strokeWidth,
                            newY +
                                ty +
                                (Math.sin(angle) * dj -
                                    leaves[1] / (depth + 1)) *
                                    strokeWidth,
                            angle / 2 +
                                Math.PI / 2 +
                                Math.PI * PRNG.random(-0.1, 0.1),
                            `rgba(100,100,100,${(0.5 + depth * 0.2).toFixed(
                                3
                            )})`,
                            PRNG.random(15, 27) * strokeWidth,
                            PRNG.random(6, 9) * strokeWidth,
                            0.5,
                            bfunc
                        )
                    );
                }
            }
        }
        this.add(
            new Stroke(
                twlist,
                "rgba(100,100,100,0.5)",
                "rgba(100,100,100,0.5)",
                1,
                0.5,
                1,
                (x) => Math.cos((x * Math.PI) / 2)
            )
        );

        return this;
    }
}
