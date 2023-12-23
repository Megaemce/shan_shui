import React, { useState, useEffect, useRef, useCallback } from "react";
import SettingPanel from "./ui/SettingPanel";
import ScrollableCanvas from "./ui/ScrollableCanvas";
import BackgroundRender from "./ui/BackgroundRender";
import PRNG from "./classes/PRNG";
import Range from "./classes/Range";
import { PerlinNoise } from "./classes/PerlinNoise";
import ChunkCache from "./classes/ChunkCache";
import "./App.css";

/**
 * Main application component.
 * @component
 * @returns {JSX.Element} The main application component.
 */
const App: React.FC = () => {
    const FPS = 60;
    const currentSeed = new URLSearchParams(window.location.search).get("seed");
    const currentDate = new Date().getTime().toString();

    // Refs for accessing child components
    const bgRenderRef = useRef<BackgroundRender>(null);
    const prngRef = useRef(new PRNG());
    const noiseRef = useRef(new PerlinNoise());
    const chunkCacheRef = useRef(new ChunkCache());

    // State variables
    const [seed, setSeed] = useState<string>(currentSeed || currentDate);
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
    const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
        undefined
    );

    /**
     * Callback function to handle changes in the PRNG seed.
     * @param {string} newSeed - The new seed value.
     */
    const changeSeed = (newSeed: string) => {
        setSeed(newSeed);
    };

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
        horizonalAutoScroll(step);
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
     * Effect to handle changes in the PRNG seed.
     */
    useEffect(() => {
        prngRef.current.seed = seed;
    }, [seed]);

    /**
     * Effect to update the background image and handle window resize events.
     */
    useEffect(() => {
        const url = bgRenderRef.current?.generate(
            prngRef.current,
            noiseRef.current
        );
        setBackgroundImage(url);

        const resizeCallback = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener("resize", resizeCallback);

        return () => {
            window.removeEventListener("resize", resizeCallback);
        };
    }, [prngRef, noiseRef, seed]);

    /**
     * Callback function to handle horizontal scrolling.
     * @param {number} value - The scroll value.
     */
    const horizontalScroll = useCallback(
        (value: number) => {
            const nextPosition = currentPosition + value;
            setCurrentPosition(nextPosition);

            if (autoLoad) {
                setSaveRange(
                    new Range(nextPosition, nextPosition + windowWidth)
                );
            }
        },
        [autoLoad, currentPosition, windowWidth]
    );

    /**
     * Callback function to handle horizontal auto-scrolling.
     * @param {number} value - The scroll value.
     */
    const horizonalAutoScroll = useCallback(
        (value: number) => {
            if (!autoScroll) return;

            const autoScrollCallback = () => {
                horizontalScroll(value / FPS);
                requestAnimationFrame(autoScrollCallback);
            };

            const interval = FPS;
            const autoScrollTimeout = setTimeout(autoScrollCallback, interval);

            return () => clearTimeout(autoScrollTimeout);
        },
        [autoScroll, FPS, horizontalScroll]
    );

    /**
     * Effect to initiate horizontal auto-scrolling.
     */
    useEffect(() => {
        horizonalAutoScroll(FPS);
    }, [horizonalAutoScroll, FPS]);

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
                    changeSeed={changeSeed}
                    reloadWindowSeed={reloadWindowSeed}
                    horizontalScroll={horizontalScroll}
                    toggleAutoScroll={toggleAutoScroll}
                    currentPosition={currentPosition}
                    chunkCache={chunkCacheRef.current}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    prng={prngRef.current}
                    saveRange={saveRange}
                    onChangeSaveRange={onChangeSaveRange}
                    toggleAutoLoad={toggleAutoLoad}
                />
                <ScrollableCanvas
                    horizontalScroll={horizontalScroll}
                    windowHeight={windowHeight}
                    background={backgroundImage}
                    seed={seed}
                    currentPosition={currentPosition}
                    windowWidth={windowWidth}
                    prng={prngRef.current}
                    chunkCache={chunkCacheRef.current}
                />
            </div>
            <BackgroundRender ref={bgRenderRef} />
        </>
    );
};

export default App;
