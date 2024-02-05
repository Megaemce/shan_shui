import "./styles.css";
import Frame from "./Frame";
import Range from "../classes/Range";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const [viewBoxValue, setViewBoxValue] = useState(
        `0 0 ${windowWidth / ZOOM} ${windowHeight / ZOOM}`
    );
    const [lastViewBoxValue, setLastViewBoxValue] = useState(viewBoxValue);

    /** The viewbox string for the SVG element. */
    const currentViewBoxValue = `${currentPosition} 0 ${windowWidth / ZOOM} ${
        windowHeight / ZOOM
    }`;

    if (viewBoxValue !== currentViewBoxValue) {
        setViewBoxValue(currentViewBoxValue);
        setLastViewBoxValue(viewBoxValue);
    }

    /** Range instance for representing a range of x-coordinates. */
    const newRange = new Range(currentPosition, currentPosition + windowWidth);

    // Update the chunk cache based on the current view
    chunkCache.update(newRange, CANVASWIDTH);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const startTime = performance.now();
    const duration = 500; // in milliseconds

    // Define the animation function
    const animate = useCallback(
        (timestamp: number) => {
            const currentTime = timestamp || performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);

            // Apply an easing function for smoother animation
            const easedProgress = 1 - Math.pow(1 - progress, 2);

            // Interpolate between initial and final values based on progress
            const interpolatedViewBox = interpolateViewBox(
                lastViewBoxValue,
                viewBoxValue,
                easedProgress
            );

            // Apply the interpolated value to the SVG
            svgRef.current?.setAttribute("viewBox", interpolatedViewBox);

            // Continue the animation until the duration is reached
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        },
        [lastViewBoxValue, viewBoxValue, startTime]
    );

    // Helper function to interpolate between two viewBox values
    function interpolateViewBox(start: string, end: string, progress: number) {
        const startValues = start.split(" ").map(parseFloat);
        const endValues = end.split(" ").map(parseFloat);

        const interpolatedValues = startValues.map((startValue, index) => {
            const endValue = endValues[index];
            const interpolatedValue =
                startValue + progress * (endValue - startValue);
            return interpolatedValue;
        });

        return interpolatedValues.join(" ");
    }

    useEffect(() => {
        requestAnimationFrame(animate);
    }, [animate]);

    return (
        <div id="SCROLLABLE_CANVAS">
            <ScrollBar
                id="LeftScroll"
                onClick={() => horizontalScroll(-step)}
                height={windowHeight - 8}
                icon="&#x3008;"
            />
            <svg
                id="SVG"
                ref={svgRef}
                viewBox={`0 0 ${windowWidth / ZOOM} ${windowHeight / ZOOM}`}
                style={{
                    left: 0,
                    position: "fixed",
                    top: 0,
                    // transition: "viewBox 1s ease-in-out",
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
                    {chunkCache.frames.map((frame, i) => {
                        return <Frame key={i} chunkId={i} frame={frame} />;
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
                id="RightScroll"
                onClick={() => horizontalScroll(step)}
                height={windowHeight - 8}
                icon="&#x3009;"
            />
        </div>
    );
};
