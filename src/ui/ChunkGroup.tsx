import React, { ReactElement } from "react";
import { IChunkGroup } from "../interfaces/IChunkGroup";

export default function ChunkGroup({
    chunkId,
    chunkArray,
}: IChunkGroup): ReactElement {
    return (
        <g id={chunkId}>
            {chunkArray.map((chunk) => (
                <g
                    id={`${chunk.tag}: ${chunk.x} ${chunk.y}`}
                    key={`${chunk.tag} ${chunk.x} ${chunk.y}`}
                    dangerouslySetInnerHTML={{
                        __html: chunk.render(),
                    }}
                ></g>
            ))}
        </g>
    );
}
