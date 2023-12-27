import React from "react";
import Range from "../classes/Range";
import "./styles.css";
import { ScrollBar } from "./ScrollBar";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";
import { config } from "../config";

const ZOOM = config.ui.zoom;
const CANVASWIDTH = config.ui.canvasWidth;
const SCROLLVALUE = config.ui.scrollValue;

/**
 * ScrollableCanvas component for rendering a scrollable canvas with ScrollBars.
 */
export const ScrollableCanvas: React.FC<IScrollableCanvas> = ({
    horizontalScroll,
    windowHeight,
    background,
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
                                backgroundImage: `url(${background})`,
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
                                {renderChunks()}
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
