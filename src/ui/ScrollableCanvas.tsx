import "./styles.css";
import Range from "../classes/Range";
import React, { useEffect, useRef, useState } from "react";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";
import { config } from "../config";
import { Triangle } from "react-loader-spinner";
import { Button } from "./Button";

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
    cachedLayer,
}) => {
    const [loading, setLoading] = useState(true);
    const [svgContent, setSvgContent] = useState("");
    const newRange = new Range(currentPosition, currentPosition + windowWidth);
    const svgRef = useRef<SVGSVGElement | null>(null);

    cachedLayer.update(newRange, CANVASWIDTH);

    useEffect(() => {
        setLoading(true);
        (async () => {
            setSvgContent(await cachedLayer.render());
            setLoading(false);
        })();
    }, [cachedLayer.frames.length, cachedLayer]);

    return (
        <div id="SCROLLABLE_CANVAS">
            <Button
                id="LeftScroll"
                title="Scroll left"
                height={windowHeight - 8}
                icon="&#x3008;"
                onClick={() => horizontalScroll(-step)}
            />

            <svg
                id="SVG"
                ref={svgRef}
                viewBox={`${currentPosition} 0 ${windowWidth / ZOOM} ${
                    windowHeight / ZOOM
                }`}
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
                <g
                    id="main"
                    width={windowWidth}
                    height={windowHeight}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
                <rect
                    id="background"
                    filter="url(#roughpaper)"
                    style={{ mixBlendMode: "multiply" }}
                    width={windowWidth}
                    height={windowHeight}
                />
            </svg>
            <div
                className="Loader"
                style={{ display: loading ? "flex" : "none" }}
            >
                <Triangle
                    visible={loading}
                    height="80"
                    width="80"
                    color="rgba(0, 0, 0, 0.4)"
                    ariaLabel="Rendering layers"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
                <p>Rendering layers...</p>
            </div>

            <Button
                id="RightScroll"
                title="Scroll right"
                height={windowHeight - 8}
                icon="&#x3009;"
                onClick={() => horizontalScroll(step)}
            />
        </div>
    );
};
