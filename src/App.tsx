import PRNG from "./classes/PRNG";
import Range from "./classes/Range";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Renderer from "./classes/Renderer";
import { ScrollableCanvas } from "./ui/ScrollableCanvas";
import { SettingPanel } from "./ui/SettingPanel";
import { debounce } from "./utils/utils";

/**
 * Main application component.
 * @component
 * @returns {JSX.Element} The main application component.
 */
export const App: React.FC = (): JSX.Element => {
    // Initialize seed based on URL parameter or current time
    const urlSeed = new URLSearchParams(window.location.search).get("seed");
    const currentDate = new Date().getTime().toString();
    const currentSeed = urlSeed || currentDate;

    // Refs
    const rendererRef = useRef(new Renderer());
    const timeoutRef = useRef<number | NodeJS.Timeout>(0);

    // State variables
    const [seed, setSeed] = useState<string>(currentSeed);
    const [step, setStep] = useState(100);
    const [newPosition, setNewPosition] = useState<number>(0);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState<number>(
        window.innerHeight
    );
    const [autoLoad, setAutoLoad] = useState<boolean>(false);
    const [saveRange, setSaveRange] = useState<Range>(
        new Range(0, window.innerWidth)
    );
    const [autoScroll, setAutoScroll] = useState<boolean>(false);
    const [svgContent, setSvgContent] = useState("");

    // Set initial seed for PRNG and forward coverage for renderer
    PRNG.seed = seed;
    Renderer.forwardCoverage = window.innerWidth / 2;

    // Callback function to handle changes in the save range
    const onChangeSaveRange = (newRange: Range) => {
        setSaveRange(newRange);
    };

    // Toggle auto-scrolling state
    const toggleAutoScroll = () => {
        setAutoScroll((current) => !current);
    };

    // Toggle auto-loading state and set the save range
    const toggleAutoLoad = () => {
        setAutoLoad((current) => !current);
        setSaveRange(new Range(newPosition, newPosition + windowWidth));
    };

    // Handle window resize events with debounce
    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        }, 200);

        window.addEventListener("resize", handleResize);

        Renderer.forwardCoverage = window.innerWidth / 2;

        if (window.innerWidth < 400) {
            window.alert(
                "Some mountains need space to grow.\nYour device's port view is too small for the full experience."
            );
        }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Handle horizontal scrolling
    const horizontalScroll = useCallback(
        (value: number) => {
            let newValue = newPosition + value;

            if (newValue < 0) {
                window.alert(
                    "Already at the beginning of the picture. Move to the right"
                );
                return;
            }
            if (autoLoad) {
                setSaveRange(new Range(newValue, newValue + windowWidth));
            }

            setNewPosition(newValue);
        },
        [newPosition, autoLoad, windowWidth]
    );

    // Effect to handle auto-scrolling and arrow key events
    useEffect(() => {
        const autoScrollCallback = () => {
            if (autoScroll) {
                horizontalScroll(step);
                timeoutRef.current = setTimeout(autoScrollCallback, 1000);
            }
        };

        if (autoScroll) {
            timeoutRef.current = setTimeout(autoScrollCallback, 1000);
        }

        const handleArrowsDown = debounce((event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                horizontalScroll(-step);
            } else if (event.key === "ArrowRight") {
                horizontalScroll(step);
            }
        }, 200);

        document.addEventListener("keydown", handleArrowsDown);

        return () => {
            document.removeEventListener("keydown", handleArrowsDown);
            clearTimeout(timeoutRef.current);
        };
    }, [autoScroll, step, horizontalScroll]);

    // Effect to render the new picture when the reload button is clicked
    useEffect(() => {
        const newRange = new Range(newPosition, newPosition + windowWidth);
        const loader = document.getElementById("Loader") as HTMLElement;
        const loaderText = document.getElementById("LoaderText") as HTMLElement;
        const renderer = rendererRef.current;

        PRNG.seed = seed;
        // Reset the renderer
        Renderer.coveredRange = new Range(0, 0);
        Renderer.visibleRange = new Range(0, 0);
        renderer.frames = [];

        loader.classList.remove("hidden");
        loaderText.innerText = "Creating elements...";
        renderer
            .render(newRange)
            .then(async (newSvgContent) => {
                loaderText.innerText = "Rendering layers...";
                setSvgContent(newSvgContent);
                await new Promise((resolve) => setTimeout(resolve, 0));
            })
            .then(() => loader.classList.add("hidden"));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seed]);

    return (
        <>
            <SettingPanel
                seed={seed}
                setSeed={setSeed}
                step={step}
                setStep={setStep}
                horizontalScroll={horizontalScroll}
                toggleAutoScroll={toggleAutoScroll}
                newPosition={newPosition}
                renderer={rendererRef.current}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                saveRange={saveRange}
                onChangeSaveRange={onChangeSaveRange}
                toggleAutoLoad={toggleAutoLoad}
            />
            <ScrollableCanvas
                windowHeight={windowHeight}
                newPosition={newPosition}
                windowWidth={windowWidth}
                renderer={rendererRef.current}
                svgContent={svgContent}
                setSvgContent={setSvgContent}
            />
        </>
    );
};
