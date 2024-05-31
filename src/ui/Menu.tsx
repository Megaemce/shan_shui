import React, { ChangeEvent } from "react";
import Range from "../classes/Range";
import Renderer from "../classes/Renderer";
import { Button } from "./Button";
import { IMenu } from "../interfaces/IMenu";
import PRNG from "../classes/PRNG";

/**
 * Menu component that provides various controls and settings for the application.
 * @component
 * @param {Object} props - The component props.
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
 * @param {Function} props.setSvgContent - Function to set the SVG content.
 * @param {string} props.initalSeed - The initial seed taken when the page is loaded.
 * @returns {JSX.Element} The Menu component.
 */
export const Menu: React.FC<IMenu> = ({
    step,
    setStep,
    horizontalScroll,
    toggleAutoScroll,
    newPosition,
    setNewPosition,
    windowWidth,
    windowHeight,
    renderer,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
    darkMode,
    setSvgContent,
    initalSeed,
}) => {
    // Maximum step value calculation
    const maxStep = newPosition + windowWidth + Renderer.forwardCoverage;

    // Handlers for horizontal scrolling
    const horizontalScrollLeft = () => horizontalScroll(-step);
    const horizontalScrollRight = () => horizontalScroll(step);

    // Handler for downloading SVG
    const downloadSvg = () => {
        if (saveRange.length > 0) {
            renderer.download(initalSeed, saveRange, windowHeight, darkMode);
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
            "This action will redesign the whole picture!"
        );
        if (userChoice) {
            const currentDate = new Date().getTime().toString();
            const newRange = new Range(0, windowWidth);
            const loader = document.getElementById("Loader") as HTMLElement;
            const loaderText = document.getElementById(
                "LoaderText"
            ) as HTMLElement;
            const state = { info: "Updated URL with new seed" };
            const title = `{Shan, Shui}* - ${currentDate}`;
            const url = `/?seed=${currentDate}`;

            // Use pushState to add to the history stack
            window.history.pushState(state, title, url);

            // Use replaceState to replace the current history entry
            window.history.replaceState(state, title, url);

            // Bring new seed to life
            PRNG.seed = currentDate;

            // Reset the renderer's static properties
            Renderer.coveredRange = new Range(0, 0);
            Renderer.visibleRange = new Range(0, 0);

            // Remove old frames
            renderer.frames = [];

            // Reset canvas position to 0,windowWidth
            setNewPosition(0);

            loader.classList.remove("hidden");
            loaderText.innerText = "Creating elements...";
            renderer
                .render(newRange)
                .then(async (newSvgContent) => {
                    loaderText.innerText = "Rendering layers...";
                    setSvgContent(newSvgContent);
                    await new Promise((resolve) => setTimeout(resolve, 0));
                })
                .then(() => loader.classList.add("hidden"));
        }
    };

    // Handler for sharing the current seed URL
    const share = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            window.alert(`URL copied to clipboard.\n${url}`);
        });
    };

    return (
        <div id="Menu" className="hidden">
            <div id="CurrentSeed">
                <h4>Current seed:</h4>
                <p>{initalSeed}</p>
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
                    onClick={horizontalScrollLeft}
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
                    onClick={horizontalScrollRight}
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
                <Button
                    id="Share"
                    title="Share the link"
                    onClick={share}
                    text="Share"
                />
            </div>
        </div>
    );
};
