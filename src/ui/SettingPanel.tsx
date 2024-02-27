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
    const icon: string = menuVisible ? "✕" : "☰";

    const handleGitHubClick = () => {
        window.location.href = "https://github.com/Megaemce/shan_shui";
    };

    const toggleVisible = () => setMenuVisible(!menuVisible);

    return (
        <div id="SETTING">
            <div id="BTN_ROW">
                <Button
                    id="Settings"
                    title="Open settings"
                    onClick={toggleVisible}
                    height={48}
                    icon={icon}
                />
                <Button
                    id="GitHub"
                    title="Open GitHub project"
                    onClick={handleGitHubClick}
                    height={48}
                    icon="</>"
                />
            </div>
            {menuVisible && (
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
            )}
        </div>
    );
};
