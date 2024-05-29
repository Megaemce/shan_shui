import React, { ChangeEvent } from "react";
import Range from "../classes/Range";
import Renderer from "../classes/Renderer";
import { Button } from "./Button";
import { IMenu } from "../interfaces/IMenu";

/**
 * Menu component that provides various controls and settings for the application.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.seed - The current seed value.
 * @param {Function} props.setSeed - Function to set the seed value.
 * @param {number} props.step - The step value for horizontal scrolling.
 * @param {Function} props.setStep - Function to set the step value.
 * @param {Function} props.horizontalScroll - Function to handle horizontal scrolling.
 * @param {Function} props.toggleAutoScroll - Function to toggle auto-scroll.
 * @param {number} props.newPosition - The new position for rendering.
 * @param {number} props.windowWidth - The width of the window.
 * @param {number} props.windowHeight - The height of the window.
 * @param {Object} props.renderer - The renderer instance.
 * @param {Object} props.saveRange - The range of saved elements.
 * @param {Function} props.onChangeSaveRange - Function to change the save range.
 * @param {Function} props.toggleAutoLoad - Function to toggle auto-load.
 * @param {boolean} props.darkMode - The dark mode state.
 * @returns {JSX.Element} The Menu component.
 */
export const Menu: React.FC<IMenu> = ({
    seed,
    setSeed,
    step,
    setStep,
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
    // Maximum step value calculation
    const maxStep = newPosition + windowWidth + Renderer.forwardCoverage;

    // Handlers for horizontal scrolling
    const horizonalScrollLeft = () => horizontalScroll(-step);
    const horizonalScrollRight = () => horizontalScroll(step);

    // Handler for downloading SVG
    const downloadSvg = () => {
        if (saveRange.length > 0) {
            renderer.download(seed, saveRange, windowHeight, darkMode);
        } else {
            alert(
                `Range length must be above zero.\nYour current range is: [${saveRange.start} - ${saveRange.end}].`
            );
        }
    };

    // Handler for loading the current range
    const loadCurrentRange = () => {
        onChangeSaveRange(new Range(newPosition, newPosition + windowWidth));
    };

    // Handlers for changing the save range
    const onChangeSaveRangeL = (event: ChangeEvent<HTMLInputElement>) =>
        onChangeSaveRange(new Range(event.target.valueAsNumber, saveRange.end));

    const onChangeSaveRangeR = (event: ChangeEvent<HTMLInputElement>) =>
        onChangeSaveRange(
            new Range(saveRange.start, event.target.valueAsNumber)
        );

    // Handler for changing the step value
    const onInputSetChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber > maxStep) {
            window.alert(
                `Value is too damn high!\nCurrent maximum is ${maxStep} which is a sum of current position and 1.5x window width.`
            );
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

    // Handler for reloading with a new seed
    const reload = () => {
        const userChoice = window.confirm(
            "This action will redesigner the whole picture!"
        );
        if (userChoice) {
            const currentDate = new Date().getTime().toString();
            setSeed(currentDate);
        }
    };

    // Handler for sharing the current seed URL
    const share = () => {
        const url = window.location.href.split("?")[0];
        const seedUrl = `${url}?seed=${seed}`;
        navigator.clipboard.writeText(seedUrl).then(() => {
            window.alert(`URL copied to clipboard.\n${seedUrl}`);
        });
    };

    return (
        <div id="Menu" className="hidden">
            <div id="CurrentSeed">
                <h4>Current seed:</h4>
                <p>{seed}</p>
                <Button
                    id="Share"
                    title="Share the link"
                    onClick={share}
                    text="Share"
                />
                <Button
                    id="Reload"
                    title="Reload the view with new seed"
                    onClick={reload}
                    text="Reload"
                />
            </div>
            <div id="CurrentView">
                <h4>Current view:</h4>
                <p>
                    [{newPosition}, {newPosition + windowWidth}]
                </p>
                <Button
                    id="ScrollLeft"
                    title="Scroll left"
                    onClick={horizonalScrollLeft}
                    text="&lt;"
                />
                <input
                    className="InputStep"
                    title="Increment step"
                    type="number"
                    value={step}
                    min={0}
                    max={maxStep}
                    step={100}
                    onChange={onInputSetChange}
                />
                <Button
                    id="ScrollRight"
                    title="Scroll right"
                    onClick={horizonalScrollRight}
                    text="&gt;"
                />
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
                <input
                    min={0}
                    max={maxStep}
                    className="InputNumber"
                    type="number"
                    value={saveRange.start}
                    onChange={onChangeSaveRangeL}
                />
                to
                <input
                    min={0}
                    max={maxStep}
                    className="InputNumber"
                    type="number"
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
                <Button
                    id="ButtonLoadRange"
                    title="Import current range"
                    text="Import current range"
                    onClick={loadCurrentRange}
                />
            </div>
            <div id="Download">
                <Button
                    id="ButtonDownload"
                    title="Download"
                    text="Download"
                    onClick={downloadSvg}
                />
            </div>
        </div>
    );
};
