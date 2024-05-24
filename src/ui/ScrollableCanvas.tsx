import "./styles.css";
import Range from "../classes/Range";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";
import { InfinitySpin } from "react-loader-spinner";

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

    // Create frames within new range
    useEffect(() => {
        const newRange = new Range(newPosition, newPosition + windowWidth);

        setLoading(true);
        (async () => {
            const newSvgContent = await renderer.renderPicture(newRange);
            if (newSvgContent) setSvgContent(newSvgContent);
            setLoading(false);
        })();
    }, [renderer, newPosition, windowWidth]);

    return (
        <div id="ScrollableCanvas">
            <Button
                id="LeftScroll"
                title="Scroll left"
                icon="⟨"
                onClick={() => horizontalScroll(-step)}
            />

            <svg
                id="SVG"
                ref={svgRef}
                viewBox={`${newPosition} 0 ${windowWidth} ${windowHeight}`}
            >
                <defs>
                    <filter
                        id="roughpaper"
                        width={windowWidth}
                        height={windowHeight}
                    >
                        <feTurbulence
                            type="fractalNoise"
                            stitchTiles="stitch"
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
                    id="Picture"
                    width={windowWidth}
                    height={windowHeight}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
                <rect
                    id="Background"
                    filter="url(#roughpaper)"
                    width={windowWidth}
                    height={windowHeight}
                />
            </svg>
            <div id="Loader" className={`${loading ? "" : "hidden"}`}>
                <InfinitySpin width="200" color="rgba(0, 0, 0, 0.4)" />
                <p>Rendering elements</p>
            </div>

            <Button
                id="RightScroll"
                title="Scroll right"
                icon="⟩"
                onClick={() => horizontalScroll(step)}
            />
        </div>
    );
};
