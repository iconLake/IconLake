class CanvasUtil {
  async resizeImageAndGetData(image: HTMLImageElement, width: number, height: number) {
    let canvas = await this.resizeImage(image, width, height);

    const ctx = canvas.getContext("2d");
    return ctx!.getImageData(0, 0, width, height).data;
  }

  async resizeImage(image: HTMLImageElement, width: number, height: number) {
    let toCanvas = document.createElement("canvas");
    toCanvas.width = width;
    toCanvas.height = height;

    const toCtx = toCanvas.getContext("2d");
    toCtx!.drawImage(image, 0, 0, width, height);

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

    for (let i = 0; i < imgData.length; i += 4) {
      arr[i >> 2] = Math.round(
        (imgData[i] * 299) / 1000 +
        (imgData[i + 1] * 587) / 1000 +
        (imgData[i + 2] * 114) / 1000
      );
    }

    return arr;
  }
}

export const grayScaleConverter = new GrayScaleConverter();
