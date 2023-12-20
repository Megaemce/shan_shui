import React from "react";
import { useState } from "react";
import { PRNG } from "../render/basic/PRNG";
import { Range } from "../render/basic/range";
import { ChunkCache } from "../render/chunkCache";
import ButtonSet from "./ButtonSet";
import ButtonSource from "./ButtonSource";
import Menu from "./Menu";
import "./styles.css";

interface SettingPanelProps {
    seed: string;
    changeSeed: (seed: string) => void;
    reloadWSeed: () => void;
    horizontalScroll: (value: number) => void;
    toggleAutoScroll: (status: boolean, value: number) => void;
    cursx: number;
    chunkCache: ChunkCache;
    windx: number;
    windy: number;
    prng: PRNG;
    saveRange: Range;
    onChangeSaveRange: (r: Range) => void;
    toggleAutoLoad: (status: boolean) => void;
}

const SettingPanel: React.FC<SettingPanelProps> = ({
    seed,
    changeSeed,
    reloadWSeed,
    horizontalScroll,
    toggleAutoScroll,
    cursx,
    chunkCache,
    windx,
    windy,
    prng,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleVisible = () => setMenuVisible(!menuVisible);

    const left = 40;

    return (
        <div id="SETTING" style={{ left }}>
            <div id="BTN_ROW">
                <ButtonSet
                    onClick={toggleVisible}
                    menu_visible={menuVisible}
                    left={left}
                />
                <ButtonSource />
            </div>
            <div style={{ height: 4 }} />
            {menuVisible && (
                <Menu
                    display="block"
                    seed={seed}
                    changeSeed={changeSeed}
                    reloadWSeed={reloadWSeed}
                    horizontalScroll={horizontalScroll}
                    toggleAutoScroll={toggleAutoScroll}
                    cursx={cursx}
                    chunkCache={chunkCache}
                    windx={windx}
                    windy={windy}
                    prng={prng}
                    saveRange={saveRange}
                    onChangeSaveRange={onChangeSaveRange}
                    toggleAutoLoad={toggleAutoLoad}
                />
            )}
        </div>
    );
};

export default SettingPanel;
