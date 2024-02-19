import BackgroundMountainLayer from "./layers/BackgroundMountainLayer";
import BoatLayer from "./layers/BoatLayer";
import BottomMountainLayer from "./layers/BottomMountainLayer";
import Layer from "./Layer";
import MiddleMountainLayer from "./layers/MiddleMountainLayer";
import PRNG from "./PRNG";
import Range from "./Range";
import SketchLayer from "./SketchLayer";
import WaterLayer from "./layers/WaterLayer";
import { config } from "../config";

const BACKGROUND_MOUNTAIN_HEIGHT = config.frame.backgroundMountainHeight;
const BOTTOM_MOUNTAIN_FLATNESS_MAX = config.frame.bottomMountainFlatness.max;
const BOTTOM_MOUNTAIN_FLATNESS_MIN = config.frame.bottomMountainFlatness.min;
const BOTTOM_MOUNTAIN_HEIGHT = config.frame.bottomMountainHeight;
const BOTTOM_MOUNTAIN_WIDTH_MAX = config.frame.bottomMountainWidth.max;
const BOTTOM_MOUNTAIN_WIDTH_MIN = config.frame.bottomMountainWidth.min;

/**
 * Class representing a frame used for generating and managing layer of terrain.
 */
export default class Frame {
    /** keeping the active layers within the frame. */
    layers: Layer[] = [];

    constructor(
        public plan: SketchLayer[],
        public visibleRange: Range,
        public id: number
    ) {
        // create active layers from the plan
        console.log(plan);
        this.process(plan);
        // render the layers in the background first
        this.layers.sort((a, b) => a.y - b.y);
    }

    /**
     * Create active layers based on the given plan.
     * @param {SketchLayer[]} plan - plan created by the designer
     */
    private process(plan: SketchLayer[]): void {
        plan.forEach(({ tag, x, y }, i) => {
            if (tag === "middleMountain") {
                this.layers.push(
                    new MiddleMountainLayer(x, y, PRNG.random(0, 2 * i))
                );
                this.layers.push(new WaterLayer(x, y));
            } else if (tag === "bottomMountain") {
                this.layers.push(
                    new BottomMountainLayer(
                        x,
                        y,
                        PRNG.random(0, 2 * Math.PI),
                        BOTTOM_MOUNTAIN_HEIGHT,
                        PRNG.random(
                            BOTTOM_MOUNTAIN_WIDTH_MIN,
                            BOTTOM_MOUNTAIN_WIDTH_MAX
                        ),
                        PRNG.random(
                            BOTTOM_MOUNTAIN_FLATNESS_MIN,
                            BOTTOM_MOUNTAIN_FLATNESS_MAX
                        )
                    )
                );
            } else if (tag === "backgroundMountain") {
                this.layers.push(
                    new BackgroundMountainLayer(
                        x,
                        y,
                        PRNG.random(0, 100),
                        BACKGROUND_MOUNTAIN_HEIGHT,
                        PRNG.randomChoice([500, 1000, 1500])
                    )
                );
            } else if (tag === "boat") {
                this.layers.push(
                    new BoatLayer(
                        x,
                        y,
                        y / 800,
                        PRNG.randomChoice([true, false])
                    )
                );
            }
        });
    }

    /**
     * Renders the frame into an SVG string using web workers.
     * @returns {Promise<string>}
     */
    public async render(): Promise<string> {
        const layerPromises = this.layers.map(async (layer, index) => {
            /**
             * The Worker constructor is being called with a URL object created from a relative path and the import.meta.url.
             * new URL("../utils/workers.ts", import.meta.url) - This constructs a full URL by resolving the relative path
             * "../utils/workers.ts" against the base URL of the current module (import.meta.url).
             * It's a way to ensure the worker script can be located when the code is running, no matter the environment.
             */
            const worker = new Worker(
                new URL("../utils/workers.ts", import.meta.url)
            );
            /** returns svg group with id="layerIndex-layerTag" */
            const result = await new Promise<string>((resolve) => {
                worker.onmessage = (e: MessageEvent) => {
                    resolve(e.data.stringify);
                    worker.terminate();
                };

                worker.postMessage({
                    elements: layer.elements,
                    layerTag: layer.tag,
                    index: index,
                });
            });
            return result;
        });

        const layerResults = await Promise.all(layerPromises).then(
            (layerResults) => {
                return `<g id="frame${this.id}">${layerResults.join("\n")}</g>`;
            }
        );

        return layerResults;
    }
}
