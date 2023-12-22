/**
 * Class representing boundaries in the x and y directions.
 */

export class Bound {
    /**
     * Creates a new Bound.
     * @param xMin - The minimum value for the x-axis.
     * @param xMax - The maximum value for the x-axis.
     * @param yMin - The minimum value for the y-axis.
     * @param yMax - The maximum value for the y-axis.
     */
    constructor(
        public xMin: number = 0,
        public xMax: number = 0,
        public yMin: number = 0,
        public yMax: number = 0
    ) {}
}
