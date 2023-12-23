import React from "react";
import Range from "../classes/Range";
import "./styles.css";
import { ScrollBar } from "./ScrollBar";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";

/**
 * ScrollableCanvas component for rendering a scrollable canvas with ScrollBars.
 */
const ScrollableCanvas: React.FC<IScrollableCanvas> = ({
    horizontalScroll,
    windowHeight,
    background,
    seed,
    currentPosition,
    windowWidth,
    prng,
    chunkCache,
}) => {
    /** The width of the canvas. */
    const CWID = 512;
    /** The zoom factor for the canvas. */
    const ZOOM = 1.142;

    /** The viewbox string for the SVG element. */
    const viewbox = `${currentPosition} 0 ${windowWidth / ZOOM} ${
        windowHeight / ZOOM
    }`;
    /** Range instance for representing a range of x-coordinates. */
    const nr = new Range(currentPosition, currentPosition + windowWidth);

    // Update the chunk cache based on the current view
    chunkCache.update(prng, nr, CWID);

    return (
        <table id="SCROLLABLE_CANVAS">
            <tbody>
                <tr>
                    <td>
                        <ScrollBar
                            id="L"
                            onClick={() => horizontalScroll(-200)}
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
                                style={{ mixBlendMode: "multiply" }}
                                viewBox={viewbox}
                            >
                                {chunkCache.chunkArray.map((chunk) => (
                                    <g
                                        key={`${chunk.tag} ${chunk.x} ${chunk.y}`}
                                        transform="translate(0, 0)"
                                        dangerouslySetInnerHTML={{
                                            __html: chunk.render(),
                                        }}
                                    ></g>
                                ))}
                            </svg>
                        </div>
                    </td>
                    <td>
                        <ScrollBar
                            id="R"
                            onClick={() => horizontalScroll(200)}
                            height={windowHeight - 8}
                            icon="&#x3009;"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default ScrollableCanvas;
