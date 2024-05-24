import "./styles.css";
import Range from "../classes/Range";
import React from "react";
import { ChangeEvent } from "react";
import { DebounceInput } from "react-debounce-input";
import { IMenu } from "../interfaces/IMenu";
import Renderer from "../classes/Renderer";

export const Menu: React.FC<IMenu> = ({
    seed,
    setSeed,
    step,
    setStep,
    reloadWindowSeed,
    horizontalScroll,
    toggleAutoScroll,
    newPosition,
    windowWidth,
    windowHeight,
    renderer,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
    darkMode,
}) => {
    const maxStep = newPosition + windowWidth + Renderer.forwardCoverage;
    const horizonalScrollLeft = () => horizontalScroll(-step);
    const horizonalScrollRight = () => horizontalScroll(step);
    const downloadSvg = () => {
        if (saveRange.length > 0) {
            renderer.download(seed, saveRange, windowHeight, darkMode);
        } else {
            alert("Range length must be above zero");
        }
    };
    const loadCurrentRange = () => {
        onChangeSaveRange(new Range(newPosition, newPosition + windowWidth));
    };
    const onChangeSaveRangeL = (event: ChangeEvent<HTMLInputElement>) =>
        onChangeSaveRange(new Range(event.target.valueAsNumber, saveRange.end));
    const onChangeSaveRangeR = (event: ChangeEvent<HTMLInputElement>) =>
        onChangeSaveRange(
            new Range(saveRange.start, event.target.valueAsNumber)
        );
    const onInputSetChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber > maxStep) {
            window.alert("Value is too high. Current maximum is " + maxStep);
            event.target.value = String(maxStep);
            setStep(maxStep);
        } else if (event.target.valueAsNumber < 0) {
            window.alert("Value cannot be negative. Setting to 100");
            event.target.value = String(100);
            setStep(100);
        } else {
            setStep(event.target.valueAsNumber);
        }
    };

    return (
        <div id="Menu" className="hidden">
            <div id="CurrentSeed">
                <h4>Current seed:</h4>
                <DebounceInput
                    className="InputSeed"
                    title="random seed"
                    value={seed}
                    debounceTimeout={500}
                    onChange={(e) => setSeed(e.target.value)}
                />
                <button onClick={reloadWindowSeed}>Generate</button>
            </div>
            <div id="CurrentView">
                <h4>Current view:</h4>
                <p>
                    [{newPosition}, {newPosition + windowWidth}]
                </p>
                <button title="Scroll left" onClick={horizonalScrollLeft}>
                    &lt;
                </button>
                <DebounceInput
                    className="InputStep"
                    title="Increment step"
                    type="number"
                    value={step}
                    min={0}
                    max={maxStep}
                    debounceTimeout={500}
                    step={100}
                    onChange={(e) => onInputSetChange(e)}
                />
                <button title="Scroll right" onClick={horizonalScrollRight}>
                    &gt;
                </button>
            </div>
            <div id="AutoScroll">
                <input
                    name="Auto-scroll"
                    id="InputAutoScroll"
                    type="checkbox"
                    onChange={toggleAutoScroll}
                />
                <label htmlFor="InputAutoScroll">Auto-scroll</label>
            </div>
            <div id="SaveView">
                <h4>Save view</h4>
                from
                <DebounceInput
                    className="InputNumber"
                    type="number"
                    debounceTimeout={500}
                    value={saveRange.start}
                    onChange={onChangeSaveRangeL}
                />
                to
                <DebounceInput
                    className="InputNumber"
                    type="number"
                    debounceTimeout={500}
                    value={saveRange.end}
                    onChange={onChangeSaveRangeR}
                />
            </div>
            <div id="AutoLoad">
                <input
                    id="InputAutoLoad"
                    type="checkbox"
                    onChange={toggleAutoLoad}
                />
                <label htmlFor="InputAutoLoad">Auto-load</label>
            </div>
            <div id="ImportCurrentRange">
                <button
                    title="Import current range"
                    type="button"
                    id="ButtonLoadRange"
                    value="Import current range"
                    onClick={loadCurrentRange}
                >
                    Import current range
                </button>
            </div>
            <div id="Download">
                <button
                    title="Download"
                    type="button"
                    id="ButtonDownload"
                    value="Download"
                    onClick={downloadSvg}
                >
                    Download
                </button>
            </div>
        </div>
    );
};
