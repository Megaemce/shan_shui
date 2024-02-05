import React, { ReactElement } from "react";
import { IFrame } from "../interfaces/IFrame";

export default function Frame({ chunkId, frame }: IFrame): ReactElement {
    return (
        <g id={`frame${chunkId}`}>
            {frame.map((element, index) => (
                <g
                    id={`frame${chunkId}-element${index}-${element.tag}`}
                    key={`frame${chunkId}-element${index}-${element.tag}`}
                    dangerouslySetInnerHTML={{
                        __html: element.stringify(),
                    }}
                ></g>
            ))}
        </g>
    );
}
