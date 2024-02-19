import PRNG from "./PRNG";
import Perlin from "./Perlin";
import Point from "./Point";
import SketchLayer from "./SketchLayer";
import { config } from "../config";
import { isLocalMaximum } from "../utils/utils";
import Layer from "./Layer";
import Range from "./Range";

const BOAT_PROBABILITY = config.designer.boat.probability;
const BOAT_RADIUS_THRESHOLD = config.designer.boat.radiusThreshold;
const BACKGROUND_MOUNTAIN_INTERVAL =
    config.designer.backgroundMountain.interval;
const BOTTOM_MOUNTAIN_PROBABILITY = config.designer.bottomMountain.probability;
const MAX_BOAT_Y = config.designer.boat.y.max;
const MIN_BOAT_Y = config.designer.boat.y.min;
const MOUNTAIN_COVER_THRESHOLD = config.designer.middleMountain.coverThreshold;
const MOUNTAIN_RADIUS = config.designer.middleMountain.radius;
const NOISE_SAMPLE = config.designer.noiseSample;
const X_STEP = config.designer.xStep;

/**
 * Class for designing new frame. The main reason for this class is to generate new terrain
 * with certainty that the new frames will not collide with each other in ugly manner.
 */
export default class Designer {
    layers: Layer[] = [];
    iMin: number;
    iMax: number;
    xOffset: number;
    /**
     * Generates terrain design.
     * @param {Range} givenRange - Given range for which to generate design.
     */

    constructor(givenRange: Range) {
        this.iMin = Math.floor(givenRange.left / X_STEP);
        this.iMax = Math.floor(givenRange.right / X_STEP);
        this.xOffset =
            (givenRange.left % X_STEP) + (givenRange.left < 0 ? 1 : 0) * X_STEP;

        const yRange = (x: number) => Perlin.noise(x * 0.01, Math.PI);
        const noiseFunction = (point: Point) =>
            Math.max(Perlin.noise(point.x * NOISE_SAMPLE) - 0.55, 0) * 2;

        // the background mountains dont't need to be generated as even if they will collide they will look cool
        this.generateMiddleMountainDesign(noiseFunction, yRange);
        this.generateBottomMountainDesign();
        this.generateBoatDesign();
    }

    /**
     * Checks if a new layer will not collide with already existing layers.
     * @private
     * @param {Layer[]} existingLayers - The array of existing layers.
     * @param {Layer} newLayer - The layer to check.
     * @param {number} radius - The threshold radius for considering layers to be the same.
     * @returns {boolean} True if the layer needs to be added, false otherwise.
     */
    private checkCollision(
        existingLayers: Layer[],
        newLayer: Layer,
        radius: number = 10
    ): boolean {
        const localCheck = existingLayers.every(
            (existingChunk) => Math.abs(existingChunk.x - newLayer.x) >= radius
        );

        const globalCheck = this.layers.every(
            (existingChunk) => Math.abs(existingChunk.x - newLayer.x) >= radius
        );

        return localCheck && globalCheck;
    }

    /**
     * Adds mountain layers to the layers.
     * @private
     * @param {Function} noiseFunction - The noise function.
     * @param {Function} yRange - The y range function.
     * @returns {Layer[]} An array of generated layers.
     */
    private generateMiddleMountainDesign(
        noiseFunction: (point: Point) => number,
        yRange: (x: number) => number
    ): void {
        const localRegion: Layer[] = [];

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

                    if (this.checkCollision(localRegion, mountainChunk)) {
                        localRegion.push(mountainChunk);
                    }
                }
            }

            if (
                Math.abs(x) % BACKGROUND_MOUNTAIN_INTERVAL <
                Math.max(1, X_STEP - 1)
            ) {
                const distMountainChunk = new SketchLayer(
                    "backgroundMountain",
                    x,
                    PRNG.random(230, 280)
                );

                if (this.checkCollision(localRegion, distMountainChunk)) {
                    localRegion.push(distMountainChunk);
                }
            }
        }

        this.layers = this.layers.concat(localRegion);
    }

    /**
     * Adds flat mountain layers to the layers.
     * @private
     * @returns {Layer[]} An array of generated layers.
     */
    private generateBottomMountainDesign(): void {
        const localRegion: Layer[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            const x = i * X_STEP + this.xOffset;

            if (PRNG.random() < BOTTOM_MOUNTAIN_PROBABILITY) {
                for (let j = 0; j < PRNG.random(0, 4); j++) {
                    const bottomMountainChunk = new SketchLayer(
                        "bottomMountain",
                        x + PRNG.random(0, 700),
                        700 - j * 50
                    );

                    if (this.checkCollision(localRegion, bottomMountainChunk)) {
                        localRegion.push(bottomMountainChunk);
                    }
                }
            }
        }

        this.layers = this.layers.concat(localRegion);
    }

    /**
     * Adds boat layers to the layers.
     * @private
     */
    private generateBoatDesign(): void {
        const localRegion: Layer[] = [];

        for (let i = this.iMin; i < this.iMax; i++) {
            if (PRNG.random() < BOAT_PROBABILITY) {
                const x = i * X_STEP + this.xOffset;
                const y = PRNG.random(MIN_BOAT_Y, MAX_BOAT_Y);
                const boatChunk = new SketchLayer("boat", x, y);

                if (
                    this.checkCollision(
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
}
