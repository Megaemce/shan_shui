import Range from "../classes/Range";
import React, { useEffect } from "react";
import { IScrollableCanvas } from "../interfaces/IScrollableCanvas";

export const ScrollableCanvas = ({
    windowHeight,
    newPosition,
    windowWidth,
    renderer,
    svgContent,
    setSvgContent,
}: IScrollableCanvas) => {
    // Effect to render frames within the new range whenever newPosition or windowWidth changes
    useEffect(() => {
        const newRange = new Range(newPosition, newPosition + windowWidth);
        const loader = document.getElementById("Loader") as HTMLElement;
        const loaderText = document.getElementById("LoaderText") as HTMLElement;

        // Show loader and update loader text
        loader.classList.remove("hidden");
        loaderText.innerText = "Creating elements...";

        // Render the new range and update SVG content
        renderer
            .render(newRange)
            .then(async (newSvgContent) => {
                loaderText.innerText = "Rendering layers...";
                setSvgContent(newSvgContent);
                await new Promise((resolve) => setTimeout(resolve, 0));
            })
            .then(() => loader.classList.add("hidden")); // Hide loader after rendering
    }, [renderer, newPosition, windowWidth, setSvgContent]);

    return (
        <div id="ScrollableCanvas">
            <svg
                id="SVG"
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
            <div id="Loader">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="100"
                    viewBox="0 0 200 100"
                    data-testid="infinity-spin"
                >
                    <path
                        data-testid="infinity-spin-path-1"
                        stroke="rgba(0, 0, 0, 0.4)"
                        fill="none"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
                        id="InfinityLoop"
                    ></path>
                    <path
                        data-testid="infinity-spin-path-2"
                        opacity="0.07"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.4)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
                    ></path>
                </svg>
                <p id="LoaderText"></p>
            </div>
        </div>
    );
};
