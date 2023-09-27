/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "iconlake.drop";

export interface Info {
  address: string;
  lastMintTime: number;
}

export interface InfoRaw {
  accAddress: Uint8Array;
  lastMintTime: number;
}

function createBaseInfo(): Info {
  return { address: "", lastMintTime: 0 };
}

export const Info = {
  encode(message: Info, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.lastMintTime !== 0) {
      writer.uint32(16).int64(message.lastMintTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Info {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.lastMintTime = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Info {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      lastMintTime: isSet(object.lastMintTime) ? Number(object.lastMintTime) : 0,
    };
  },

  toJSON(message: Info): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.lastMintTime !== undefined && (obj.lastMintTime = Math.round(message.lastMintTime));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Info>, I>>(object: I): Info {
    const message = createBaseInfo();
    message.address = object.address ?? "";
    message.lastMintTime = object.lastMintTime ?? 0;
    return message;
  },
};

function createBaseInfoRaw(): InfoRaw {
  return { accAddress: new Uint8Array(), lastMintTime: 0 };
}

export const InfoRaw = {
  encode(message: InfoRaw, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accAddress.length !== 0) {
      writer.uint32(10).bytes(message.accAddress);
    }
    if (message.lastMintTime !== 0) {
      writer.uint32(16).int64(message.lastMintTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InfoRaw {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInfoRaw();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accAddress = reader.bytes();
          break;
        case 2:
          message.lastMintTime = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InfoRaw {
    return {
      accAddress: isSet(object.accAddress) ? bytesFromBase64(object.accAddress) : new Uint8Array(),
      lastMintTime: isSet(object.lastMintTime) ? Number(object.lastMintTime) : 0,
    };
  },

  toJSON(message: InfoRaw): unknown {
    const obj: any = {};
    message.accAddress !== undefined
      && (obj.accAddress = base64FromBytes(message.accAddress !== undefined ? message.accAddress : new Uint8Array()));
    message.lastMintTime !== undefined && (obj.lastMintTime = Math.round(message.lastMintTime));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InfoRaw>, I>>(object: I): InfoRaw {
    const message = createBaseInfoRaw();
    message.accAddress = object.accAddress ?? new Uint8Array();
    message.lastMintTime = object.lastMintTime ?? 0;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
