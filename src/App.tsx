import "./App.css";
import PRNG from "./classes/PRNG";
import Range from "./classes/Range";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Renderer from "./classes/Renderer";
import { ScrollableCanvas } from "./ui/ScrollableCanvas";
import { SettingPanel } from "./ui/SettingPanel";
import { config } from "./config";

/**
 * Main application component.
 * @component
 * @returns {JSX.Element} The main application component.
 */

export const App: React.FC = (): JSX.Element => {
    const FPS = 60;
    const urlSeed = new URLSearchParams(window.location.search).get("seed");
    const currentDate = new Date().getTime().toString();
    const currentSeed = urlSeed || currentDate;
    const rendererRef = useRef(new Renderer());

    // State variables
    const [seed, setSeed] = useState<string>(currentSeed);
    const [step, setStep] = useState(100);
    const [currentPosition, setCurrentPosition] = useState<number>(0);
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
    config.ui.frameWidth =
        window.innerWidth > 1024 ? config.ui.frameWidth : window.innerWidth;

    /**
     * Callback function to handle changes in the save range.
     * @param {Range} newSaveRange - The new save range.
     */
    const onChangeSaveRange = (newSaveRange: Range) => {
        setSaveRange(newSaveRange);
    };

    /**
     * Callback function to toggle auto-scrolling.
     * @param {boolean} isEnabled - Indicates whether auto-scroll is enabled.
     * @param {number} step - The step value for auto-scrolling.
     */
    const toggleAutoScroll = (isEnabled: boolean, step: number) => {
        setAutoScroll(isEnabled);
        horizontalAutoScroll(step);
    };

    /**
     * Callback function to toggle auto-loading.
     * @param {boolean} isEnabled - Indicates whether auto-load is enabled.
     */
    const toggleAutoLoad = (isEnabled: boolean) => {
        setAutoLoad(isEnabled);
        setSaveRange(new Range(currentPosition, currentPosition + windowWidth));
    };

    /**
     * Add hooks for window resize events.
     */
    useEffect(() => {
        const resizeCallback = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener("resize", resizeCallback);

        return () => {
            window.removeEventListener("resize", resizeCallback);
        };
    }, []);

    /**
     * Callback function to handle horizontal scrolling.
     * @param {number} value - The scroll value.
     */
    const horizontalScroll = useCallback(
        (value: number) => {
            const nextPosition = currentPosition + value;
            if (nextPosition > 0) {
                setCurrentPosition(nextPosition);

                if (autoLoad) {
                    setSaveRange(
                        new Range(nextPosition, nextPosition + windowWidth)
                    );
                }
            }
        },
        [autoLoad, currentPosition, windowWidth]
    );

    /**
     * Callback function to handle horizontal auto-scrolling.
     * @param {number} step - The step value for auto-scrolling.
     */
    const horizontalAutoScroll = useCallback(
        (step: number) => {
            if (!autoScroll) return;

            const autoScrollCallback = () => {
                horizontalScroll(step);
                requestAnimationFrame(autoScrollCallback);
            };
            const autoScrollTimeout = setTimeout(autoScrollCallback, step);

            return () => clearTimeout(autoScrollTimeout);
        },
        [autoScroll, horizontalScroll]
    );

    /**
     * Effect to initiate horizontal auto-scrolling.
     */
    useEffect(() => {
        autoScroll && horizontalAutoScroll(FPS);
    }, [autoScroll, horizontalAutoScroll, FPS]);

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
                    currentPosition={currentPosition}
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
                    currentPosition={currentPosition}
                    windowWidth={windowWidth}
                    renderer={rendererRef.current}
                />
            </div>
        </>
    );
};
