import React, { useState } from "react";
import { PRNG } from "../render/basic/PRNG";
import { Range } from "../render/basic/range";
import { ChunkCache } from "../render/chunkCache";
import "./styles.css";

/**
 * Represents the properties for the ScrollBar component.
 */
interface IBarProps {
    /** The unique identifier for the ScrollBar. */
    id: string;
    /** The height of the ScrollBar. */
    height: number;
    /** The function to be executed when the ScrollBar is clicked. */
    onClick: () => void;
    /** The icon to be displayed in the ScrollBar. */
    icon: string;
}

/**
 * ScrollBar component for navigation within the ScrollableCanvas.
 */
const ScrollBar: React.FC<IBarProps> = ({ id, height, onClick, icon }) => {
    const [isHover, setIsHover] = useState(false);

    /**
     * Handles mouseover event to set the hover state to true.
     */
    const onMouseOver = () => setIsHover(true);

    /**
     * Handles mouseout event to set the hover state to false.
     */
    const onMouseOut = () => setIsHover(false);

    return (
        <div
            id={id}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            style={{
                backgroundColor: `rgba(0, 0, 0, ${isHover ? 0.1 : 0})`,
                height,
            }}
        >
            <div id={`${id}.t`}>
                <span>{icon}</span>
            </div>
        </div>
    );
};

/**
 * Represents the properties for the ScrollableCanvas component.
 */
interface IProps {
    /** Function to scroll the canvas by a specified value. */
    horizontalScroll: (value: number) => void;
    /** The height of the canvas. */
    windowHeight: number;
    /** The background image URL for the canvas. */
    background: string | undefined;
    /** The seed value for random number generation. */
    seed: string;
    /** The current x-coordinate of the canvas. */
    currentPosition: number;
    /** The width of the canvas. */
    windowWidth: number;
    /** PRNG (Pseudo-Random Number Generator) instance. */
    prng: PRNG;
    /** ChunkCache instance for caching and managing chunks. */
    chunkCache: ChunkCache;
}

/**
 * ScrollableCanvas component for rendering a scrollable canvas with ScrollBars.
 */
const ScrollableCanvas: React.FC<IProps> = ({
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
                                {chunkCache.chunks.map((chunk) => (
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
