import React, { ReactElement } from "react";
import { IChunkGroup } from "../interfaces/IChunkGroup";

export default function ChunkGroup({
    chunkId,
    layer,
}: IChunkGroup): ReactElement {
    return (
        <g id={`chunk${chunkId}`}>
            {layer.map((element, index) => (
                <g
                    id={`chunk${chunkId}-element${index}-${element.tag}`}
                    key={`chunk${chunkId}-element${index}-${element.tag}`}
                    dangerouslySetInnerHTML={{
                        __html: element.render(),
                    }}
                ></g>
            ))}
        </g>
    );
}
