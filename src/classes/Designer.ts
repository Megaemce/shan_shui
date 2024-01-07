import ILayer from "../interfaces/ILayer";
import PRNG from "./PRNG";
import Perlin from "./Perlin";
import Point from "./Point";
import SketchLayer from "./SketchLayer";
import { config } from "../config";
import { isLocalMaximum } from "../utils/utils";

const BOAT_PROBABILITY = config.designer.boat.probability;
const DIST_MOUNTAIN_INTERVAL = config.designer.distanceMountain.interval;
const FLAT_MOUNTAIN_PROBABILITY = config.designer.flatMountain.probability;
const MOUNTAIN_COVER_THRESHOLD = config.designer.mountain.coverThreshold;
const MOUNTAIN_RADIUS = config.designer.mountain.radius;
const NOISE_SAMPLE = config.designer.noiseSample;
const X_STEP = config.designer.xStep;
const MIN_BOAT_Y = config.designer.boat.y.min;
const MAX_BOAT_Y = config.designer.boat.y.max;
const BOAT_RADIUS_THRESHOLD = config.designer.boat.radiusThreshold;

/**
 * Class for generating terrain design chunks based on Perlin noise.
 */
export default class Designer {
    regions: ILayer[] = [];
    iMin: number;
    iMax: number;
    xOffset: number;
    /**
     * Generates terrain design chunks based on Perlin noise.
     * @param {number} xMin - The minimum x-coordinate for generation.
     * @param {number} xMax - The maximum x-coordinate for generation.
     */

    constructor(xMin: number, xMax: number) {
        this.iMin = Math.floor(xMin / X_STEP);
        this.iMax = Math.floor(xMax / X_STEP);
        this.xOffset = (xMin % X_STEP) + (xMin < 0 ? 1 : 0) * X_STEP;

        const yRange = (x: number) => Perlin.noise(x * 0.01, Math.PI);
        const noiseFunction = (point: Point) =>
            Math.max(Perlin.noise(point.x * NOISE_SAMPLE) - 0.55, 0) * 2;

        this.generateMountainChunks(noiseFunction, yRange);
        this.generateFlatMountainChunks();
        this.generateBoatChunks();
    }

    /**
     * Adds boat chunks to the regions.
     * @private
     */
    private generateBoatChunks(): void {
        const localRegion: ILayer[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            if (PRNG.random() < BOAT_PROBABILITY) {
                const x = i * X_STEP + this.xOffset;
                const y = PRNG.random(MIN_BOAT_Y, MAX_BOAT_Y);
                const boatChunk = new SketchLayer("boat", x, y);

                if (
                    this.needsAdding(
                        localRegion,
                        boatChunk,
                        BOAT_RADIUS_THRESHOLD
                    )
                ) {
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
     * @returns {ILayer[]} An array of generated chunks.
     */
    private generateMountainChunks(
        noiseFunction: (point: Point) => number,
        yRange: (x: number) => number
    ): void {
        const localRegion: ILayer[] = [];

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
                    const xOffset = x + PRNG.random(0, 500);
                    const yOffset = y + 300;

                    const mountainChunk = new SketchLayer(
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
                const distMountainChunk = new SketchLayer(
                    "distmount",
                    x,
                    PRNG.random(230, 280)
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
     * @returns {ILayer[]} An array of generated chunks.
     */
    private generateFlatMountainChunks(): void {
        const localRegion: ILayer[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            const x = i * X_STEP + this.xOffset;

            if (PRNG.random() < FLAT_MOUNTAIN_PROBABILITY) {
                for (let j = 0; j < PRNG.random(0, 4); j++) {
                    const flatMountainChunk = new SketchLayer(
                        "flatmount",
                        x + PRNG.random(0, 700),
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
     * @param {ILayer[]} regions - The region of existing chunks.
     * @param {ILayer} chunk - The chunk to check.
     * @param {number} radius - The threshold radius for considering chunks to be the same.
     * @returns {boolean} True if the chunk needs to be added, false otherwise.
     */
    private needsAdding(
        regions: ILayer[],
        chunk: ILayer,
        radius: number = 10
    ): boolean {
        const localCheck = regions.every(
            (existingChunk) => Math.abs(existingChunk.x - chunk.x) >= radius
        );

        const globalCheck = this.regions.every(
            (existingChunk) => Math.abs(existingChunk.x - chunk.x) >= radius
        );

        return localCheck && globalCheck;
    }
}
