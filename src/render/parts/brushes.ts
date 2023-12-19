import { Noise } from '../basic/perlinNoise';
import { Point, Vector } from '../basic/point';
import { PRNG } from '../basic/PRNG';
import { loopNoise, poly } from '../basic/utils';
import { SvgPolyline } from '../svg';

/**
 * Generates a stylized stroke using Perlin noise.
 * @param prng - PRNG instance for random number generation.
 * @param ptlist - List of points defining the stroke.
 * @param fill - Fill color for the stroke.
 * @param stroke - Stroke color.
 * @param strokeWidth - Width of the stroke.
 * @param noi - Amount of noise applied to the stroke.
 * @param out - Outer color for the stroke.
 * @param fun - Function to modulate stroke width (default is sin function).
 * @returns SvgPolyline representing the stylized stroke.
 */
export function stroke(
  prng: PRNG,
  ptlist: Point[],
  fill: string = 'rgba(200,200,200,0.9)',
  stroke: string = 'rgba(200,200,200,0.9)',
  strokeWidth: number = 2,
  noi: number = 0.5,
  out: number = 1,
  fun: (x: number) => number = (x: number) => Math.sin(x * Math.PI)
): SvgPolyline {
  console.assert(ptlist.length > 0);

  const vtxlist0 = [];
  const vtxlist1 = [];
  let vtxlist = [];
  const n0 = prng.random(0, 10);

  for (let i = 1; i < ptlist.length - 1; i++) {
    let w = strokeWidth * fun(i / ptlist.length);
    w = w * (1 - noi) + w * noi * Noise.noise(prng, i * 0.5, n0);

    const a1 = Math.atan2(
      ptlist[i].y - ptlist[i - 1].y,
      ptlist[i].x - ptlist[i - 1].x
    );
    const a2 = Math.atan2(
      ptlist[i].y - ptlist[i + 1].y,
      ptlist[i].x - ptlist[i + 1].x
    );
    let a = (a1 + a2) / 2;

    if (a < a2) {
      a += Math.PI;
    }

    vtxlist0.push(
      new Point(ptlist[i].x + w * Math.cos(a), ptlist[i].y + w * Math.sin(a))
    );
    vtxlist1.push(
      new Point(ptlist[i].x - w * Math.cos(a), ptlist[i].y - w * Math.sin(a))
    );
  }

  vtxlist = [ptlist[0]]
    .concat(
      vtxlist0.concat(vtxlist1.concat([ptlist[ptlist.length - 1]]).reverse())
    )
    .concat([ptlist[0]]);

  return poly(vtxlist, 0, 0, fill, stroke, out);
}

/**
 * Generates a blob with a stylized outline.
 * @param prng - PRNG instance for random number generation.
 * @param x - X-coordinate of the blob.
 * @param y - Y-coordinate of the blob.
 * @param ang - Angle of the blob.
 * @param col - Fill color of the blob.
 * @param len - Length of the blob.
 * @param strokeWidth - Width of the blob's outline.
 * @param noi - Amount of noise applied to the blob's outline.
 * @param fun - Function to modulate the blob's outline width (default is sin function).
 * @returns SvgPolyline representing the blob.
 */
export function blob(
  prng: PRNG,
  x: number,
  y: number,
  ang: number = 0,
  col: string = 'rgba(200,200,200,0.9)',
  len: number = 20,
  strokeWidth: number = 5,
  noi: number = 0.5,
  fun: (x: number) => number = (x: number) =>
    x <= 1
      ? Math.pow(Math.sin(x * Math.PI), 0.5)
      : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5)
): SvgPolyline {
  const plist = blob_points(prng, x, y, ang, len, strokeWidth, noi, fun);
  return poly(plist, 0, 0, col, col);
}

/**
 * Generates a list of points for a blob with a stylized outline.
 * @param prng - PRNG instance for random number generation.
 * @param x - X-coordinate of the blob.
 * @param y - Y-coordinate of the blob.
 * @param ang - Angle of the blob.
 * @param len - Length of the blob.
 * @param strokeWidth - Width of the blob's outline.
 * @param noi - Amount of noise applied to the blob's outline.
 * @param fun - Function to modulate the blob's outline width (default is sin function).
 * @returns Array of points representing the blob.
 */
