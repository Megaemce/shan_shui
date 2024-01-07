import Blob from "../elements/Blob";
import Structure from "../Structure";
import PRNG from "../PRNG";
import Point from "../Point";
import Stroke from "../elements/Stroke";

/**
 * Class representing a generator for a twig with branches and leaves.
 */
export default class Twig extends Structure {
    /**
     * Generates a twig with branches and leaves.
     *
     * @param x - X-coordinate of the twig base.
     * @param y - Y-coordinate of the twig base.
     * @param depth - Depth of the twig branches.
     * @param angle - Initial angle of the twig.
     * @param scale - Scale factor of the twig.
     * @param direction - Direction of the twig branches.
     * @param strokeWidth - Width of the twig branches.
     * @param leaves - Tuple representing whether leaves should be generated and their number.
     */
    constructor(
        x: number,
        y: number,
        depth: number,
        angle: number = 0,
        scale: number = 1,
        direction: number = 1,
        strokeWidth: number = 1,
        leaves: number = 12
    ) {
        super();
        const length = 10;
        const pointArray = new Array<Point>(length);
        const startAngle = ((PRNG.random() * Math.PI) / 6) * direction + angle;
        const hs = PRNG.random(0.5, 1);
        const fun2 = (x: number) => -1 / Math.pow(x / length + 1, 5) + 1;

        for (let i = 0; i < length; i++) {
            const mx = direction * fun2(i / length) * 50 * scale * hs;
            const my = -i * 5 * scale;
            const a = Math.atan2(my, mx);
            const distance = Math.sqrt(mx * mx + my * my);
            const newX = Math.cos(a + startAngle) * distance + x;
            const newY = Math.sin(a + startAngle) * distance + y;

            pointArray[i] = new Point(newX, newY);

            if (
                (i === Math.floor(length / 3) ||
                    i === Math.floor((length * 2) / 3)) &&
                depth > 0
            ) {
                this.add(
                    new Twig(
                        newX,
                        newY,
                        depth - 1,
                        angle,
                        scale * 0.8,
                        direction * PRNG.randomChoice([-1, 1]),
                        strokeWidth,
                        leaves
                    )
                );
            }
            if (i === length - 1 && leaves > 0) {
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
                            newX + Math.cos(angle) * dj * strokeWidth,
                            newY +
                                (Math.sin(angle) * dj - leaves / (depth + 1)) *
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
                pointArray,
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
