import Blob from "../elements/Blob";
import Structure from "../Structure";
import PRNG from "../PRNG";

/**
 * Generates a tree with blob-like clusters of branches.
 */
export default class Tree02 extends Structure {
    /**
     * Constructor for the Tree02 class.
     * @param xOffset - X-coordinate offset of the tree base.
     * @param yOffset - Y-coordinate offset of the tree base.
     * @param color - Color of the tree.
     * @param clusters - Number of blob-like clusters.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        color: string = "rgba(100,100,100,0.5)",
        clusters: number = 5
    ) {
        super();

        const height: number = 16,
            strokeWidth: number = 8;

        const bfunc = (x: number) =>
            x <= 1
                ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
                : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);

        for (let i = 0; i < clusters; i++) {
            this.add(
                new Blob(
                    xOffset + PRNG.gaussianRandom() * clusters * 4,
                    yOffset + PRNG.gaussianRandom() * clusters * 4,
                    Math.PI / 2,
                    color,
                    PRNG.random(0.5, 1.25) * height,
                    PRNG.random(0.5, 1.25) * strokeWidth,
                    0.5,
                    bfunc
                )
            );
        }
    }
}
