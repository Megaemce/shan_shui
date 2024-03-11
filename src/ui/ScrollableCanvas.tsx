import "./styles.css";
import Range from "../classes/Range";
import React, { useEffect, useRef, useState } from "react";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";
import { config } from "../config";
import { InfinitySpin } from "react-loader-spinner";
import { Button } from "./Button";

const ZOOM = config.ui.zoom;

export const ScrollableCanvas: React.FC<IScrollableCanvas> = ({
    step,
    horizontalScroll,
    windowHeight,
    newPosition,
    windowWidth,
    renderer,
}) => {
    const [loading, setLoading] = useState(true);
    const [svgContent, setSvgContent] = useState("");
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const startingRange = new Range(0, windowWidth);

        renderer.createFrames(startingRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Create frames within new range
    useEffect(() => {
        const newRange = new Range(newPosition, newPosition + windowWidth);

        setLoading(true);
        (async () => {
            setSvgContent(await renderer.createFrames(newRange));
            setLoading(false);
        })();
    }, [renderer, newPosition, windowWidth]);

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
                viewBox={`${newPosition} 0 ${windowWidth / ZOOM} ${
                    windowHeight / ZOOM
                }`}
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
            <div className={`Loader ${loading ? "" : "hidden"}`}>
                <InfinitySpin width="200" color="rgba(0, 0, 0, 0.4)" />
                <p>Rendering new layers</p>
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
