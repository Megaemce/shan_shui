import Layer from "./Layer";
import Range from "./Range";
import Renderer from "./Renderer";
import SketchLayer from "./SketchLayer";

/**
 * Class representing a frame used for generating and managing layer of terrain.
 */
export default class Frame {
    /** keeping the active layers within the frame. */
    layers: Layer[] = [];

    constructor(
        public plan: Layer[], // TODO: this should be removed in prod as it's only for debugging
        public id: number
    ) {}

    /**
     * Create active layers based on the given plan and adds it to Frame.layers
     * @param {SketchLayer} - plan created by the designer
     */
    public async addSketchToLayers({ tag, x, y }: SketchLayer): Promise<void> {
        return new Promise((resolve) => {
            const worker = new Worker(
                new URL("../utils/planWorker.ts", import.meta.url)
            );

            worker.onmessage = (e: MessageEvent) => {
                const layer = e.data.layer;
                this.layers.push(layer);
                worker.terminate();
                resolve();
            };

            worker.postMessage({
                tag: tag,
                index: this.id,
                x: x,
                y: y,
            });
        });
    }

    /**
     * Renders the frame into an SVG string using web workers.
     * @returns {Promise<string>}
     */
    public async render(): Promise<string> {
        const renderedLayers: string[] = [];

        for (let index = 0; index < this.layers.length; index++) {
            const layer = this.layers[index];

            if (!Renderer.visibleRange.isShowing(layer.range)) continue;

            const worker = new Worker(
                new URL("../utils/layerWorker.ts", import.meta.url)
            );

            const result = await new Promise<string>((resolve) => {
                worker.onmessage = (e: MessageEvent) => {
                    worker.terminate();
                    resolve(e.data.stringify);
                };

                worker.postMessage({
                    frameNum: this.id,
                    elements: layer.elements,
                    layerTag: layer.tag,
                    index: index,
                });
            });

            renderedLayers.push(result);
        }

        return `<g id="frame${this.id}">${renderedLayers.join("\n")}</g>`;
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
