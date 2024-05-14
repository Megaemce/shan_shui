import PRNG from "./PRNG";
import Perlin from "./Perlin";
import SketchLayer from "./SketchLayer";
import { config } from "../config";
import { isLocalMaximum } from "../utils/utils";
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
const RADIUS = config.designer.radius;
const X_STEP = config.designer.xStep;

/**
 * Class for designing new frame. The main reason for this class is to generate new terrain
 * with certainty that the new frames will not collide with each other in ugly manner.
 */
export default class Designer {
    plan: SketchLayer[] = [];
    /**
     * Generates terrain design.
     * @param {Range} range - range for which to generate design.
     */
    constructor(range: Range) {
        this.generateDesign(range);
    }

    /**
     * Checks if a new layer will not collide with already existing layers.
     * @private
     * @param {SketchLayer} newLayer - The layer to check.
     * @param {number} [radius=RADIUS] - The threshold radius for considering layers to be the same.
     * @returns {boolean} True if the layer needs to be added, false otherwise.
     */
    private checkCollision(
        newLayer: SketchLayer,
        radius: number = RADIUS
    ): boolean {
        return this.plan.every(
            (layer) => Math.abs(layer.x - newLayer.x) >= radius
        );
    }

    /**
     * Generate new design within given range
     * @private
     */
    private generateDesign(range: Range): void {
        const yRange = (x: number) => Perlin.noise(x * 0.01, Math.PI);
        const noiseFunction = (x: number) =>
            Math.max(Perlin.noise(x * NOISE_SAMPLE) - 0.55, 0) * 2;

        for (let i = 0; i * X_STEP < range.length; i++) {
            const x = range.start + i * X_STEP;

            // generate boats
            if (PRNG.random() < BOAT_PROBABILITY) {
                const y = PRNG.random(MIN_BOAT_Y, MAX_BOAT_Y);
                const boatChunk = new SketchLayer("boat", x, y);

                if (this.checkCollision(boatChunk, BOAT_RADIUS_THRESHOLD)) {
                    this.plan.push(boatChunk);
                }
            }

            // generate middleMountain
            if (
                noiseFunction(x) > MOUNTAIN_COVER_THRESHOLD &&
                isLocalMaximum(x, noiseFunction, MOUNTAIN_RADIUS)
            ) {
                for (let y = 0; y < yRange(x) * 480; y += 30) {
                    const xOffset = x + PRNG.random(0, 500);
                    const yOffset = y + 300;

                    const mountainChunk = new SketchLayer(
                        "middleMountain",
                        xOffset,
                        yOffset
                    );

                    if (this.checkCollision(mountainChunk)) {
                        this.plan.push(mountainChunk);
                    }
                }
            }

            // generate bottomMountain
            if (PRNG.random() < BOTTOM_MOUNTAIN_PROBABILITY) {
                for (let j = 0; j < PRNG.random(0, 4); j++) {
                    const bottomMountainChunk = new SketchLayer(
                        "bottomMountain",
                        x + PRNG.random(0, 700),
                        700 - j * 50
                    );

                    if (this.checkCollision(bottomMountainChunk)) {
                        this.plan.push(bottomMountainChunk);
                    }
                }
            }

            // generate backgroundMountain
            if (
                Math.abs(x) % BACKGROUND_MOUNTAIN_INTERVAL <
                Math.max(1, X_STEP - 1)
            ) {
                const distMountainChunk = new SketchLayer(
                    "backgroundMountain",
                    x,
                    PRNG.random(230, 280)
                );

                if (this.checkCollision(distMountainChunk)) {
                    this.plan.push(distMountainChunk);
                }
            }
        }
    }
}
