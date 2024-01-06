// Modified from https://raw.githubusercontent.com/processing/p5.js/master/src/math/noise.js
import PRNG from "./PRNG";
import { config } from "../config";
import { scaledCosine } from "../utils/utils";

const PERLIN_AMP_FALLOFF = config.perlin.ampFalloff;
const PERLIN_OCTAVES = config.perlin.octaves;
const PERLIN_SIZE = config.perlin.size;
const PERLIN_YWRAPB = config.perlin.yWrapb;
const PERLIN_ZWRAPB = config.perlin.zWrapb;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB; // Number of positions to wrap along the y-axis.
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB; // Number of positions to wrap along the z-axis.

/**
 * Class representing Perlin noise generation.
 */
export default class Perlin {
    static perlin: number[] | undefined;

    /**
     * Generates Perlin noise at a given point.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @param z - The z-coordinate.
     * @returns The Perlin noise value at the specified point.
     */
    static noise(x: number, y: number = 0, z: number = 0): number {
        if (this.perlin === undefined) {
            this.perlin = new Array(PERLIN_SIZE + 1);
            for (let i = 0; i < PERLIN_SIZE + 1; i++) {
                this.perlin[i] = PRNG.random();
            }
        }

        let [xInt, yInt, zInt] = [x, y, z].map(Math.floor);
        let [xDec, yDec, zDec] = [x, y, z].map((val) => val - Math.floor(val));

        const xDecRad = scaledCosine(xDec);
        const yDecRad = scaledCosine(yDec);

        let result = 0;
        let amplifier = 0.5;

        for (let o = 0; o < PERLIN_OCTAVES; o++) {
            let of = xInt + (yInt << PERLIN_YWRAPB) + (zInt << PERLIN_ZWRAPB);
            let noise1 = this.perlin[of & PERLIN_SIZE];
            let noise2 = this.perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            let noise3 =
                this.perlin[(of + PERLIN_YWRAP + PERLIN_ZWRAP) & PERLIN_SIZE];

            noise1 += xDecRad * (this.perlin[(of + 1) & PERLIN_SIZE] - noise1);
            noise2 +=
                xDecRad *
                (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - noise2);
            noise1 += yDecRad * (noise2 - noise1);
            of += PERLIN_ZWRAP;
            noise2 = this.perlin[of & PERLIN_SIZE];
            noise2 += xDecRad * (this.perlin[(of + 1) & PERLIN_SIZE] - noise2);
            noise3 +=
                xDecRad *
                (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - noise3);
            noise2 += yDecRad * (noise3 - noise2);
            noise1 += scaledCosine(zDec) * (noise2 - noise1);

            result += noise1 * amplifier;
            amplifier *= PERLIN_AMP_FALLOFF;
            xInt <<= 1;
            xDec *= 2;
            yInt <<= 1;
            yDec *= 2;
            zInt <<= 1;
            zDec *= 2;

            if (xDec >= 1.0) {
                xInt++;
                xDec--;
            }
            if (yDec >= 1.0) {
                yInt++;
                yDec--;
            }
            if (zDec >= 1.0) {
                zInt++;
                zDec--;
            }
        }
        return result;
    }
}
