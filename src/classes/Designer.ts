import DesignChunk from "./DesignChunk";
import IChunk from "../interfaces/IChunk";
import { Noise } from "./PerlinNoise";
import Point from "./Point";
import PRNG from "./PRNG";
import { isLocalMaximum } from "../utils/utils";

/**
 * Threshold value for determining mountain coverage in the design.
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
 * Sample value for the noise function.
 */
const NOISE_SAMPLE = 0.03;

/**
 * Class for generating terrain design chunks based on Perlin noise.
 */
export default class Designer {
    regions: IChunk[] = [];
    prng: PRNG;
    iMin: number;
    iMax: number;
    xOffset: number;
    /**
     * Generates terrain design chunks based on Perlin noise.
     * @param {PRNG} prng - The pseudorandom number generator.
     * @param {number} xMin - The minimum x-coordinate for generation.
     * @param {number} xMax - The maximum x-coordinate for generation.
     */
    constructor(prng: PRNG, xMin: number, xMax: number) {
        this.prng = prng;
        this.iMin = Math.floor(xMin / X_STEP);
        this.iMax = Math.floor(xMax / X_STEP);
        this.xOffset = (xMin % X_STEP) + (xMin < 0 ? 1 : 0) * X_STEP;

        const yRange = (x: number) => Noise.noise(prng, x * 0.01, Math.PI);
        const noiseFunction = (point: Point) =>
            Math.max(Noise.noise(prng, point.x * NOISE_SAMPLE) - 0.55, 0) * 2;

        this.generateMountainChunks(noiseFunction, yRange);
        this.generateFlatMountainChunks();
        this.generateBoatChunks();
    }

    /**
     * Adds boat chunks to the regions.
     * @private
     */
    private generateBoatChunks(): void {
        const localRegion: IChunk[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            if (this.prng.random() < BOAT_PROBABILITY) {
                const x = i * X_STEP + this.xOffset;
                const boatChunk = new DesignChunk(
                    "boat",
                    x,
                    this.prng.random(300, 690)
                );

                if (this.needsAdding(localRegion, boatChunk, 400)) {
                    localRegion.push(boatChunk);
                }
            }
        }

        this.regions = this.regions.concat(localRegion);
    }

    /**
     * Adds mountain chunks to the regions.
     * @private
     * @param {Function} noiseFunction - The noise function.
     * @param {Function} yRange - The y range function.
     * @returns {IChunk[]} An array of generated chunks.
     */
    private generateMountainChunks(
        noiseFunction: (point: Point) => number,
        yRange: (x: number) => number
    ): void {
        const localRegion: IChunk[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            const x = i * X_STEP + this.xOffset;

            for (let y = 0; y < yRange(x) * 480; y += 30) {
                if (
                    noiseFunction(new Point(x, y)) > MOUNTAIN_COVER_THRESHOLD &&
                    isLocalMaximum(
                        new Point(x, y),
                        noiseFunction,
                        MOUNTAIN_RADIUS
                    )
                ) {
                    const xOffset = x + this.prng.random(-500, 500);
                    const yOffset = y + 300;

                    const mountainChunk = new DesignChunk(
                        "mount",
                        xOffset,
                        yOffset
                    );

                    if (this.needsAdding(localRegion, mountainChunk)) {
                        localRegion.push(mountainChunk);
                    }
                }
            }

            if (
                Math.abs(x) % DIST_MOUNTAIN_INTERVAL <
                Math.max(1, X_STEP - 1)
            ) {
                const distMountainChunk = new DesignChunk(
                    "distmount",
                    x,
                    this.prng.random(230, 280)
                );

                if (this.needsAdding(localRegion, distMountainChunk)) {
                    localRegion.push(distMountainChunk);
                }
            }
        }

        this.regions = this.regions.concat(localRegion);
    }

    /**
     * Adds flat mountain chunks to the regions.
     * @private
     * @param {Function} noiseFunction - The noise function.
     * @returns {IChunk[]} An array of generated chunks.
     */
    private generateFlatMountainChunks(): void {
        const localRegion: IChunk[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            const x = i * X_STEP + this.xOffset;

            if (this.prng.random() < FLAT_MOUNTAIN_PROBABILITY) {
                for (let j = 0; j < this.prng.random(0, 4); j++) {
                    const flatMountainChunk = new DesignChunk(
                        "flatmount",
                        x + this.prng.random(-700, 700),
                        700 - j * 50
                    );

                    if (this.needsAdding(localRegion, flatMountainChunk)) {
                        localRegion.push(flatMountainChunk);
                    }
                }
            }
        }

        this.regions = this.regions.concat(localRegion);
    }

    /**
     * Checks if a chunk needs to be added to the region.
     * @private
     * @param {IChunk[]} regions - The region of existing chunks.
     * @param {IChunk} chunk - The chunk to check.
     * @param {number} radius - The threshold radius for considering chunks to be the same.
     * @returns {boolean} True if the chunk needs to be added, false otherwise.
     */
    private needsAdding(
        regions: IChunk[],
        chunk: IChunk,
        radius: number = 10
    ): boolean {
        return regions.every(
            (existingChunk) => Math.abs(existingChunk.x - chunk.x) >= radius
        );
    }
}
