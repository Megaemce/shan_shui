import React from "react";
import { ChangeEvent, useState } from "react";
import { PRNG } from "../classes/PRNG";
import { Range } from "../classes/Range";
import { ChunkCache } from "../classes/ChunkCache";
import { DebounceInput } from "react-debounce-input";
import "./styles.css";

interface MenuProps {
    display: string;
    seed: string;
    changeSeed: (seed: string) => void;
    reloadWindowSeed: () => void;
    horizontalScroll: (v: number) => void;
    toggleAutoScroll: (s: boolean, v: number) => void;
    currentPosition: number;
    windowWidth: number;
    windowHeight: number;
    chunkCache: ChunkCache;
    prng: PRNG;
    saveRange: Range;
    onChangeSaveRange: (r: Range) => void;
    toggleAutoLoad: (s: boolean) => void;
}

const Menu: React.FC<MenuProps> = ({
    display,
    seed,
    changeSeed,
    reloadWindowSeed,
    horizontalScroll,
    toggleAutoScroll,
    currentPosition,
    windowWidth,
    windowHeight,
    chunkCache,
    prng,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const [step, setStep] = useState(100);

    const changeStep = (event: ChangeEvent<HTMLInputElement>) =>
        setStep(event.target.valueAsNumber);

    const horizonalScrollLeft = () => horizontalScroll(-1 * step);
    const horizonalScrollRight = () => horizontalScroll(step);

    const toggleAutoScrollHandler = (event: ChangeEvent<HTMLInputElement>) =>
        toggleAutoScroll(event.target.checked, step);

    const toggleAutoLoadHandler = (event: ChangeEvent<HTMLInputElement>) =>
        toggleAutoLoad(event.target.checked);

    const downloadSvg = () => {
        if (saveRange.length > 0) {
            chunkCache.download(prng, seed, saveRange, windowHeight);
        } else {
            alert("Range length must be above zero");
        }
    };

    const loadCurrentRange = () => {
        onChangeSaveRange(
            new Range(currentPosition, currentPosition + windowWidth)
        );
    };

    const onChangeSaveRangeL = (event: ChangeEvent<HTMLInputElement>) =>
        onChangeSaveRange(
            new Range(event.target.valueAsNumber, saveRange.right)
        );

    const onChangeSaveRangeR = (event: ChangeEvent<HTMLInputElement>) =>
        onChangeSaveRange(
            new Range(saveRange.left, event.target.valueAsNumber)
        );

    return (
        <div id="MENU" style={{ display }}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <pre>SEED</pre>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <DebounceInput
                                id="INP_SEED"
                                className="ROWITEM"
                                title="random seed"
                                value={seed}
                                debounceTimeout={500}
                                onChange={(e) => changeSeed(e.target.value)}
                                style={{ width: 120 }}
                            />
                            <button onClick={reloadWindowSeed}>Generate</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <pre>
                                VIEW [{currentPosition},{" "}
                                {currentPosition + windowWidth}]
                            </pre>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button
                                title="view left"
                                onClick={horizonalScrollLeft}
                            >
                                &lt;
                            </button>
                            <input
                                id="INC_STEP"
                                title="increment step"
                                type="number"
                                value={step}
                                min={0}
                                max={10000}
                                step={20}
                                onChange={changeStep}
                            />
                            <button
                                title="view right"
                                onClick={horizonalScrollRight}
                            >
                                &gt;
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <pre>
                                <input
                                    id="AUTO_SCROLL"
                                    type="checkbox"
                                    onChange={toggleAutoScrollHandler}
                                />
                                Auto-scroll
                            </pre>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <pre>SAVE</pre>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <pre className="ROWITEM">from</pre>
                            <input
                                className="ROWITEM"
                                type="number"
                                value={saveRange.left}
                                onChange={onChangeSaveRangeL}
                                style={{ width: 60 }}
                            />
                            <pre className="ROWITEM">to</pre>
                            <input
                                className="ROWITEM"
                                type="number"
                                value={saveRange.right}
                                onChange={onChangeSaveRangeR}
                                style={{ width: 60 }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <pre>
                                <input
                                    id="AUTO_LOAD"
                                    type="checkbox"
                                    onChange={toggleAutoLoadHandler}
                                />
                                Auto-load
                            </pre>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button
                                title="load current range"
                                type="button"
                                id="loadrange-btn"
                                value="Load Range"
                                onClick={loadCurrentRange}
                            >
                                Load Current Range
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button
                                title="WARNING: This may take a while..."
                                type="button"
                                id="dwn-btn"
                                value="Download as SVG"
                                onClick={downloadSvg}
                            >
                                Download as .SVG
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Menu;
