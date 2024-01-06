import "./styles.css";
import ChunkGroup from "./ChunkGroup";
import Range from "../classes/Range";
import React from "react";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";
import { ScrollBar } from "./ScrollBar";
import { config } from "../config";

const ZOOM = config.ui.zoom;
const CANVASWIDTH = config.ui.canvasWidth;

/**
 * ScrollableCanvas component for rendering a scrollable canvas with ScrollBars.
 */
export const ScrollableCanvas: React.FC<IScrollableCanvas> = ({
    step,
    horizontalScroll,
    windowHeight,
    currentPosition,
    windowWidth,
    chunkCache,
}) => {
    /** The viewbox string for the SVG element. */
    const viewbox = `${currentPosition} 0 ${windowWidth / ZOOM} ${
        windowHeight / ZOOM
    }`;
    /** Range instance for representing a range of x-coordinates. */
    const newRange = new Range(currentPosition, currentPosition + windowWidth);

    // Update the chunk cache based on the current view
    chunkCache.update(newRange, CANVASWIDTH);

    return (
        <div id="SCROLLABLE_CANVAS">
            <ScrollBar
                id="L"
                onClick={() => horizontalScroll(-step)}
                height={windowHeight - 8}
                icon="&#x3008;"
            />
            <svg
                id="SVG"
                xmlns="http://www.w3.org/2000/svg"
                width={windowWidth}
                height={windowHeight}
                viewBox={viewbox}
                style={{
                    left: 0,
                    position: "fixed",
                    top: 0,
                }}
            >
                <defs>
                    <filter
                        id="roughpaper"
                        width={windowWidth}
                        height={windowHeight}
                    >
                        <feTurbulence
                            type="fractalNoise"
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
                <g id="main" width={windowWidth} height={windowHeight}>
                    {chunkCache.layers.sort().map((layer, i) => {
                        return <ChunkGroup key={i} chunkId={i} layer={layer} />;
                    })}
                </g>
                <rect
                    id="background"
                    filter="url(#roughpaper)"
                    style={{ mixBlendMode: "multiply" }}
                    width={windowWidth}
                    height={windowHeight}
                />
            </svg>
            <ScrollBar
                id="R"
                onClick={() => horizontalScroll(step)}
                height={windowHeight - 8}
                icon="&#x3009;"
            />
        </div>
    );
};
