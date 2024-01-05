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

        x = Math.abs(x);
        y = Math.abs(y);
        z = Math.abs(z);
        let xi = Math.floor(x);
        let yi = Math.floor(y);
        let zi = Math.floor(z);
        let xf = x - xi;
        let yf = y - yi;
        let zf = z - zi;
        let r = 0;
        let ampl = 0.5;

        for (let o = 0; o < PERLIN_OCTAVES; o++) {
            let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);
            const rxf = scaledCosine(xf);
            const ryf = scaledCosine(yf);
            let n1 = this.perlin[of & PERLIN_SIZE];
            n1 += rxf * (this.perlin[(of + 1) & PERLIN_SIZE] - n1);
            let n2 = this.perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n2 +=
                rxf * (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);
            of += PERLIN_ZWRAP;
            n2 = this.perlin[of & PERLIN_SIZE];
            n2 += rxf * (this.perlin[(of + 1) & PERLIN_SIZE] - n2);
            let n3 = this.perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n3 +=
                rxf * (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);
            n1 += scaledCosine(zf) * (n2 - n1);
            r += n1 * ampl;
            ampl *= PERLIN_AMP_FALLOFF;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;
            if (xf >= 1.0) {
                xi++;
                xf--;
            }
            if (yf >= 1.0) {
                yi++;
                yf--;
            }
            if (zf >= 1.0) {
                zi++;
                zf--;
            }
        }
        return r;
    }
}
