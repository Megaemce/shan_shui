import { DesignChunk } from "../classes/DesignChunk";
import { IChunk } from "../interfaces/IChunk";
import { Noise } from "../classes/PerlinNoise";
import { Point } from "../classes/Point";
import { PRNG } from "../classes/PRNG";

/**
 * Threshold value for determining mountain coverage in the design.
 * @notExported
 */
const MOUNTAIN_COVER_THRESHOLD = 0.3;

/**
 * Radius of the circular area used to check for local maxima.
 */
const MOUNTAIN_RADIUS = 2; //

/**
 * Interval at which distant mountains are generated.
 */
const DIST_MOUNTAIN_INTERVAL = 1000;

/**
 * Probability of generating a flat mountain chunk.
 */
const FLAT_MOUNTAIN_PROBABILITY = 0.01;

/**
 * Probability of generating a boat chunk.
 */
const BOAT_PROBABILITY = 0.2;

/**
 * Step size along the x-axis for generating terrain.
 */
const X_STEP = 5;

/**
 * Width of the mountains in the design.
 */
const MOUNTAIN_WIDTH = 200;

/**
 * Sample value for the noise function.
 */
const NOISE_SAMPLE = 0.03;

/**
 * Checks if a point is a local maximum within a circular area.
 * @notExported
 * @param {Point} center - The center point to check.
 * @param {Function} getValue - The function to get the value at a given point.
 * @param {number} radius - The radius of the circular area.
 * @returns {boolean} True if the center point is a local maximum, false otherwise.
 */
