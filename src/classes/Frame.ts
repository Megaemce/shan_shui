import Layer from "./Layer";
import PRNG from "./PRNG";
import Range from "./Range";
import Renderer from "./Renderer";
import SketchLayer from "./SketchLayer";
import BackgroundMountainLayer from "./layers/BackgroundMountainLayer";
import BoatLayer from "./layers/BoatLayer";
import BottomMountainLayer from "./layers/BottomMountainLayer";
import MiddleMountainLayer from "./layers/MiddleMountainLayer";
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

    constructor(public id: number) {}

    /**
     * Create active layers based on the given plan and adds it to Frame.layers
     * @param {SketchLayer} - plan created by the designer
     */
    public addSketchToLayers({ tag, x, y }: SketchLayer): void {
        let layer: Layer;
        if (tag === "middleMountain") {
            layer = new MiddleMountainLayer(x, y, PRNG.random(0, 2 * this.id));
        } else if (tag === "bottomMountain") {
            layer = new BottomMountainLayer(x, y, PRNG.random(0, 2 * Math.PI));
        } else if (tag === "backgroundMountain") {
            layer = new BackgroundMountainLayer(
                x,
                y,
                PRNG.random(0, 100),
                PRNG.randomChoice([500, 1000, 1500])
            );
        } else if (tag === "boat") {
            layer = new BoatLayer(
                x,
                y,
                y / 800,
                PRNG.randomChoice([true, false])
            );
        } else {
            console.warn("Layer tag is outside nominal type!");
            return;
        }
        this.layers.push(layer);
    }

    /**
     * Renders the frame into an SVG string using web workers.
     * @returns {Promise<string>}
     */

    public async render(): Promise<string> {
        const renderPromises = this.layers.map((layer, index) => {
            if (!Renderer.visibleRange.isShowing(layer.range))
                return Promise.resolve("");

            return new Promise<string>((resolve, reject) => {
                const worker = new Worker(workerBlobURL);

                worker.onmessage = (e: MessageEvent) => {
                    worker.terminate();
                    if (e.data.error) {
                        reject(new Error(e.data.error));
                    } else {
                        resolve(e.data.stringify);
                    }
                };

                worker.onerror = (e) => {
                    worker.terminate();
                    reject(new Error(`Worker error: ${e.message}`));
                };

                worker.postMessage({
                    frameNum: this.id,
                    elements: layer.elements,
                    layerTag: layer.tag,
                    index: index,
                });
            });
        });

        try {
            const results = await Promise.all(renderPromises);
            return `<g id="frame${this.id}">${results.join("\n")}</g>`;
        } catch (error) {
            console.error("Error rendering frame:", error);
            throw error;
        }
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
