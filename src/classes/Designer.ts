import ILayer from "../interfaces/ILayer";
import PRNG from "./PRNG";
import Perlin from "./Perlin";
import Point from "./Point";
import SketchLayer from "./SketchLayer";
import { config } from "../config";
import { isLocalMaximum } from "../utils/utils";

const BOAT_PROBABILITY = config.designer.boat.probability;
const BOAT_RADIUS_THRESHOLD = config.designer.boat.radiusThreshold;
const DIST_MOUNTAIN_INTERVAL = config.designer.backgroundMountain.interval;
const FLAT_MOUNTAIN_PROBABILITY = config.designer.bottomMountain.probability;
const MAX_BOAT_Y = config.designer.boat.y.max;
const MIN_BOAT_Y = config.designer.boat.y.min;
const MOUNTAIN_COVER_THRESHOLD = config.designer.middleMountain.coverThreshold;
const MOUNTAIN_RADIUS = config.designer.middleMountain.radius;
const NOISE_SAMPLE = config.designer.noiseSample;
const X_STEP = config.designer.xStep;

/**
 * Class for generating terrain design based on Perlin noise.
 */
export default class Designer {
    layers: ILayer[] = [];
    iMin: number;
    iMax: number;
    xOffset: number;
    /**
     * Generates terrain design.
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

        this.generateMiddleMountainDesign(noiseFunction, yRange);
        this.generateBottomMountainDesign();
        this.generateBoatDesign();
    }

    /**
     * Adds boat layers to the layers.
     * @private
     */
    private generateBoatDesign(): void {
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
        this.layers = this.layers.concat(localRegion);
    }

    /**
     * Adds mountain layers to the layers.
     * @private
     * @param {Function} noiseFunction - The noise function.
     * @param {Function} yRange - The y range function.
     * @returns {ILayer[]} An array of generated layers.
     */
    private generateMiddleMountainDesign(
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
                        "middleMountain",
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
                    "backgroundMoutain",
                    x,
                    PRNG.random(230, 280)
                );

                if (this.needsAdding(localRegion, distMountainChunk)) {
                    localRegion.push(distMountainChunk);
                }
            }
        }

        this.layers = this.layers.concat(localRegion);
    }

    /**
     * Adds flat mountain layers to the layers.
     * @private
     * @returns {ILayer[]} An array of generated layers.
     */
    private generateBottomMountainDesign(): void {
        const localRegion: ILayer[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            const x = i * X_STEP + this.xOffset;

            if (PRNG.random() < FLAT_MOUNTAIN_PROBABILITY) {
                for (let j = 0; j < PRNG.random(0, 4); j++) {
                    const flatMountainChunk = new SketchLayer(
                        "bottomMountain",
                        x + PRNG.random(0, 700),
                        700 - j * 50
                    );

                    if (this.needsAdding(localRegion, flatMountainChunk)) {
                        localRegion.push(flatMountainChunk);
                    }
                }
            }
        }

        this.layers = this.layers.concat(localRegion);
    }

    /**
     * Checks if a layer needs to be added to the region.
     * @private
     * @param {ILayer[]} region - The region of existing layers.
     * @param {ILayer} layer - The layer to check.
     * @param {number} radius - The threshold radius for considering layers to be the same.
     * @returns {boolean} True if the layer needs to be added, false otherwise.
     */
    private needsAdding(
        region: ILayer[],
        layer: ILayer,
        radius: number = 10
    ): boolean {
        const localCheck = region.every(
            (existingChunk) => Math.abs(existingChunk.x - layer.x) >= radius
        );

        const globalCheck = this.layers.every(
            (existingChunk) => Math.abs(existingChunk.x - layer.x) >= radius
        );

        return localCheck && globalCheck;
    }
}