function isLocalMaximum(
    center: Point,
    getValue: Function,
    radius: number
): boolean {
    const centerValue = getValue(center);

    for (let x = center.x - radius; x <= center.x + radius; x++) {
        for (let y = center.y - radius; y <= center.y + radius; y++) {
            const neighborValue = getValue(new Point(x, y));

            if (centerValue < neighborValue) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Checks if a chunk needs to be added to the region.
 * @notExported
 * @param {IChunk[]} region - The region of existing chunks.
 * @param {IChunk} chunk - The chunk to check.
 * @param {number} radius - The threshold radius for considering chunks to be the same.
 * @returns {boolean} True if the chunk needs to be added, false otherwise.
 */
function needsAdding(
    region: IChunk[],
    chunk: IChunk,
    radius: number = 10
): boolean {
    return region.every(
        (existingChunk) => Math.abs(existingChunk.x - chunk.x) >= radius
    );
}

/**
 * Generates mountain chunks based on Perlin noise.
 * @notExported
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {Function} noiseFunction - The noise function.
 * @param {Function} yRange - The y range function.
 * @param {number[]} mountainCover - The array to track mountain coverage.
 * @param {number} iMin - The minimum index for generation.
 * @param {number} iMax - The maximum index for generation.
 * @param {number} xOffset - The offset along the x-axis.
 * @returns {IChunk[]} An array of generated chunks.
 */
function generateMountainChunks(
    prng: PRNG,
    noiseFunction: (point: Point) => number,
    yRange: (x: number) => number,
    mountainCover: number[],
    iMin: number,
    iMax: number,
    xOffset: number
): IChunk[] {
    const region: IChunk[] = [];

    for (let i = iMin; i < iMax; i++) {
        const x = i * X_STEP + xOffset;

        for (let y = 0; y < yRange(x) * 480; y += 30) {
            if (
                noiseFunction(new Point(x, y)) > MOUNTAIN_COVER_THRESHOLD &&
                isLocalMaximum(new Point(x, y), noiseFunction, MOUNTAIN_RADIUS)
            ) {
                const xOffset = x + prng.random(-500, 500);
                const yOffset = y + 300;

                const mountainChunk = new DesignChunk(
                    "mount",
                    xOffset,
                    yOffset,
                    noiseFunction(new Point(x, y))
                );

                if (needsAdding(region, mountainChunk)) {
                    region.push(mountainChunk);

                    for (
                        let k = Math.floor((xOffset - MOUNTAIN_WIDTH) / X_STEP);
                        k < (xOffset + MOUNTAIN_WIDTH) / X_STEP;
                        k++
                    ) {
                        mountainCover[k] = isNaN(mountainCover[k])
                            ? 1
                            : mountainCover[k] + 1;
                    }
                }
            }
        }

        if (Math.abs(x) % DIST_MOUNTAIN_INTERVAL < Math.max(1, X_STEP - 1)) {
            const distMountainChunk = new DesignChunk(
                "distmount",
                x,
                prng.random(230, 280),
                noiseFunction(new Point(x, yRange(x) * 480))
            );

            if (needsAdding(region, distMountainChunk)) {
                region.push(distMountainChunk);
            }
        }
    }

    return region;
}

/**
 * Generates flat mountain chunks based on Perlin noise.
 * @notExported
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {Function} noiseFunction - The noise function.
 * @param {number} iMin - The minimum index for generation.
 * @param {number} iMax - The maximum index for generation.
 * @param {number} xOffset - The offset along the x-axis.
 * @returns {IChunk[]} An array of generated chunks.
 */
function generateFlatMountainChunks(
    prng: PRNG,
    noiseFunction: (point: Point) => number,
    iMin: number,
    iMax: number,
    xOffset: number
): IChunk[] {
    const region: IChunk[] = [];

    for (let i = iMin; i < iMax; i++) {
        const x = i * X_STEP + xOffset;

        if (prng.random() < FLAT_MOUNTAIN_PROBABILITY) {
            for (let j = 0; j < prng.random(0, 4); j++) {
                const flatMountainChunk = new DesignChunk(
                    "flatmount",
                    x + prng.random(-700, 700),
                    700 - j * 50,
                    noiseFunction(new Point(x, j))
                );

                if (needsAdding(region, flatMountainChunk)) {
                    region.push(flatMountainChunk);
                }
            }
        }
    }

    return region;
}

/**
 * Generates boat chunks based on Perlin noise.
 * @notExported
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {number} iMin - The minimum index for generation.
 * @param {number} iMax - The maximum index for generation.
 * @param {number} xOffset - The offset along the x-axis.
 * @returns {IChunk[]} An array of generated chunks.
 */
function generateBoatChunks(
    prng: PRNG,
    iMin: number,
    iMax: number,
    xOffset: number
): IChunk[] {
    const region: IChunk[] = [];

    for (let i = iMin; i < iMax; i++) {
        if (prng.random() < BOAT_PROBABILITY) {
            const x = i * X_STEP + xOffset;
            const boatChunk = new DesignChunk("boat", x, prng.random(300, 690));

            if (needsAdding(region, boatChunk, 400)) {
                region.push(boatChunk);
            }
        }
    }

    return region;
}

/**
 * Generates terrain design chunks based on Perlin noise.
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {number[]} mountainCover - The array to track mountain coverage.
 * @param {number} xMin - The minimum x-coordinate for generation.
 * @param {number} xMax - The maximum x-coordinate for generation.
 * @returns {IChunk[]} An array of generated design chunks.
 */
export function design(
    prng: PRNG,
    mountainCover: number[],
    xMin: number,
    xMax: number
): IChunk[] {
    const region: IChunk[] = [];
    const iMin = Math.floor(xMin / X_STEP);
    const iMax = Math.floor(xMax / X_STEP);
    const xOffset = (xMin % X_STEP) + (xMin < 0 ? 1 : 0) * X_STEP;
    const yRange = (x: number) => Noise.noise(prng, x * 0.01, Math.PI);
    const noiseFunction = (point: Point) =>
        Math.max(Noise.noise(prng, point.x * NOISE_SAMPLE) - 0.55, 0) * 2;

    for (let i = iMin; i < iMax; i++) {
        if (isNaN(mountainCover[i])) mountainCover[i] = 0;
    }

    region.push(
        ...generateMountainChunks(
            prng,
            noiseFunction,
            yRange,
            mountainCover,
            iMin,
            iMax,
            xOffset
        )
    );
    region.push(
        ...generateFlatMountainChunks(prng, noiseFunction, iMin, iMax, xOffset)
    );
    region.push(...generateBoatChunks(prng, iMin, iMax, xOffset));

    return region;
}
