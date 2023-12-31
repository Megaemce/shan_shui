import React, { ReactElement } from "react";
import Chunk from "../classes/Chunk";

interface Props {
    key: number;
    chunkArray: Chunk[];
}

export default function ChunkGroup({
    key,
    chunkArray,
}: Props): ReactElement | null {
    return (
        <g id={String(key)}>
            {chunkArray.map((element) => (
                <g
                    id={`${element.tag}: ${element.x} ${element.y}`}
                    key={`${element.tag} ${element.x} ${element.y}`}
                    dangerouslySetInnerHTML={{
                        __html: element.render(),
                    }}
                ></g>
            ))}
        </g>
    );
}