export function blob_points(
  prng: PRNG,
  x: number,
  y: number,
  ang: number = 0,
  len: number = 20,
  strokeWidth: number = 5,
  noi: number = 0.5,
  fun: (x: number) => number = (x: number) =>
    x <= 1
      ? Math.pow(Math.sin(x * Math.PI), 0.5)
      : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5)
): Point[] {
  const reso = 20.0;
  const lalist = [];

  for (let i = 0; i < reso + 1; i++) {
    const p = (i / reso) * 2;
    const xo = len / 2 - Math.abs(p - 1) * len;
    const yo = (fun(p) * strokeWidth) / 2;
    const a = Math.atan2(yo, xo);
    const l = Math.sqrt(xo * xo + yo * yo);
    lalist.push([l, a]);
  }

  let nslist = [];
  const n0 = prng.random(0, 10);

  for (let i = 0; i < reso + 1; i++) {
    nslist.push(Noise.noise(prng, i * 0.05, n0));
  }

  nslist = loopNoise(nslist);
  const plist = [];

  for (let i = 0; i < lalist.length; i++) {
    const ns = nslist[i] * noi + (1 - noi);
    const nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
    const ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
    plist.push(new Point(nx, ny));
  }

  return plist;
}

/**
 * Divides a polyline into a higher resolution.
 * @param plist - Array of points defining the original polyline.
 * @param reso - Resolution factor.
 * @returns Array of points representing the higher resolution polyline.
 */
export function div(plist: Point[], reso: number): Point[] {
  const tl = (plist.length - 1) * reso;
  const rlist = [];

  for (let i = 0; i < tl; i += 1) {
    const lastp = plist[Math.floor(i / reso)];
    const nextp = plist[Math.ceil(i / reso)];
    const p = (i % reso) / reso;
    const nx = lastp.x * (1 - p) + nextp.x * p;
    const ny = lastp.y * (1 - p) + nextp.y * p;

    rlist.push(new Point(nx, ny));
  }

  if (plist.length > 0) {
    rlist.push(plist[plist.length - 1]);
  }

  return rlist;
}

/**
 * Generates textured polylines based on a grid of points.
 * @param prng - PRNG instance for random number generation.
 * @param ptlist - 2D array of points representing the grid.
 * @param xof - X-offset for the texture.
 * @param yof - Y-offset for the texture.
 * @param tex - Number of textures to generate.
 * @param strokeWidth - Width of the polylines.
 * @param sha - Shade factor for additional shading.
 * @param col - Function to determine the color of each texture.
 * @param dis - Function to determine the displacement of each texture.
 * @param noi - Function to determine the noise of each texture.
 * @param len - Length factor for the textures.
 * @returns Array of textured polylines.
 */
export function texture(
  prng: PRNG,
  ptlist: Point[][],
  xof: number = 0,
  yof: number = 0,
  tex: number = 400,
  sha: number = 0,
  dis: () => number = () =>
    0.5 + (prng.random() > 0.5 ? -1 : 1) * prng.random(1 / 6, 0.5),
  noi: (x: number) => number = (x) => 30 / x,
  len: number = 0.2
): SvgPolyline[] {
  const offset = new Vector(xof, yof);
  const reso = [ptlist.length, ptlist[0].length];
  const texlist: Point[][] = [];

  for (let i = 0; i < tex; i++) {
    const mid = (dis() * reso[1]) | 0;
    const hlen = Math.floor(prng.random(0, reso[1] * len));

    let start = mid - hlen;
    let end = mid + hlen;
    start = Math.min(Math.max(start, 0), reso[1]);
    end = Math.min(Math.max(end, 0), reso[1]);

    const layer = (i / tex) * (reso[0] - 1);

    texlist.push([]);
    for (let j = start; j < end; j++) {
      const p = layer - Math.floor(layer);
      const x =
        ptlist[Math.floor(layer)][j].x * p +
        ptlist[Math.ceil(layer)][j].x * (1 - p);

      const y =
        ptlist[Math.floor(layer)][j].y * p +
        ptlist[Math.ceil(layer)][j].y * (1 - p);

      const nx = noi(layer + 1) * (Noise.noise(prng, x, j * 0.5) - 0.5);
      const ny = noi(layer + 1) * (Noise.noise(prng, y, j * 0.5) - 0.5);

      texlist[texlist.length - 1].push(new Point(x + nx, y + ny));
    }
  }

  const polylines: SvgPolyline[] = [];

  // SHADE
  if (sha) {
    const step = 1 + (sha !== 0 ? 1 : 0);
    for (let j = 0; j < texlist.length; j += step) {
      if (texlist[j].length > 0) {
        polylines.push(
          stroke(
            prng,
            texlist[j].map((p) => p.move(offset)),
            'rgba(100,100,100,0.1)',
            'rgba(100,100,100,0.1)',
            sha
          )
        );
      }
    }
  }
  return polylines;
}
