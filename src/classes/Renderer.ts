import Designer from "./Designer";
import Frame from "./Frame";
import Range from "./Range";
import { config } from "../config";

const ZOOM = config.ui.zoom;

export default class Renderer {
    /** Keeping the frames array with frames ready to be render in current scenne */
    frames: Frame[] = [];
    /** Making sure that the new render area is at least 1.5x of the current windows width so the user doesn't need to render the scene on every click. */
    static forwardCoverage = 0;
    /** Keeping the range that was already covered by renderer */
    static coveredRange = new Range(0, 0);
    /** Keeeping the current visible range so layers not within range can be hidden.
     *  This value is kept so the Frame.ts can use it without relaying on the
     *  ScrollableCanvas's newPosition parameter
     */
    static visibleRange = new Range(0, 0);

    get visibleRange(): Range {
        return Renderer.visibleRange;
    }

    /**
     * Render picture based on the given range.
     * @param range - The new range of the canvas
     * @return {Promise<string | undefined>} The svg content or undefined if no new frame is created
     */
    public async renderPicture(range: Range): Promise<string | undefined> {
        // Set the new range as a visible range before adjusting it
        const newRange = new Range(range.start, range.end);

        Renderer.visibleRange = range;

        // Check if the rendering of new frame is needed based on already covered range
        if (!Renderer.coveredRange.contains(range)) {
            // Trim the newRange so it covers only the uncovered range
            if (range.start < Renderer.coveredRange.end) {
                newRange.start = Renderer.coveredRange.end;
            }

            // Expand the range so the scene by 0.5 windowWidth so it's not render every time when user clicks forward
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

            return this.renderFrames();
        }

        // render all the visible elements of the frames' layers
    }

    /**
     * Design and create new frame within given range
     * @private
     * @param range given range
     * @returns {Promise<Frame>} newly created frame as a promise
     */
    private async createNewFrame(range: Range): Promise<Frame> {
        console.log("░░░ creating new frame ░░░");

        const frameID = this.frames.length + 1;
        const framePlan = new Designer(range).plan;
        const newFrame = new Frame(frameID);

        await Promise.all(
            framePlan.map((sketch) => newFrame.addSketchToLayers(sketch))
        );

        return newFrame;
    }

    /**
     * Render all frames visible within Renderer.visibleRange
     * @returns {Promise<string>} string representation of SVG image
     */
    public async renderFrames(): Promise<string> {
        const frameResults = await Promise.all(
            this.frames.map((frame) =>
                Renderer.visibleRange.isShowing(frame.range)
                    ? frame.render()
                    : ""
            )
        );

        return frameResults.join("\n");
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

        this.renderPicture(range);

        // const start = range.start - FRAME_WIDTH;
        // const end = range.end + FRAME_WIDTH;

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
