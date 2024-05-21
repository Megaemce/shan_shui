import PRNG from "./classes/PRNG";
import Range from "./classes/Range";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Renderer from "./classes/rendering/Renderer";
import { ScrollableCanvas } from "./ui/ScrollableCanvas";
import { SettingPanel } from "./ui/SettingPanel";

type AnyFunction = (...args: any[]) => any;

function debounce<F extends AnyFunction>(
    func: F,
    wait: number
): (...args: Parameters<F>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null;

    return function debounced(
        this: ThisParameterType<F>,
        ...args: Parameters<F>
    ): void {
        const context = this;

        const later = () => {
            timeoutId = null;
            func.apply(context, args);
        };

        clearTimeout(timeoutId!);
        timeoutId = setTimeout(later, wait) as any;
    };
}

/**
 * Main application component.
 * @component
 * @returns {JSX.Element} The main application component.
 */
export const App: React.FC = (): JSX.Element => {
    // Initialize seed based on previous value or current time
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

    PRNG.seed = currentSeed;
    Renderer.forwardCoverage = window.innerWidth / 2;

    // Callback function to handle changes in the save range
    const onChangeSaveRange = (newRange: Range) => {
        setSaveRange(newRange);
    };

    // Callback function when Auto-scrolling button is clicked
    const toggleAutoScroll = () => {
        setAutoScroll((current) => !current);
    };

    // Callback function when Auto-loading button is clicked
    const toggleAutoLoad = () => {
        setAutoLoad((current) => !current);
        setSaveRange(new Range(newPosition, newPosition + windowWidth));
    };

    // Add hooks for window resize events with debounce
    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        }, 200);

        window.addEventListener("resize", handleResize);

        Renderer.forwardCoverage = window.innerWidth / 2;

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Callback function to handle horizontal scrolling
    const horizontalScroll = useCallback(
        (value: number) => {
            let newValue = newPosition + value;

            if (newValue < 0) return;
            if (autoLoad) {
                setSaveRange(new Range(newValue, newValue + windowWidth));
            }

            setNewPosition(newValue);
        },
        [newPosition, autoLoad, windowWidth]
    );

    // Effect to initiate horizontal auto-scrolling
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

        // Clean up the timeout when component unmounts
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [autoScroll, step, horizontalScroll]);

    // Callback function to reload the page with a new seed
    const reloadWindowSeed = () => {
        const url = window.location.href.split("?")[0];
        window.location.href = `${url}?seed=${seed}`;
    };

    return (
        <>
            <SettingPanel
                seed={seed}
                setSeed={setSeed}
                step={step}
                setStep={setStep}
                reloadWindowSeed={reloadWindowSeed}
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
                step={step}
                horizontalScroll={horizontalScroll}
                windowHeight={windowHeight}
                newPosition={newPosition}
                windowWidth={windowWidth}
                renderer={rendererRef.current}
            />
        </>
    );
};
