import React, { useState } from "react";
import { PRNG } from "../render/basic/PRNG";
import { Range } from "../render/basic/range";
import { ChunkCache } from "../render/chunkCache";
import "./styles.css";

interface IBarProps {
    id: string;
    height: number;
    onClick: () => void;
    icon: string;
}

const ScrollBar: React.FC<IBarProps> = ({ id, height, onClick, icon }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            id={id}
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            onClick={onClick}
            style={{
                backgroundColor: `rgba(0, 0, 0, ${isHover ? 0.1 : 0})`,
                height,
            }}
        >
            <div id={`${id}.t`}>
                <span>{icon}</span>
            </div>
        </div>
    );
};

interface IProps {
    xscroll: (v: number) => void;
    windy: number;
    background: string | undefined;
    seed: string;
    cursx: number;
    windx: number;
    prng: PRNG;
    chunkCache: ChunkCache;
}

const ScrollableCanvas: React.FC<IProps> = ({
    xscroll,
    windy,
    background,
    seed,
    cursx,
    windx,
    prng,
    chunkCache,
}) => {
    const cwid = 512;
    const zoom = 1.142;

    const viewbox = `${cursx} 0 ${windx / zoom} ${windy / zoom}`;
    const nr = new Range(cursx, cursx + windx);
    chunkCache.update(prng, nr, cwid);

    const tableId = "SCROLLABLE_CANVAS"; // Unique id for the table

    return (
        <table id={tableId}>
            <tbody>
                <tr>
                    <td>
                        <ScrollBar
                            id="L"
                            onClick={() => xscroll(-200)}
                            height={windy - 8}
                            icon="&#x3008;"
                        />
                    </td>
                    <td>
                        <div
                            id="BG"
                            style={{
                                backgroundImage: `url(${background})`,
                                width: windx,
                                height: windy,
                                left: 0,
                                position: "fixed",
                                top: 0,
                            }}
                        >
                            <svg
                                id="SVG"
                                xmlns="http://www.w3.org/2000/svg"
                                width={windx}
                                height={windy}
                                style={{ mixBlendMode: "multiply" }}
                                viewBox={viewbox}
                            >
                                {chunkCache.chunks.map((c) => (
                                    <g
                                        key={`${c.tag} ${c.x} ${c.y}`}
                                        transform="translate(0, 0)"
                                        dangerouslySetInnerHTML={{
                                            __html: c.render(),
                                        }}
                                    ></g>
                                ))}
                            </svg>
                        </div>
                    </td>
                    <td>
                        <ScrollBar
                            id="R"
                            onClick={() => xscroll(200)}
                            height={windy - 8}
                            icon="&#x3009;"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default ScrollableCanvas;
