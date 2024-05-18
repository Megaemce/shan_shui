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
    newPosition,
    windowWidth,
    windowHeight,
    renderer,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const horizonalScrollLeft = () => horizontalScroll(-step);
    const horizonalScrollRight = () => horizontalScroll(step);
    const downloadSvg = () => {
        if (saveRange.length > 0) {
            renderer.download(seed, saveRange, windowHeight);
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

    return (
        <div id="Menu">
            <div className="Section">
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
            <div className="Section">
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
                    max={10000}
                    debounceTimeout={500}
                    step={100}
                    onChange={(e) => setStep(Number(e.target.value))}
                />
                <button title="Scroll right" onClick={horizonalScrollRight}>
                    &gt;
                </button>
            </div>
            <div className="Section">
                <input
                    name="Auto-scroll"
                    id="AutoScroll"
                    type="checkbox"
                    onChange={toggleAutoScroll}
                />
                <label htmlFor="AutoScroll">Auto-scroll</label>
            </div>
            <div className="Section">
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
            <div className="Section">
                <input
                    id="InputAutoLoad"
                    type="checkbox"
                    onChange={toggleAutoLoad}
                />
                <label htmlFor="InputAutoLoad">Auto-load</label>
            </div>
            <div className="Section">
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
            <div className="Section">
                <button
                    title="Download as SVG"
                    type="button"
                    id="ButtonDownload"
                    value="Download as SVG"
                    onClick={downloadSvg}
                >
                    Download as .SVG
                </button>
            </div>
        </div>
    );
};
