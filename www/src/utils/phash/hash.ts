export class ImageHash {
  binArray: Uint8ClampedArray;

  constructor(binArray: Uint8ClampedArray) {
    this.binArray = binArray;
  }

  static fromBase64(s: string) {
    const buf = Uint8Array.from(atob(s), c => c.charCodeAt(0));
    return new ImageHash(new Uint8ClampedArray(buf.buffer));
  }

  static fromHexStringReversed(s: string) {
    if (s.length % 2 !== 0) {
      throw Error("hex string length must be a multiple of 2");
    }
    const arr = new Uint8ClampedArray((s.length / 2) * 8);

    for (let i = 0; i < s.length; i += 2) {
      const c = Number.parseInt(s.slice(i, i + 2), 16);

      if (Number.isNaN(c)) {
        throw Error("Invalid hex string");
      }

      arr[(i / 2) * 8] = (c & 0x80) >> 7;
      arr[(i / 2) * 8 + 1] = (c & 0x40) >> 6;
      arr[(i / 2) * 8 + 2] = (c & 0x20) >> 5;
      arr[(i / 2) * 8 + 3] = (c & 0x10) >> 4;
      arr[(i / 2) * 8 + 4] = (c & 0x08) >> 3;
      arr[(i / 2) * 8 + 5] = (c & 0x04) >> 2;
      arr[(i / 2) * 8 + 6] = (c & 0x02) >> 1;
      arr[(i / 2) * 8 + 7] = (c & 0x01);
    }

    return new ImageHash(arr);
  }

  static fromHexString(s: string) {
    if (s.length % 2 !== 0) {
      throw Error("hex string length must be a multiple of 2");
    }
    const arr = new Uint8ClampedArray((s.length / 2) * 8);

    for (let i = 0; i < s.length; i += 2) {
      const c = Number.parseInt(s.slice(i, i + 2), 16);

      if (Number.isNaN(c)) {
        throw Error("Invalid hex string");
      }

      arr[(i / 2) * 8] = (c & 0x01);
      arr[(i / 2) * 8 + 1] = (c & 0x02) >> 1;
      arr[(i / 2) * 8 + 2] = (c & 0x04) >> 2;
      arr[(i / 2) * 8 + 3] = (c & 0x08) >> 3;
      arr[(i / 2) * 8 + 4] = (c & 0x10) >> 4;
      arr[(i / 2) * 8 + 5] = (c & 0x20) >> 5;
      arr[(i / 2) * 8 + 6] = (c & 0x40) >> 6;
      arr[(i / 2) * 8 + 7] = (c & 0x80) >> 7;
    }

    return new ImageHash(arr);
  }

  toHexStringReversed() {
    let str = "";

    for (let i = 0; i < this.binArray.length; i += 8) {
      const c =
        (this.binArray[i] << 7) |
        (this.binArray[i + 1] << 6) |
        (this.binArray[i + 2] << 5) |
        (this.binArray[i + 3] << 4) |
        (this.binArray[i + 4] << 3) |
        (this.binArray[i + 5] << 2) |
        (this.binArray[i + 6] << 1) |
        this.binArray[i + 7];

      str += c.toString(16).padStart(2, "0");
    }

    return str;
  }

  toHexString() {
    let str = "";

    for (let i = 0; i < this.binArray.length; i += 8) {
      const c =
        this.binArray[i] |
        (this.binArray[i + 1] << 1) |
        (this.binArray[i + 2] << 2) |
        (this.binArray[i + 3] << 3) |
        (this.binArray[i + 4] << 4) |
        (this.binArray[i + 5] << 5) |
        (this.binArray[i + 6] << 6) |
        (this.binArray[i + 7] << 7);

      str += c.toString(16).padStart(2, "0");
    }

    return str;
  }

  toBase64() {
    const buf = new Uint8Array(this.binArray.length / 8);

    for (let i = 0; i < this.binArray.length; i += 8) {
      buf[i / 8] =
        this.binArray[i] |
        (this.binArray[i + 1] << 1) |
        (this.binArray[i + 2] << 2) |
        (this.binArray[i + 3] << 3) |
        (this.binArray[i + 4] << 4) |
        (this.binArray[i + 5] << 5) |
        (this.binArray[i + 6] << 6) |
        (this.binArray[i + 7] << 7);
    }

    return btoa(String.fromCharCode(...buf));
  }

  hammingDistance(hash: ImageHash) {
    if (hash.binArray.length !== this.binArray.length) {
      throw new Error("Cannot compare two ImageHash instances of different sizes");
    }

    let distance = 0;
    for (let i = 0; i < this.binArray.length; i++) {
      if (this.binArray[i] !== hash.binArray[i]) {
        distance += 1;
      }
    }

    return distance;
  }
}

export class ImageMultiHash {
  segmentHashes: ImageHash[];

  constructor(hashes: ImageHash[]) {
    this.segmentHashes = hashes;
  }

  toJSON() {
    return this.segmentHashes.map(h => h.toHexString());
  }

  static fromJSON(json: any[]) {
    return new ImageMultiHash(json.map(s => ImageHash.fromHexString(s)));
  }

  hashDiff(hash: ImageMultiHash, hammingCutoff: number) {
    let sum = 0;
    let num = 0;

    for (let i = 0; i < hash.segmentHashes.length; i++) {
      const distances = [];

      for (let j = 0; j < this.segmentHashes.length; j++) {
        distances.push(hash.segmentHashes[i].hammingDistance(this.segmentHashes[j]));
      }

      const minDistance = Math.min(...distances);
      if (minDistance <= hammingCutoff) {
        sum += minDistance;
        num += 1;
      }
    }

    return { num, sum };
  }
}
