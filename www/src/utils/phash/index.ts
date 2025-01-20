import {canvasUtil, grayScaleConverter} from "./img";
import {ImageHash} from "./hash";

const cosCache: {
  [L: number]: number[][]
} = {};

function precomputeCos(L: number) {
    if (L in cosCache) {
        return cosCache[L];
    }

    const piOver2L = Math.PI / (2 * L);
    const cos = new Array(L).fill(0).map(() => new Array(L));

    for (let u = 0; u < L; u++) {
        const uTimesPiOver2L = u * piOver2L;
        for (let x = 0; x < L; x++) {
            cos[u][x] = Math.cos((2 * x + 1) * uTimesPiOver2L);
        }
    }

    cosCache[L] = cos;
    return cos;
}

function dctTransform(matrix: Uint8ClampedArray) {
    const L = Math.round(Math.sqrt(matrix.length));
    const cos = precomputeCos(L);
    const dct = new Array(L * L);

    let _u, _v, sum;

    for (let u = 0; u < L; u++) {
        for (let v = 0; v < L; v++) {
            sum = 0;
            _u = u;
            _v = v;

            for (let x = 0; x < L; x++) {
                for (let y = 0; y < L; y++) {
                    sum += matrix[x * L + y] * cos[_u][x] * cos[_v][y];
                }
            }

            // 添加DCT系数
            const cu = u === 0 ? 1 / Math.sqrt(2) : 1;
            const cv = v === 0 ? 1 / Math.sqrt(2) : 1;
            dct[u * L + v] = sum * cu * cv / L;
        }
    }

    return dct;
}

function median(values: Float64Array) {
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
}

export async function phash(image: HTMLImageElement, size = 8, highFrequencyFactor = 4) {
    const imageSize = size * highFrequencyFactor;

    const pixels = grayScaleConverter.convert(await canvasUtil.resizeImageAndGetData(image, imageSize, imageSize));

    const dctOut = dctTransform(pixels);

    const dctLowFreq = new Float64Array(size * size);
    const sorted = new Float64Array(size * size);

    let lowFreqIndex = 0;
    let dctIndex = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            dctLowFreq[lowFreqIndex] = dctOut[dctIndex];
            sorted[lowFreqIndex] = dctOut[dctIndex];
            lowFreqIndex += 1;
            dctIndex += 1;
        }
        dctIndex += imageSize - size;
    }

    const med = median(sorted);

    const hash = new Uint8ClampedArray(size * size);

    for (let i = 0; i < hash.length; ++i) {
        hash[i] = dctLowFreq[i] > med ? 1 : 0;
    }

    return new ImageHash(hash);
}
