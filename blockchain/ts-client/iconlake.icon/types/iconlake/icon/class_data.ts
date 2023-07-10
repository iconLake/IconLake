/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "iconlake.icon";

export interface ClassData {
  author: string;
  createTime: string;
}

function createBaseClassData(): ClassData {
  return { author: "", createTime: "" };
}

export const ClassData = {
  encode(message: ClassData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.author !== "") {
      writer.uint32(10).string(message.author);
    }
    if (message.createTime !== "") {
      writer.uint32(18).string(message.createTime);
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
          message.createTime = reader.string();
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
      createTime: isSet(object.createTime) ? String(object.createTime) : "",
    };
  },

  toJSON(message: ClassData): unknown {
    const obj: any = {};
    message.author !== undefined && (obj.author = message.author);
    message.createTime !== undefined && (obj.createTime = message.createTime);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ClassData>, I>>(object: I): ClassData {
    const message = createBaseClassData();
    message.author = object.author ?? "";
    message.createTime = object.createTime ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
