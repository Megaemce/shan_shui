import Designer from "./Designer";
import Frame from "./Frame";
import Range from "./Range";
import { config } from "../config";

const ZOOM = config.ui.zoom;
const FRAME_WIDTH = config.ui.frameWidth;

export default class Renderer {
    frames: Frame[] = [];
    /** Keeping the range that was already covered by renderer */
    static coveredRange = new Range(0, 0);
    /** Keeeping the current visible range so layers not within range can be hidden */
    static visibleRange = new Range(0, 0);

    /**
     * Updates the frames based on the given range.
     * @param range - The new range of the canvas
     */
    public async createFrames(range: Range): Promise<string> {
        Renderer.visibleRange = range;

        // check if new range is extending beyond already covered range and trim it to only have new range
        if (!Renderer.coveredRange.contains(range)) {
            // if the new range start is still within covered range trim it
            if (range.start < Renderer.coveredRange.end) {
                range.start = Renderer.coveredRange.end;
            }

            // cover more then just what is seen so the user will not have to rerender on every click
            if (range.end >= Renderer.coveredRange.end) {
                range.end *= 1.5;
            }

            console.log("range to cover after trimming is:", range);
            console.log("░░░ creating new frame ░░░");

            const frameID = this.frames.length + 1;
            const framePlan = new Designer(range).plan;
            const newFrame = new Frame(framePlan, range, frameID);

            if (newFrame.range.end > Renderer.coveredRange.end) {
                Renderer.coveredRange.end = newFrame.range.end;
            }

            this.frames.push(newFrame);
        }

        const framePromises = this.frames.map(async (frame) => {
            return frame.render();
        });

        const frameResult = await Promise.all(framePromises).then(
            (frameResults) => frameResults.join("\n")
        );

        return frameResult;
    }

    // used by download
    public async render(): Promise<string> {
        /**
         * Make sure that the last added frame is render first so it's not covered with previous frame.
         * In SVG last rendered elements have highest Z-index.
         */
        this.frames.sort((a, b) => b.id - a.id);

        const framePromises = this.frames.map(async (frame) => {
            return frame.render();
        });

        const frameResult = await Promise.all(framePromises).then(
            (frameResults) => frameResults.join("\n")
        );

        return frameResult;
    }

    /**
     * Downloads the terrain SVG based on the given parameters.
     * @param seed - The seed for the terrain generation.
     * @param range - The range for which to generate the SVG.
     * @param windowHeight - The height of the SVG.
     */
    public download(seed: string, range: Range, windowHeight: number): void {
        const filename: string = `${seed}-[${range.start}, ${range.end}].svg`;
        const windx: number = range.end - range.start;
        const viewbox = `${range.start} 0 ${windx / ZOOM} ${
            windowHeight / ZOOM
        }`;

        this.createFrames(range);

        const start = range.start - FRAME_WIDTH;
        const end = range.end + FRAME_WIDTH;

        const content: string = `
        <svg 
            id="SVG" 
            xmlns="http://www.w3.org/2000/svg" 
            width="${range.end - range.start}" 
            height="${windowHeight}" 
            viewBox="${viewbox}">
            <defs>
                <filter 
                    width="${windx}" 
                    height="${windowHeight}" 
                    id="roughpaper">
                        <feTurbulence 
                            type="fractalNoise" 
                            baseFrequency="0.02" 
                            numOctaves="5" 
                            result="noise">
                        </feTurbulence>
                        <feDiffuseLighting 
                            in="noise" 
                            lighting-color="#F0E7D0" 
                            surfaceScale="2" 
                            result="diffLight">
                                <feDistantLight 
                                    azimuth="45" 
                                    elevation="60">
                                </feDistantLight>
                        </feDiffuseLighting>
                </filter>
            </defs>
            <g 
                id="main">
                    ${this.frames
                        .filter(
                            (frame) =>
                                frame.visibleRange.start >= start &&
                                frame.visibleRange.end < end
                        )
                        .forEach((frame) => frame.render())} 
                </g>
            <rect 
                id="background" 
                width="${windx}" 
                height="${windowHeight}" 
                filter="url(#roughpaper)" 
                style="mix-blend-mode:multiply">
            </rect>
        </svg>`;

        const element = document.createElement("a");
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
