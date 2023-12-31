import React from "react";
import Range from "../classes/Range";
import "./styles.css";
import { ScrollBar } from "./ScrollBar";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";
import { config } from "../config";
import ChunkGroup from "./ChunkGroup";
import ChunkCache from "../classes/ChunkCache";

const ZOOM = config.ui.zoom;
const CANVASWIDTH = config.ui.canvasWidth;
const SCROLLVALUE = config.ui.scrollValue;

/**
 * ScrollableCanvas component for rendering a scrollable canvas with ScrollBars.
 */
export const ScrollableCanvas: React.FC<IScrollableCanvas> = ({
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
        <table id="SCROLLABLE_CANVAS">
            <tbody>
                <tr>
                    <td>
                        <ScrollBar
                            id="L"
                            onClick={() => horizontalScroll(-SCROLLVALUE)}
                            height={windowHeight - 8}
                            icon="&#x3008;"
                        />
                    </td>
                    <td>
                        <div
                            id="BG"
                            style={{
                                width: windowWidth,
                                height: windowHeight,
                                left: 0,
                                position: "fixed",
                                top: 0,
                            }}
                        >
                            <svg
                                id="SVG"
                                xmlns="http://www.w3.org/2000/svg"
                                width={windowWidth}
                                height={windowHeight}
                                viewBox={viewbox}
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
                                            <feDistantLight
                                                azimuth="45"
                                                elevation="60"
                                            />
                                        </feDiffuseLighting>
                                    </filter>
                                </defs>
                                <g
                                    id="mainRenderGroup"
                                    width={windowWidth}
                                    height={windowHeight}
                                >
                                    {chunkCache.chunkArray.map((chunks) => {
                                        return (
                                            <ChunkGroup
                                                key={ChunkCache.id}
                                                chunkArray={chunks}
                                            />
                                        );
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
                        </div>
                    </td>
                    <td>
                        <ScrollBar
                            id="R"
                            onClick={() => horizontalScroll(SCROLLVALUE)}
                            height={windowHeight - 8}
                            icon="&#x3009;"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
