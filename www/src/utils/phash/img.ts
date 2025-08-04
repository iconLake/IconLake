class CanvasUtil {
  async resizeImageAndGetData(image: HTMLImageElement, width: number, height: number) {
    let canvas = await this.resizeImage(image, width, height);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("cannot get context from canvas");
    }
    return ctx.getImageData(0, 0, width, height).data;
  }

  async resizeImage(image: HTMLImageElement, width: number, height: number) {
    let toCanvas = document.createElement("canvas");
    toCanvas.width = width;
    toCanvas.height = height;

    const toCtx = toCanvas.getContext("2d");
    if (!toCtx) {
      throw new Error("cannot get context from canvas");
    }
    toCtx.drawImage(image, 0, 0, width, height);

    return toCanvas;
  }
}

export const canvasUtil = new CanvasUtil();

class GrayScaleConverter {
  /**
   *
   * RGBA -> L (ITU-R 601-2 luma transform)
   *
   * @param imgData {Uint8ClampedArray}
   */
  convert(imgData: Uint8ClampedArray) {
    const arr = new Uint8ClampedArray(imgData.length / 4);
    let bg = 255;
    let a = 255;

    for (let i = 0; i < imgData.length; i += 4) {
      a = imgData[i + 3] / 255;
      bg = 255 * (1 - a);
      arr[i >> 2] = Math.round(
        ((imgData[i] * a + bg) * 299) / 1000 +
        ((imgData[i + 1] * a + bg) * 587) / 1000 +
        ((imgData[i + 2] * a + bg) * 114) / 1000
      );
    }

    return arr;
  }
}

export const grayScaleConverter = new GrayScaleConverter();
