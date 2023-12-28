import React from "react";
import Range from "../classes/Range";
import "./styles.css";
import { ScrollBar } from "./ScrollBar";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";
import { config } from "../config";
import PRNG from "../classes/PRNG";

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
    const renderChunks = () => {
        const renderedChunks = chunkCache.chunkArray.map((chunk) => (
            <g
                key={`${chunk.tag} ${chunk.x} ${chunk.y}`}
                transform="translate(0, 0)"
                dangerouslySetInnerHTML={{
                    __html: chunk.render(),
                }}
            ></g>
        ));
        return renderedChunks;
    };

    const color = PRNG.random(225, 245);
    const red = Math.round(color);
    const green = Math.round(color * 0.95);
    const blue = Math.round(color * 0.85);

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
                                <filter
                                    id="roughpaper"
                                    width={windowWidth}
                                    height={windowHeight}
                                >
                                    <feTurbulence
                                        type="fractalNoise"
                                        baseFrequency="0.034"
                                        numOctaves="5"
                                        result="noise"
                                    />
                                    <feDiffuseLighting
                                        in="noise"
                                        lighting-color={
                                            "rgb(" +
                                            red +
                                            "," +
                                            green +
                                            "," +
                                            blue +
                                            ")"
                                        }
                                        surfaceScale="1.5"
                                        result="diffLight"
                                    >
                                        <feDistantLight
                                            azimuth="45"
                                            elevation="35"
                                        />
                                    </feDiffuseLighting>
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.5" />
                                    </feComponentTransfer>
                                </filter>

                                {renderChunks()}
                                <rect
                                    id="background"
                                    filter="url(#roughpaper)"
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
