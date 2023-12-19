import React, { ChangeEvent, useState } from "react";
import { PRNG } from "../render/basic/PRNG";
import { Range } from "../render/basic/range";
import { ChunkCache } from "../render/chunkCache";
import { DebounceInput } from "react-debounce-input";
import "./styles.css";

interface MenuProps {
    display: string;
    seed: string;
    changeSeed: (seed: string) => void;
    reloadWSeed: () => void;
    xscroll: (v: number) => void;
    toggleAutoScroll: (s: boolean, v: number) => void;
    cursx: number;
    windx: number;
    windy: number;
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
    reloadWSeed,
    xscroll,
    toggleAutoScroll,
    cursx,
    windx,
    windy,
    chunkCache,
    prng,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const [step, setStep] = useState(100);

    const changeStep = (event: ChangeEvent<HTMLInputElement>) =>
        setStep(event.target.valueAsNumber);

    const xscrollLeft = () => xscroll(-1 * step);
    const xscrollRight = () => xscroll(step);

    const toggleAutoScrollHandler = (event: ChangeEvent<HTMLInputElement>) =>
        toggleAutoScroll(event.target.checked, step);

    const toggleAutoLoadHandler = (event: ChangeEvent<HTMLInputElement>) =>
        toggleAutoLoad(event.target.checked);

    const downloadSvg = () => {
        if (saveRange.length > 0) {
            chunkCache.download(prng, seed, saveRange, windy);
        } else {
            alert("Range length must be above zero");
        }
    };

    const loadCurrentRange = () => {
        onChangeSaveRange(new Range(cursx, cursx + windx));
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
                            <button onClick={reloadWSeed}>Generate</button>
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
                                VIEW [{cursx}, {cursx + windx}]
                            </pre>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button title="view left" onClick={xscrollLeft}>
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
                            <button title="view right" onClick={xscrollRight}>
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
