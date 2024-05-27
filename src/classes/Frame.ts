import BackgroundMountainLayer from "./layers/BackgroundMountainLayer";
import BoatLayer from "./layers/BoatLayer";
import BottomMountainLayer from "./layers/BottomMountainLayer";
import Layer from "./Layer";
import MiddleMountainLayer from "./layers/MiddleMountainLayer";
import PRNG from "./PRNG";
import Range from "./Range";
import SketchLayer from "./SketchLayer";
import WaterLayer from "./layers/WaterLayer";
import workerBlobURL from "../utils/layerWorker";

/**
 * Class representing a frame used for generating and managing layer of terrain.
 */
export default class Frame {
    /** keeping the active layers within the frame
     *  When passing custom classes or instances to web workers, they are serialized
     *  into plain objects due to the fact that web workers can only communicate using JSON-compatible data types
     */
    layers: Layer[] = [];

    /**
     * @param {number} id - Unique identifier of the frame
     * This field makes sure that the new layer won't exceed the original frame's range
     */
    constructor(public id: number) {}

    /**
     * Create active layers based on the given plan and adds it to Frame.layers
     * @param {SketchLayer} - plan created by the designer
     */
    public sketchToLayer({ tag, x, y, width, height }: SketchLayer): void {
        let layer = undefined;
        let seed: number;

        if (tag === "middleMountain") {
            seed = PRNG.random(0, 2 * this.id);
            layer = new MiddleMountainLayer(x, y, seed, width, height);
        }
        if (tag === "water") {
            layer = new WaterLayer(x, y, width, height);
        }
        if (tag === "bottomMountain") {
            seed = PRNG.random(0, 2 * Math.PI);
            layer = new BottomMountainLayer(x, y, seed, width, height);
        }
        if (tag === "backgroundMountain") {
            seed = PRNG.random(0, 100);
            layer = new BackgroundMountainLayer(x, y, seed, width, height);
        }
        if (tag === "boat") {
            const flip = PRNG.randomChoice([true, false]);
            layer = new BoatLayer(x, y, width, y / 800, flip);
        }
        // make sure that the new elements won't exceed the original frame's range
        layer && this.layers.push(layer);
    }

    /**
     * Renders the frame into an SVG string using web workers.
     *
     * This function chunks the visible layers of the frame into smaller groups,
     * and then renders each group using a web worker. The rendering process
     * is done asynchronously, and the results are collected and joined into
     * a single string.
     *
     * @returns {Promise<string>} A promise that resolves to the SVG string
     *                           representation of the rendered frame.
     */
    public async render(): Promise<string> {
        const layerPromises = this.layers.map((layer, index) => {
            return new Promise<string>((resolve, reject) => {
                const worker = new Worker(workerBlobURL);

                worker.onmessage = (e: MessageEvent) => {
                    worker.terminate();
                    resolve(e.data.stringify);
                };

                worker.onerror = (e) => {
                    worker.terminate();
                    reject(
                        new Error(
                            `Worker failed while rendering layer ${layer.tag} from frame${this.id} with error: ${e.message}`
                        )
                    );
                };

                worker.postMessage({
                    frameNum: this.id,
                    elements: layer.elements,
                    layerTag: layer.tag,
                    index: index,
                });
            });
        });

        const frameRenders = await Promise.all(layerPromises);
        return `<g id="frame${this.id}">${frameRenders.join("\n")}</g>`;
    }

    /**
     * Return the current frame range
     * @returns {Range}
     */
    get range(): Range {
        let xMax = -Infinity;
        let xMin = +Infinity;

        for (let i = 0; i < this.layers.length; i++) {
            const layerStart = this.layers[i].range.start;
            const layerEnd = this.layers[i].range.end;

            if (xMin > layerStart) xMin = layerStart;
            if (xMax < layerEnd) xMax = layerEnd;
        }

        return new Range(xMin, xMax);
    }
}
