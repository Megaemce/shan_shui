import React, { useState, useEffect, useRef, useCallback } from "react";
import SettingPanel from "./ui/SettingPanel";
import ScrollableCanvas from "./ui/ScrollableCanvas";
import BackgroundRender from "./ui/BackgroundRender";
import { PRNG } from "./render/basic/PRNG";
import { Range } from "./render/basic/range";
import { PerlinNoise } from "./render/basic/perlinNoise";
import { ChunkCache } from "./render/chunkCache";
import "./App.css";

const App: React.FC = () => {
    const bgRenderRef = useRef<BackgroundRender>(null);
    const [seed, setSeed] = useState<string>(
        new URLSearchParams(window.location.search).get("seed") ||
            new Date().getTime().toString()
    );
    const [cursX, setCursX] = useState<number>(0);
    const [windX, setWindX] = useState<number>(window.innerWidth);
    const [windY, setWindY] = useState<number>(window.innerHeight);
    const [autoLoad, setAutoLoad] = useState<boolean>(false);
    const [saveRange, setSaveRange] = useState<Range>(
        new Range(0, window.innerWidth)
    );
    const [autoScroll, setAutoScroll] = useState<boolean>(false);
    const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
        undefined
    );

    const prngRef = useRef(new PRNG());
    const noiseRef = useRef(new PerlinNoise());
    const chunkCacheRef = useRef(new ChunkCache());
    const FPS = 2;

    useEffect(() => {
        prngRef.current.seed(seed);
    }, [seed]);

    useEffect(() => {
        const url = bgRenderRef.current?.generate(
            prngRef.current,
            noiseRef.current
        );
        setBackgroundImage(url);

        const resizeCallback = () => {
            setWindX(window.innerWidth);
            setWindY(window.innerHeight);
        };

        window.addEventListener("resize", resizeCallback);

        return () => {
            window.removeEventListener("resize", resizeCallback);
        };
    }, [prngRef, noiseRef, seed]);

    const horizontalScroll = useCallback(
        (v: number) => {
            const nextX = cursX + v;
            setCursX(nextX);

            if (autoLoad) {
                setSaveRange(new Range(nextX, nextX + windX));
            }
        },
        [autoLoad, cursX, windX]
    );

    const autoXScroll = useCallback(
        (v: number) => {
            if (autoScroll) {
                horizontalScroll(v / FPS);
                const autoXScrollCallback = (v: number) => autoXScroll(v);
                setTimeout(() => autoXScrollCallback(v), 1000 / FPS);
            }
        },
        [autoScroll, FPS, horizontalScroll]
    );

    useEffect(() => {
        autoXScroll(FPS);
    }, [autoXScroll, FPS]);

    const reloadWithSeed = () => {
        const url = window.location.href.split("?")[0];
        window.location.href = `${url}?seed=${seed}`;
    };

    const changeSeed = (newSeed: string) => {
        setSeed(newSeed);
    };

    const onChangeSaveRange = (newSaveRange: Range) => {
        setSaveRange(newSaveRange);
    };

    const toggleAutoScroll = (isAutoScroll: boolean, step: number) => {
        setAutoScroll(isAutoScroll);
        autoXScroll(step);
    };

    const toggleAutoLoad = (shouldAutoLoad: boolean) => {
        setAutoLoad(shouldAutoLoad);
        setSaveRange(new Range(cursX, cursX + windX));
    };

    return (
        <>
            <div className="App">
                <SettingPanel
                    seed={seed}
                    changeSeed={changeSeed}
                    reloadWSeed={reloadWithSeed}
                    horizontalScroll={horizontalScroll}
                    toggleAutoScroll={toggleAutoScroll}
                    cursx={cursX}
                    chunkCache={chunkCacheRef.current}
                    windx={windX}
                    windy={windY}
                    prng={prngRef.current}
                    saveRange={saveRange}
                    onChangeSaveRange={onChangeSaveRange}
                    toggleAutoLoad={toggleAutoLoad}
                />
                <ScrollableCanvas
                    horizontalScroll={horizontalScroll}
                    windy={windY}
                    background={backgroundImage}
                    seed={seed}
                    cursx={cursX}
                    windx={windX}
                    prng={prngRef.current}
                    chunkCache={chunkCacheRef.current}
                />
            </div>
            <BackgroundRender ref={bgRenderRef} />
        </>
    );
};

export default App;
