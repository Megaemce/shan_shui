import { DesignChunk, IChunk } from "./chunk";
import { Noise } from "./perlinNoise";
import { Point } from "./point";
import { PRNG } from "./PRNG";

/**
 * Threshold value for determining mountain coverage in the design.
 */
const MOUNTAIN_COVER_THRESHOLD = 0.3;

/**
 * Radius of the circular area used to check for local maxima.
 */
const MOUNTAIN_RADIUS = 2;

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
 * Checks if a point is a local maximum within a circular area.
 * @param point - The point to check.
 * @param f - The function to evaluate.
 * @param radius - The radius of the circular area.
 * @returns True if the point is a local maximum, false otherwise.
 */
function localMax(
    point: Point,
    f: (point: Point) => number,
    radius: number
): boolean {
    const z0 = f(point);

    for (let x = point.x - radius; x < point.x + radius; x++) {
        for (let y = point.y - radius; y < point.y + radius; y++) {
            if (z0 < f(new Point(x, y))) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Checks if a chunk needs to be added to the region.
 * @param region - The region of existing chunks.
 * @param chunk - The chunk to check.
 * @param radius - The threshold radius for considering chunks to be the same.
 * @returns True if the chunk needs to be added, false otherwise.
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
 * @param prng - The pseudorandom number generator.
 * @param noiseFunction - The noise function.
 * @param yRange - The y range function.
 * @param mountainCover - The array to track mountain coverage.
 * @param xStep - The step size along the x-axis.
 * @param iMin - The minimum index for generation.
 * @param iMax - The maximum index for generation.
 * @param xOffset - The offset along the x-axis.
 * @param width - The width of the mountains.
 * @returns An array of generated chunks.
 */
function generateMountainChunks(
    prng: PRNG,
    noiseFunction: (point: Point) => number,
    yRange: (x: number) => number,
    mountainCover: number[],
    xStep: number,
    iMin: number,
    iMax: number,
    xOffset: number,
    width: number
): IChunk[] {
    const region: IChunk[] = [];

    for (let i = iMin; i < iMax; i++) {
        const x = i * xStep + xOffset;

        for (let j = 0; j < yRange(x) * 480; j += 30) {
            if (
                noiseFunction(new Point(x, j)) > MOUNTAIN_COVER_THRESHOLD &&
                localMax(new Point(x, j), noiseFunction, MOUNTAIN_RADIUS)
            ) {
                const xOf = x + prng.random(-500, 500);
                const yOf = j + 300;

                const mountainChunk = new DesignChunk(
                    "mount",
                    xOf,
                    yOf,
                    noiseFunction(new Point(x, j))
                );

                if (needsAdding(region, mountainChunk)) {
                    region.push(mountainChunk);

                    for (
                        let k = Math.floor((xOf - width) / xStep);
                        k < (xOf + width) / xStep;
                        k++
                    ) {
                        mountainCover[k] = isNaN(mountainCover[k])
                            ? 1
                            : mountainCover[k] + 1;
                    }
                }
            }
        }

        if (Math.abs(x) % DIST_MOUNTAIN_INTERVAL < Math.max(1, xStep - 1)) {
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
 * @param prng - The pseudorandom number generator.
 * @param noiseFunction - The noise function.
 * @param xStep - The step size along the x-axis.
 * @param iMin - The minimum index for generation.
 * @param iMax - The maximum index for generation.
 * @param xOffset - The offset along the x-axis.
 * @returns An array of generated chunks.
 */
function generateFlatMountainChunks(
    prng: PRNG,
    noiseFunction: (point: Point) => number,
    xStep: number,
    iMin: number,
    iMax: number,
    xOffset: number
): IChunk[] {
    const region: IChunk[] = [];

    for (let i = iMin; i < iMax; i++) {
        const x = i * xStep + xOffset;

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
 * @param prng - The pseudorandom number generator.
 * @param xStep - The step size along the x-axis.
 * @param iMin - The minimum index for generation.
 * @param iMax - The maximum index for generation.
 * @param xOffset - The offset along the x-axis.
 * @returns An array of generated chunks.
 */
function generateBoatChunks(
    prng: PRNG,
    xStep: number,
    iMin: number,
    iMax: number,
    xOffset: number
): IChunk[] {
    const region: IChunk[] = [];

    for (let i = iMin; i < iMax; i++) {
        if (prng.random() < BOAT_PROBABILITY) {
            const x = i * xStep + xOffset;
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
 * @param prng - The pseudorandom number generator.
 * @param mountainCover - The array to track mountain coverage.
 * @param xmin - The minimum x-coordinate for generation.
 * @param xmax - The maximum x-coordinate for generation.
 * @returns An array of generated design chunks.
 */
export function design(
    prng: PRNG,
    mountainCover: number[],
    xmin: number,
    xmax: number
): IChunk[] {
    const region: IChunk[] = [];
    const samp = 0.03;
    const noiseFunction = (point: Point) =>
        Math.max(Noise.noise(prng, point.x * samp) - 0.55, 0) * 2;
    const yRange = (x: number) => Noise.noise(prng, x * 0.01, Math.PI);

    const xStep = 5;
    const width = 200;

    const iMin = Math.floor(xmin / xStep);
    const iMax = Math.floor(xmax / xStep);
    const xOffset = (xmin % xStep) + (xmin < 0 ? 1 : 0) * xStep;

    for (let i = iMin; i < iMax; i++) {
        if (isNaN(mountainCover[i])) mountainCover[i] = 0;
    }

    region.push(
        ...generateMountainChunks(
            prng,
            noiseFunction,
            yRange,
            mountainCover,
            xStep,
            iMin,
            iMax,
            xOffset,
            width
        )
    );
    region.push(
        ...generateFlatMountainChunks(
            prng,
            noiseFunction,
            xStep,
            iMin,
            iMax,
            xOffset
        )
    );
    region.push(...generateBoatChunks(prng, xStep, iMin, iMax, xOffset));

    return region;
}
