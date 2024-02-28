import "./App.css";
import PRNG from "./classes/PRNG";
import Range from "./classes/Range";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Renderer from "./classes/Renderer";
import { ScrollableCanvas } from "./ui/ScrollableCanvas";
import { SettingPanel } from "./ui/SettingPanel";
import lodash from "lodash";

/**
 * Main application component.
 * @component
 * @returns {JSX.Element} The main application component.
 */

export const App: React.FC = (): JSX.Element => {
    const urlSeed = new URLSearchParams(window.location.search).get("seed");
    const currentDate = new Date().getTime().toString();
    const currentSeed = urlSeed || currentDate;
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

    /**
     * Callback function to handle changes in the save range.
     * @param {Range} newSaveRange - The new save range.
     */
    const onChangeSaveRange = (newSaveRange: Range) => {
        setSaveRange(newSaveRange);
    };

    /**
     * Callback function to toggle auto-scrolling.
     */
    const toggleAutoScroll = () => {
        setAutoScroll(!autoScroll);
    };

    /**
     * Callback function to toggle auto-loading.
     */
    const toggleAutoLoad = () => {
        setAutoLoad(!autoLoad);
        setSaveRange(new Range(newPosition, newPosition + windowWidth));
    };

    /**
     * Add hooks for window resize events.
     */
    useEffect(() => {
        const handleResize = lodash.debounce(() => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        }, 200);
        window.addEventListener("resize", handleResize);
        console.log("useEffect on resize was called");

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    /**
     * Callback function to handle horizontal scrolling.
     * @param {number} value - The scroll value.
     */
    const horizontalScroll = useCallback(
        (value: number) => {
            if (newPosition + value < 0) return;

            setNewPosition((current) => current + value);
        },
        [newPosition]
    );

    /**
     * Effect to initiate horizontal auto-scrolling.
     */
    useEffect(() => {
        const autoScrollCallback = () => {
            if (autoScroll) {
                horizontalScroll(step);
                timeoutRef.current = setTimeout(autoScrollCallback, 1000); // Execute every 1 second
            }
        };

        if (autoScroll) {
            timeoutRef.current = setTimeout(autoScrollCallback, 1000); // Start the auto-scrolling
        }

        return () => {
            clearTimeout(timeoutRef.current); // Clean up the timeout when component unmounts
        };
    }, [autoScroll, step, horizontalScroll]);
    /**
     * Callback function to reload the page with a new seed.
     */
    const reloadWindowSeed = () => {
        const url = window.location.href.split("?")[0];
        window.location.href = `${url}?seed=${seed}`;
    };

    return (
        <>
            <div className="App">
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
            </div>
        </>
    );
};
