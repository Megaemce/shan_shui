import React, { ReactElement } from "react";
import { IFrame } from "../interfaces/IFrame";

export default function Frame({ frameId, frame }: IFrame): ReactElement {
    return (
        <g id={`frame${frameId}`}>
            {frame.map((layer, index) => (
                <g
                    id={`frame${frameId}-layer${index}-${layer.tag}`}
                    key={`frame${frameId}-layer${index}-${layer.tag}`}
                    dangerouslySetInnerHTML={{
                        __html: layer.stringify(),
                    }}
                ></g>
            ))}
        </g>
    );
}
