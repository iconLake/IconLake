export class ImageHash {
  binArray: Uint8ClampedArray;

  constructor(binArray: Uint8ClampedArray) {
    this.binArray = binArray;
  }

  static fromHexString(s: string) {
    if (s.length % 2 !== 0) {
      throw Error("hex string length must be a multiple of 2");
    }
    const arr = new Uint8ClampedArray(s.length / 2 * 8);
    let binaryStr = '';
    for (let i = 0; i < s.length; i++) {
      const hexChar = s[i];
      const binaryChunk = parseInt(hexChar, 16).toString(2).padStart(4, '0');
      binaryStr += binaryChunk;
    }

    for (let i = 0; i < binaryStr.length; i++) {
      arr[i] = parseInt(binaryStr[i]);
    }

    return new ImageHash(arr);
  }

  toHexString() {
    const binaryStr = this.binArray.join('');
    let hexStr = '';
    for (let i = 0; i < binaryStr.length; i += 4) {
      const binaryChunk = binaryStr.substring(i, i + 4);
      const hexChunk = parseInt(binaryChunk, 2).toString(16);
      hexStr += hexChunk;
    }
    return hexStr;
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
