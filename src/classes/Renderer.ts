import Designer from "./Designer";
import Frame from "./Frame";
import Range from "./Range";
import { config } from "../config";

const TAG_ORDER = config.renderer.tagOrder;

export default class Renderer {
    /** Keeping the frames array with frames ready to be render in current scenne */
    frames: Frame[] = [];
    /** Making sure that the new render area is at least 1500px ahead of the current frame range
     * so the user doesn't need to render the scene on every click.
     * This value get populated in App.tsx
     */
    static forwardCoverage = 0;
    /** Keeping the range that was already covered by renderer */
    static coveredRange = new Range(0, 0);
    /** Keeeping the current visible range so layers not within range can be hidden.
     *  This value is kept so the Frame.ts can use it without relaying on the
     *  ScrollableCanvas's newPosition parameter
     */
    static visibleRange = new Range(0, 0);

    /**
     * Render picture based on the given range.
     * @param range - The new range of the canvas
     * @return {Promise<string | undefined>} The svg content or undefined if no new frame is created
     */
    public async render(range: Range): Promise<string> {
        // Set the new range as a visible range before adjusting it
        const newRange = new Range(range.start, range.end);

        Renderer.visibleRange = range;

        // Check if the rendering of new frame is needed based on already covered range
        if (!Renderer.coveredRange.contains(range)) {
            // Trim the newRange so it covers only the uncovered range
            if (range.start < Renderer.coveredRange.end) {
                newRange.start = Renderer.coveredRange.end;
            }

            // Expand the range so the scene it's not render every time when user clicks forward
            if (range.end >= Renderer.coveredRange.end) {
                newRange.end += Renderer.forwardCoverage;
                Renderer.coveredRange.end = newRange.end;
            }

            // Shound't happen but just in case
            if (newRange.end < newRange.start)
                console.error(
                    "Trimmed range of new frame is invalid as the end is less than the start"
                );

            const newFrame = await this.createNewFrame(newRange);
            this.frames.push(newFrame);
        }

        // Collect of visible layers
        const visibleLayers = [];
        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            if (!Renderer.visibleRange.isShowing(frame.range)) continue;
            for (let j = 0; j < frame.layers.length; j++) {
                const layer = frame.layers[j];
                if (Renderer.visibleRange.isShowing(layer.range)) {
                    visibleLayers.push({ layer, frameNum: i, layerNum: j });
                }
            }
        }

        // Sort them by the tag order so they will be rendered in the right order
        visibleLayers.sort(({ layer: a }, { layer: b }) => {
            if (TAG_ORDER[a.tag] !== TAG_ORDER[b.tag]) {
                return TAG_ORDER[a.tag] - TAG_ORDER[b.tag];
            } else if (a.y !== b.y) {
                return a.y - b.y;
            } else {
                return a.x - b.x;
            }
        });

        // Chunk layers by number of logical processors
        const chunkedLayers = [];
        for (
            let i = 0;
            i < visibleLayers.length;
            i += navigator.hardwareConcurrency
        ) {
            chunkedLayers.push(
                visibleLayers.slice(i, i + navigator.hardwareConcurrency)
            );
        }

        // Render all of the visible layers
        const results = await Promise.all(
            chunkedLayers.map((layers) =>
                Promise.all(
                    layers.map(({ layer, frameNum, layerNum }) =>
                        layer.render(frameNum, layerNum)
                    )
                )
            )
        );

        // Flatten the results array before joining
        const flattenedResults = results.flat();

        // Return SVG string
        return flattenedResults.join("\n");
    }

    /**
     * Design and create new frame within given range
     * @private
     * @param {Range} range - Designer's range
     * @returns {Promise<Frame>} newly created frame as a promise
     */
    private async createNewFrame(range: Range): Promise<Frame> {
        const frameID = this.frames.length + 1;
        const framePlan = new Designer(range).plan;
        const newFrame = new Frame(frameID);

        framePlan.forEach((sketch) => {
            setTimeout(() => {
                newFrame.sketchToLayer(sketch);
            }, 0);
        });

        // wait for the sketchToLayer to finish
        await new Promise((resolve) => setTimeout(resolve, 0));

        return newFrame;
    }

    /**
     * Downloads the terrain SVG based on the given parameters.
     * @param seed - The seed for the terrain generation.
     * @param range - The range for which to generate the SVG.
     * @param windowHeight - The height of the SVG.
     */
    public async download(
        seed: string,
        range: Range,
        windowHeight: number,
        darkMode?: boolean
    ): Promise<void> {
        const filename: string = `${seed}-[${range.start}, ${range.end}].svg`;
        const viewbox = `${range.start} 0 ${range.length} ${windowHeight}`;
        const element = document.createElement("a");
        const svg = await this.render(range);
        const content: string = `
        <svg 
            id="SVG" 
            xmlns="http://www.w3.org/2000/svg" 
            width="${range.length}" 
            height="${windowHeight}" 
            viewBox="${viewbox}"
            style="${darkMode && "filter: invert(1) sepia(1);"}">
            <defs>
                <filter 
                    width="${range.length}" 
                    height="${windowHeight}" 
                    id="roughpaper">
                          <feTurbulence
                            type="fractalNoise"
                            stitchTiles="stitch"
                            baseFrequency="0.02"
                            numOctaves="5"
                            result="noise"
                        />
                        <feDiffuseLighting
                            in="noise"
                            lightingColor="#F0E7D0"
                            surfaceScale="2"
                            result="diffLight"
                        >
                            <feDistantLight azimuth="45" elevation="60" />
                        </feDiffuseLighting>
                </filter>
            </defs>
            <g id="main">
                ${svg}       
            </g>
            <rect 
                id="Background" 
                width="${range.length}" 
                height="${windowHeight}" 
                filter="url(#roughpaper)" 
                style="mix-blend-mode: multiply">
            </rect>
        </svg>`;

        element.setAttribute(
            "href",
            `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
        );
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
