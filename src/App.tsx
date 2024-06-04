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
export const App = (): JSX.Element => {
    // ? RAFAŁ:  Does that need to be here if this value should be received only on inital render?
    const urlSeed = new URLSearchParams(window.location.search).get("seed");
    const currentDate = new Date().getTime().toString();
    const initalSeed = urlSeed || currentDate;

    // ? RAFAŁ: Forget about useRef, I endorse the power of statics! Should I be decapitated?
    if (!PRNG.alreadyPopulated) {
        if (urlSeed) {
            PRNG.seed = urlSeed;
        } else {
            const state = { info: "Updated URL with new seed" };
            const title = `{Shan, Shui}* - ${currentDate}`;
            const url = `/?seed=${currentDate}`;
            // Use pushState to add to the history stack
            window.history.pushState(state, title, url);
            // Use replaceState to replace the current history entry
            window.history.replaceState(state, title, url);

            PRNG.seed = currentDate;
        }
    }

    // ? RAFAŁ: I use this ref only to execute Renderer.render() but I also use static properties of this Class, is that approach ok?
    const rendererRef = useRef(new Renderer());
    const timeoutRef = useRef<number | NodeJS.Timeout>(0);

    // State variables
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

    // Cannot be done via setSeed as it will rerender the scene. Look at Menu.tsx
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

    // Perform only on mount
    useEffect(() => {
        // Handle window resize events with debounce
        const handleResize = debounce(() => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        }, 200);

        window.addEventListener("resize", handleResize);

        // Set forwardCoverage
        Renderer.forwardCoverage = window.innerWidth / 2;

        // Popup alert if window is too small
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

    return (
        <>
            <SettingPanel
                step={step}
                setStep={setStep}
                horizontalScroll={horizontalScroll}
                toggleAutoScroll={toggleAutoScroll}
                newPosition={newPosition}
                setNewPosition={setNewPosition}
                renderer={rendererRef.current}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                saveRange={saveRange}
                onChangeSaveRange={onChangeSaveRange}
                toggleAutoLoad={toggleAutoLoad}
                setSvgContent={setSvgContent}
                initalSeed={initalSeed}
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
