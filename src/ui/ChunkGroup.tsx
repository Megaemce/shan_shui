import React, { ReactElement } from "react";
import Chunk from "../classes/Chunk";

interface Props {
    chunkId: string;
    chunkArray: Chunk[];
}

export default function ChunkGroup({
    chunkId,
    chunkArray,
}: Props): ReactElement {
    return (
        <g id={chunkId}>
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
