import Designer from "./Designer";
import Frame from "./Frame";
import Range from "./Range";
import { config } from "../config";

const ZOOM = config.ui.zoom;
const FRAME_WIDTH = config.ui.frameWidth;

export default class Renderer {
    frames: Frame[] = [];
    visibleRange: Range = new Range();

    /**
     * Updates the frames based on the given range.
     * @param givenRange - The range for which to update the cache.
     */
    public update(givenRange: Range): void {
        while (givenRange.right > this.visibleRange.right - FRAME_WIDTH) {
            let frameRange = new Range(
                this.visibleRange.right,
                this.visibleRange.right + FRAME_WIDTH
            );

            this.visibleRange.right += FRAME_WIDTH;

            console.log("generating frame in range", frameRange);

            const frameID = this.frames.length + 1;
            const framePlan = new Designer(frameRange).layers;
            const newFrame = new Frame(framePlan, frameRange, frameID);

            this.frames.push(newFrame);
        }
    }

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
        const filename: string = `${seed}-[${range.left}, ${range.right}].svg`;
        const windx: number = range.right - range.left;
        const viewbox = `${range.left} 0 ${windx / ZOOM} ${
            windowHeight / ZOOM
        }`;

        this.update(range);

        const left = range.left - FRAME_WIDTH;
        const right = range.right + FRAME_WIDTH;

        const content: string = `
        <svg 
            id="SVG" 
            xmlns="http://www.w3.org/2000/svg" 
            width="${range.right - range.left}" 
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
                                frame.visibleRange.left >= left &&
                                frame.visibleRange.right < right
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
