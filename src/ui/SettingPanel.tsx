import "./styles.css";
import React, { useState } from "react";
import { ISettingPanel } from "../interfaces/ISettingPanel";
import { Menu } from "./Menu";
import { Button } from "./Button";

export const SettingPanel: React.FC<ISettingPanel> = ({
    seed,
    setSeed,
    step,
    setStep,
    reloadWindowSeed,
    horizontalScroll,
    toggleAutoScroll,
    newPosition,
    renderer,
    windowWidth,
    windowHeight,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const icon: string = menuVisible ? "X" : "III";
    const darkModeIcon: string = darkMode ? "☀" : "☾";

    const handleGitHubClick = () => {
        window.location.href = "https://github.com/Megaemce/shan_shui";
    };

    const toggleVisible = () => {
        const menu = document.getElementById("Menu") as HTMLElement;

        setMenuVisible(!menuVisible);

        if (!menuVisible) {
            menu.classList.remove("hidden");
        } else {
            menu.classList.add("hidden");
        }
    };
    const toggleDarkmode = () => {
        const buttons = document.getElementById("Buttons") as HTMLElement;
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
            svg.classList.add("darkmode");
            leftScroll.classList.add("darkmode");
            rightScroll.classList.add("darkmode");
            menu.classList.add("darkmode");
            loader.classList.add("darkmode");
        } else {
            buttons.classList.remove("darkmode");
            svg.classList.remove("darkmode");
            leftScroll.classList.remove("darkmode");
            rightScroll.classList.remove("darkmode");
            menu.classList.remove("darkmode");
            loader.classList.remove("darkmode");
        }
    };

    return (
        <>
            <div id="Buttons">
                <div className="LeftButtons">
                    <Button
                        id="Settings"
                        title="Open settings"
                        onClick={toggleVisible}
                        icon={icon}
                    />
                    <Button
                        id="Darkmode"
                        title="Dark mode"
                        onClick={toggleDarkmode}
                        icon={darkModeIcon}
                    />
                </div>

                <Button
                    id="GitHub"
                    title="Open GitHub project"
                    onClick={handleGitHubClick}
                    icon="</>"
                />
            </div>

            <Menu
                seed={seed}
                setSeed={setSeed}
                step={step}
                setStep={setStep}
                reloadWindowSeed={reloadWindowSeed}
                horizontalScroll={horizontalScroll}
                toggleAutoScroll={toggleAutoScroll}
                newPosition={newPosition}
                renderer={renderer}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                saveRange={saveRange}
                onChangeSaveRange={onChangeSaveRange}
                toggleAutoLoad={toggleAutoLoad}
            />
        </>
    );
};
