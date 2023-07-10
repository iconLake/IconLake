/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "iconlake.icon";

export interface IconData {
  author: string;
  name: string;
  description: string;
  createTime: string;
}

function createBaseIconData(): IconData {
  return { author: "", name: "", description: "", createTime: "" };
}

export const IconData = {
  encode(message: IconData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.author !== "") {
      writer.uint32(10).string(message.author);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.createTime !== "") {
      writer.uint32(34).string(message.createTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IconData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIconData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.author = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.createTime = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IconData {
    return {
      author: isSet(object.author) ? String(object.author) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      createTime: isSet(object.createTime) ? String(object.createTime) : "",
    };
  },

  toJSON(message: IconData): unknown {
    const obj: any = {};
    message.author !== undefined && (obj.author = message.author);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.createTime !== undefined && (obj.createTime = message.createTime);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IconData>, I>>(object: I): IconData {
    const message = createBaseIconData();
    message.author = object.author ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
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
