import "./styles.css";
import Range from "../classes/Range";
import React from "react";
import { ChangeEvent } from "react";
import { DebounceInput } from "react-debounce-input";
import { IMenu } from "../interfaces/IMenu";

export const Menu: React.FC<IMenu> = ({
    seed,
    setSeed,
    step,
    setStep,
    reloadWindowSeed,
    horizontalScroll,
    toggleAutoScroll,
    currentPosition,
    windowWidth,
    windowHeight,
    renderer,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const horizonalScrollLeft = () => horizontalScroll(-step);
    const horizonalScrollRight = () => horizontalScroll(step);
    const toggleAutoScrollHandler = (event: ChangeEvent<HTMLInputElement>) =>
        toggleAutoScroll(event.target.checked, step);
    const toggleAutoLoadHandler = (event: ChangeEvent<HTMLInputElement>) =>
        toggleAutoLoad(event.target.checked);
    const downloadSvg = () => {
        if (saveRange.length > 0) {
            renderer.download(seed, saveRange, windowHeight);
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
        <div id="MENU">
            <div>
                <h4>Current seed:</h4>
                <DebounceInput
                    id="INP_SEED"
                    className="ROWITEM_SEED"
                    title="random seed"
                    value={seed}
                    debounceTimeout={500}
                    onChange={(e) => setSeed(e.target.value)}
                />
                <button onClick={reloadWindowSeed}>Generate</button>
            </div>
            <div>
                <h4>Current view:</h4>
                <p>
                    [{currentPosition}, {currentPosition + windowWidth}]
                </p>
                <button title="Scroll left" onClick={horizonalScrollLeft}>
                    &lt;
                </button>
                <DebounceInput
                    id="INC_STEP"
                    title="increment step"
                    type="number"
                    value={step}
                    min={0}
                    max={10000}
                    debounceTimeout={500}
                    step={step}
                    onChange={(e) => setStep(Number(e.target.value))}
                />
                <button title="Scroll right" onClick={horizonalScrollRight}>
                    &gt;
                </button>
            </div>
            <div>
                <input
                    name="Auto-scrol"
                    id="AUTO_SCROLL"
                    type="checkbox"
                    onChange={toggleAutoScrollHandler}
                />
                <label htmlFor="AUTO_SCROLL">Auto-scroll</label>
            </div>
            <div>
                <h4>Save view</h4>
                from
                <DebounceInput
                    className="ROWITEM"
                    type="number"
                    debounceTimeout={500}
                    value={saveRange.left}
                    onChange={onChangeSaveRangeL}
                />
                to
                <DebounceInput
                    className="ROWITEM"
                    type="number"
                    debounceTimeout={500}
                    value={saveRange.right}
                    onChange={onChangeSaveRangeR}
                />
            </div>

            <div>
                <input
                    id="AUTO_LOAD"
                    type="checkbox"
                    onChange={toggleAutoLoadHandler}
                />
                <label htmlFor="AUTO_LOAD">Auto-load</label>
            </div>

            <div>
                <button
                    title="Import current range"
                    type="button"
                    id="loadrange-btn"
                    value="Import current range"
                    onClick={loadCurrentRange}
                >
                    Import current range
                </button>
            </div>
            <div>
                <button
                    title="Download as SVG"
                    type="button"
                    id="dwn-btn"
                    value="Download as SVG"
                    onClick={downloadSvg}
                >
                    Download as .SVG
                </button>
            </div>
        </div>
    );
};
