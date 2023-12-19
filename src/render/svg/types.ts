import { ISvgAttributes, ISvgElement, ISvgStyles } from "./interfaces";
import { IPoint } from "../basic/point";

/**
 * Converts a camelCase string to kebab-case.
 * @param key - The input camelCase string.
 * @returns The converted kebab-case string.
 */
function SvgAttributeKey(key: string): string {
    var result = key.replace(/([A-Z])/g, " $1");
    return result.split(" ").join("-").toLowerCase();
}

/**
 * Converts a style attribute object to a string.
 * @param attr - The style attribute object.
 * @returns The string representation of the style attributes.
 */
function SvgStyleRender(attr: Partial<ISvgStyles>): string {
    const strlist = Object.entries(attr).map(
        ([k, v]) => `${SvgAttributeKey(k)}:${v}`
    );
    return `${strlist.join(";")}`;
}

/**
 * Converts an attribute object to a string.
 * @param attr - The attribute object.
 * @returns The string representation of the attributes.
 */
function SvgAttributeRender(attr: Partial<ISvgAttributes>): string {
    const strlist = Object.entries(attr).map(([k, v]) => {
        const vstr =
            k === "style" && attr.style ? SvgStyleRender(attr.style) : v;
        return `${SvgAttributeKey(k)}='${vstr}'`;
    });
    return strlist.join(" ");
}

/**
 * Represents a point in SVG coordinates.
 */
export class SvgPoint implements ISvgElement, IPoint {
    /**
     * Initializes a new instance of the SvgPoint class.
     * @param _x - The x-coordinate of the point.
     * @param _y - The y-coordinate of the point.
     */
    constructor(private _x: number, private _y: number) {
        this.x = _x;
        this.y = _y;
    }

    /** The x-coordinate of the point. */
    x: number;
    /** The y-coordinate of the point. */
    y: number;

    /** Attribute object for additional SVG attributes. */
    attr = {};

    /**
     * Creates an SvgPoint instance from an IPoint object.
     * @param p - The IPoint object.
     * @returns A new SvgPoint instance.
     */
    static from(p: IPoint): SvgPoint {
        return new SvgPoint(p.x, p.y);
    }

    /**
     * Renders the point as a string.
     * @returns The string representation of the point.
     */
    render(): string {
        return `${this.x.toFixed(1)},${this.y.toFixed(1)}`;
    }
}

/**
 * Represents a polyline in SVG.
 */
export class SvgPolyline implements ISvgElement {
    /** Attribute object for additional SVG attributes. */
    attr: Partial<ISvgAttributes> = {};
    /** Array of points defining the polyline. */
    points: SvgPoint[] = [];

    /**
     * Initializes a new instance of the SvgPolyline class.
     * @param points - Array of SvgPoint objects defining the polyline.
     * @param style - Style attributes for the polyline.
     */
    constructor(points: SvgPoint[], style: Partial<ISvgStyles>) {
        this.points = points;
        this.attr = { style };
    }

    /**
     * Renders the polyline as a string.
     * @returns The string representation of the polyline.
     */
    render(): string {
        const attrstr = SvgAttributeRender(this.attr);
        return `<polyline points='${this.points
            .map((p) => p.render())
            .join(" ")}' ${attrstr}/>`;
    }

    /**
     * Converts the SvgPolyline instance to a string.
     * @returns The string representation of the SvgPolyline.
     */
    toString(): string {
        console.error("call Polyline.toString");
        return this.render();
    }
}

/**
 * Represents a text element in SVG.
 */
export class SvgText implements ISvgElement {
    /** Attribute object for additional SVG attributes. */
    attr: Partial<ISvgAttributes> = {};
    /** The content of the text element. */
    content: string = "";

    /**
     * Initializes a new instance of the SvgText class.
     * @param content - The content of the text element.
     * @param attr - Attribute object for additional SVG attributes.
     */
    constructor(content: string, attr: Partial<ISvgAttributes>) {
        this.content = content;
        this.attr = attr;
    }

    /**
     * Renders the text element as a string.
     * @returns The string representation of the text element.
     */
    render() {
        const attrstr = SvgAttributeRender(this.attr);
        return `<text ${attrstr}>${this.content}</text>`;
    }
}
