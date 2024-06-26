import React, { useEffect, useState } from "react";
import { ISettingPanel } from "../interfaces/ISettingPanel";
import { Menu } from "./Menu";
import { Button } from "./Button";

export const SettingPanel = ({
    step,
    setStep,
    horizontalScroll,
    toggleAutoScroll,
    newPosition,
    setNewPosition,
    renderer,
    windowWidth,
    windowHeight,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
    setSvgContent,
    initalSeed,
}: ISettingPanel) => {
    // State variables
    const [menuVisible, setMenuVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Icons for menu visibility and dark mode toggle
    const icon: string = menuVisible ? "X" : "III";
    const darkModeIcon: string = darkMode ? "☀" : "☾";

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        const isDarkMode = darkModeMediaQuery.matches;

        if (isDarkMode) {
            toggleDarkmode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to handle GitHub button click
    const handleGitHubClick = () => {
        window.open("https://github.com/Megaemce/shan_shui", "_blank");
    };

    // Function to toggle the visibility of the settings menu
    const toggleVisible = () => {
        const menu = document.getElementById("Menu") as HTMLElement;
        const settingButton = document.getElementById(
            "Settings"
        ) as HTMLElement;

        setMenuVisible(!menuVisible);

        if (!menuVisible) {
            menu.classList.remove("hidden");
            settingButton.title = "Close settings";
        } else {
            menu.classList.add("hidden");
            settingButton.title = "Open settings";
        }
    };

    // Function to toggle dark mode
    const toggleDarkmode = () => {
        const buttons = document.getElementById("Buttons") as HTMLElement;
        const darkModeButton = document.getElementById(
            "Darkmode"
        ) as HTMLElement;
        const svg = document.getElementById("SVG") as HTMLElement;
        const leftScroll = document.getElementById("LeftScroll") as HTMLElement;
        const rightScroll = document.getElementById(
            "RightScroll"
        ) as HTMLElement;
        const loader = document.getElementById("Loader") as HTMLElement;
        const menu = document.getElementById("Menu") as HTMLElement;

        setDarkMode(!darkMode);

        if (!darkMode) {
            buttons.classList.add("darkmode");
            leftScroll.classList.add("darkmode");
            rightScroll.classList.add("darkmode");
            menu.classList.add("darkmode");
            loader.classList.add("darkmode");
            svg.classList.add("darkmode");
            darkModeButton.title = "Light mode";
        } else {
            buttons.classList.remove("darkmode");
            leftScroll.classList.remove("darkmode");
            rightScroll.classList.remove("darkmode");
            menu.classList.remove("darkmode");
            loader.classList.remove("darkmode");
            svg.classList.remove("darkmode");
            darkModeButton.title = "Dark mode";
        }
    };

    return (
        <>
            <div id="Buttons">
                <div className="TopButtons">
                    <div className="LeftButtons">
                        <Button
                            id="Settings"
                            title="Open settings"
                            onClick={toggleVisible}
                            text={icon}
                        />
                        <Button
                            id="Darkmode"
                            title="Dark mode"
                            onClick={toggleDarkmode}
                            text={darkModeIcon}
                        />
                    </div>
                    <Button
                        id="GitHub"
                        title="Open GitHub project"
                        onClick={handleGitHubClick}
                        text="</>"
                    />
                </div>
                <div className="ScrollButtons">
                    <Button
                        id="LeftScroll"
                        title="Scroll left"
                        text="⟨"
                        onClick={() => horizontalScroll(-step)}
                    />
                    <Button
                        id="RightScroll"
                        title="Scroll right"
                        text="⟩"
                        onClick={() => horizontalScroll(step)}
                    />
                </div>
            </div>
            <Menu
                step={step}
                setStep={setStep}
                horizontalScroll={horizontalScroll}
                toggleAutoScroll={toggleAutoScroll}
                newPosition={newPosition}
                setNewPosition={setNewPosition}
                renderer={renderer}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                saveRange={saveRange}
                onChangeSaveRange={onChangeSaveRange}
                toggleAutoLoad={toggleAutoLoad}
                darkMode={darkMode}
                setSvgContent={setSvgContent}
                initalSeed={initalSeed}
            />
        </>
    );
};
