/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Media } from "./media";

export const protobufPackage = "iconlake.icon";

export interface CreatorRaw {
  address: Uint8Array;
  name: string;
  description: string;
  avatar: string;
  avatarHash: string;
  medias: Media[];
  sex: string;
  birthday: string;
  location: string;
}

export interface Creator {
  address: string;
  name: string;
  description: string;
  avatar: string;
  avatarHash: string;
  medias: Media[];
  sex: string;
  birthday: string;
  location: string;
}

function createBaseCreatorRaw(): CreatorRaw {
  return {
    address: new Uint8Array(),
    name: "",
    description: "",
    avatar: "",
    avatarHash: "",
    medias: [],
    sex: "",
    birthday: "",
    location: "",
  };
}

export const CreatorRaw = {
  encode(message: CreatorRaw, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.avatar !== "") {
      writer.uint32(34).string(message.avatar);
    }
    if (message.avatarHash !== "") {
      writer.uint32(42).string(message.avatarHash);
    }
    for (const v of message.medias) {
      Media.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.sex !== "") {
      writer.uint32(58).string(message.sex);
    }
    if (message.birthday !== "") {
      writer.uint32(66).string(message.birthday);
    }
    if (message.location !== "") {
      writer.uint32(74).string(message.location);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatorRaw {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatorRaw();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.bytes();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.avatar = reader.string();
          break;
        case 5:
          message.avatarHash = reader.string();
          break;
        case 6:
          message.medias.push(Media.decode(reader, reader.uint32()));
          break;
        case 7:
          message.sex = reader.string();
          break;
        case 8:
          message.birthday = reader.string();
          break;
        case 9:
          message.location = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatorRaw {
    return {
      address: isSet(object.address) ? bytesFromBase64(object.address) : new Uint8Array(),
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      avatar: isSet(object.avatar) ? String(object.avatar) : "",
      avatarHash: isSet(object.avatarHash) ? String(object.avatarHash) : "",
      medias: Array.isArray(object?.medias) ? object.medias.map((e: any) => Media.fromJSON(e)) : [],
      sex: isSet(object.sex) ? String(object.sex) : "",
      birthday: isSet(object.birthday) ? String(object.birthday) : "",
      location: isSet(object.location) ? String(object.location) : "",
    };
  },

  toJSON(message: CreatorRaw): unknown {
    const obj: any = {};
    message.address !== undefined
      && (obj.address = base64FromBytes(message.address !== undefined ? message.address : new Uint8Array()));
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.avatar !== undefined && (obj.avatar = message.avatar);
    message.avatarHash !== undefined && (obj.avatarHash = message.avatarHash);
    if (message.medias) {
      obj.medias = message.medias.map((e) => e ? Media.toJSON(e) : undefined);
    } else {
      obj.medias = [];
    }
    message.sex !== undefined && (obj.sex = message.sex);
    message.birthday !== undefined && (obj.birthday = message.birthday);
    message.location !== undefined && (obj.location = message.location);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreatorRaw>, I>>(object: I): CreatorRaw {
    const message = createBaseCreatorRaw();
    message.address = object.address ?? new Uint8Array();
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.avatar = object.avatar ?? "";
    message.avatarHash = object.avatarHash ?? "";
    message.medias = object.medias?.map((e) => Media.fromPartial(e)) || [];
    message.sex = object.sex ?? "";
    message.birthday = object.birthday ?? "";
    message.location = object.location ?? "";
    return message;
  },
};

function createBaseCreator(): Creator {
  return {
    address: "",
    name: "",
    description: "",
    avatar: "",
    avatarHash: "",
    medias: [],
    sex: "",
    birthday: "",
    location: "",
  };
}

export const Creator = {
  encode(message: Creator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.avatar !== "") {
      writer.uint32(34).string(message.avatar);
    }
    if (message.avatarHash !== "") {
      writer.uint32(42).string(message.avatarHash);
    }
    for (const v of message.medias) {
      Media.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.sex !== "") {
      writer.uint32(58).string(message.sex);
    }
    if (message.birthday !== "") {
      writer.uint32(66).string(message.birthday);
    }
    if (message.location !== "") {
      writer.uint32(74).string(message.location);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Creator {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.avatar = reader.string();
          break;
        case 5:
          message.avatarHash = reader.string();
          break;
        case 6:
          message.medias.push(Media.decode(reader, reader.uint32()));
          break;
        case 7:
          message.sex = reader.string();
          break;
        case 8:
          message.birthday = reader.string();
          break;
        case 9:
          message.location = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Creator {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      avatar: isSet(object.avatar) ? String(object.avatar) : "",
      avatarHash: isSet(object.avatarHash) ? String(object.avatarHash) : "",
      medias: Array.isArray(object?.medias) ? object.medias.map((e: any) => Media.fromJSON(e)) : [],
      sex: isSet(object.sex) ? String(object.sex) : "",
      birthday: isSet(object.birthday) ? String(object.birthday) : "",
      location: isSet(object.location) ? String(object.location) : "",
    };
  },

  toJSON(message: Creator): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.avatar !== undefined && (obj.avatar = message.avatar);
    message.avatarHash !== undefined && (obj.avatarHash = message.avatarHash);
    if (message.medias) {
      obj.medias = message.medias.map((e) => e ? Media.toJSON(e) : undefined);
    } else {
      obj.medias = [];
    }
    message.sex !== undefined && (obj.sex = message.sex);
    message.birthday !== undefined && (obj.birthday = message.birthday);
    message.location !== undefined && (obj.location = message.location);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Creator>, I>>(object: I): Creator {
    const message = createBaseCreator();
    message.address = object.address ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.avatar = object.avatar ?? "";
    message.avatarHash = object.avatarHash ?? "";
    message.medias = object.medias?.map((e) => Media.fromPartial(e)) || [];
    message.sex = object.sex ?? "";
    message.birthday = object.birthday ?? "";
    message.location = object.location ?? "";
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
