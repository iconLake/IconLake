/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "iconlake.icon";

export interface ClassData {
  author: string;
  createTime: number;
}

export interface ClassDataRaw {
  author: Uint8Array;
  createTime: number;
}

function createBaseClassData(): ClassData {
  return { author: "", createTime: 0 };
}

export const ClassData = {
  encode(message: ClassData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.author !== "") {
      writer.uint32(10).string(message.author);
    }
    if (message.createTime !== 0) {
      writer.uint32(16).int64(message.createTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClassData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClassData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.author = reader.string();
          break;
        case 2:
          message.createTime = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClassData {
    return {
      author: isSet(object.author) ? String(object.author) : "",
      createTime: isSet(object.createTime) ? Number(object.createTime) : 0,
    };
  },

  toJSON(message: ClassData): unknown {
    const obj: any = {};
    message.author !== undefined && (obj.author = message.author);
    message.createTime !== undefined && (obj.createTime = Math.round(message.createTime));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ClassData>, I>>(object: I): ClassData {
    const message = createBaseClassData();
    message.author = object.author ?? "";
    message.createTime = object.createTime ?? 0;
    return message;
  },
};

function createBaseClassDataRaw(): ClassDataRaw {
  return { author: new Uint8Array(), createTime: 0 };
}

export const ClassDataRaw = {
  encode(message: ClassDataRaw, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.author.length !== 0) {
      writer.uint32(10).bytes(message.author);
    }
    if (message.createTime !== 0) {
      writer.uint32(16).int64(message.createTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClassDataRaw {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClassDataRaw();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.author = reader.bytes();
          break;
        case 2:
          message.createTime = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClassDataRaw {
    return {
      author: isSet(object.author) ? bytesFromBase64(object.author) : new Uint8Array(),
      createTime: isSet(object.createTime) ? Number(object.createTime) : 0,
    };
  },

  toJSON(message: ClassDataRaw): unknown {
    const obj: any = {};
    message.author !== undefined
      && (obj.author = base64FromBytes(message.author !== undefined ? message.author : new Uint8Array()));
    message.createTime !== undefined && (obj.createTime = Math.round(message.createTime));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ClassDataRaw>, I>>(object: I): ClassDataRaw {
    const message = createBaseClassDataRaw();
    message.author = object.author ?? new Uint8Array();
    message.createTime = object.createTime ?? 0;
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
