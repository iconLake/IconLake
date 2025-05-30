/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Media } from "./media";

export const protobufPackage = "iconlake.icon";

export interface MsgMint {
  creator: string;
  classId: string;
  id: string;
  name: string;
  description: string;
  uri: string;
  uriHash: string;
  supply: string;
}

export interface MsgMintResponse {
}

export interface MsgUpdateClass {
  creator: string;
  id: string;
  name: string;
  symbol: string;
  description: string;
  uri: string;
  uriHash: string;
}

export interface MsgUpdateClassResponse {
}

export interface MsgBurn {
  creator: string;
  classId: string;
  id: string;
}

export interface MsgBurnResponse {
}

export interface MsgUpdateCreator {
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

export interface MsgUpdateCreatorResponse {
}

export interface MsgDeleteCreator {
  address: string;
}

export interface MsgDeleteCreatorResponse {
}

function createBaseMsgMint(): MsgMint {
  return { creator: "", classId: "", id: "", name: "", description: "", uri: "", uriHash: "", supply: "" };
}

export const MsgMint = {
  encode(message: MsgMint, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.classId !== "") {
      writer.uint32(18).string(message.classId);
    }
    if (message.id !== "") {
      writer.uint32(26).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.uri !== "") {
      writer.uint32(50).string(message.uri);
    }
    if (message.uriHash !== "") {
      writer.uint32(58).string(message.uriHash);
    }
    if (message.supply !== "") {
      writer.uint32(64).uint64(message.supply);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgMint {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgMint();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.classId = reader.string();
          break;
        case 3:
          message.id = reader.string();
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.description = reader.string();
          break;
        case 6:
          message.uri = reader.string();
          break;
        case 7:
          message.uriHash = reader.string();
          break;
        case 8:
          message.supply = reader.uint64().toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgMint {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      classId: isSet(object.classId) ? String(object.classId) : "",
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      uri: isSet(object.uri) ? String(object.uri) : "",
      uriHash: isSet(object.uriHash) ? String(object.uriHash) : "",
      supply: isSet(object.supply) ? String(object.supply) : "",
    };
  },

  toJSON(message: MsgMint): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.classId !== undefined && (obj.classId = message.classId);
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.uri !== undefined && (obj.uri = message.uri);
    message.uriHash !== undefined && (obj.uriHash = message.uriHash);
    message.supply !== undefined && (obj.supply = message.supply);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgMint>, I>>(object: I): MsgMint {
    const message = createBaseMsgMint();
    message.creator = object.creator ?? "";
    message.classId = object.classId ?? "";
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.uri = object.uri ?? "";
    message.uriHash = object.uriHash ?? "";
    message.supply = object.supply ?? "";
    return message;
  },
};

function createBaseMsgMintResponse(): MsgMintResponse {
  return {};
}

export const MsgMintResponse = {
  encode(_: MsgMintResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgMintResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgMintResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgMintResponse {
    return {};
  },

  toJSON(_: MsgMintResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgMintResponse>, I>>(_: I): MsgMintResponse {
    const message = createBaseMsgMintResponse();
    return message;
  },
};

function createBaseMsgUpdateClass(): MsgUpdateClass {
  return { creator: "", id: "", name: "", symbol: "", description: "", uri: "", uriHash: "" };
}

export const MsgUpdateClass = {
  encode(message: MsgUpdateClass, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.symbol !== "") {
      writer.uint32(34).string(message.symbol);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.uri !== "") {
      writer.uint32(50).string(message.uri);
    }
    if (message.uriHash !== "") {
      writer.uint32(58).string(message.uriHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateClass {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateClass();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.id = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.symbol = reader.string();
          break;
        case 5:
          message.description = reader.string();
          break;
        case 6:
          message.uri = reader.string();
          break;
        case 7:
          message.uriHash = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateClass {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      symbol: isSet(object.symbol) ? String(object.symbol) : "",
      description: isSet(object.description) ? String(object.description) : "",
      uri: isSet(object.uri) ? String(object.uri) : "",
      uriHash: isSet(object.uriHash) ? String(object.uriHash) : "",
    };
  },

  toJSON(message: MsgUpdateClass): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.description !== undefined && (obj.description = message.description);
    message.uri !== undefined && (obj.uri = message.uri);
    message.uriHash !== undefined && (obj.uriHash = message.uriHash);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpdateClass>, I>>(object: I): MsgUpdateClass {
    const message = createBaseMsgUpdateClass();
    message.creator = object.creator ?? "";
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.symbol = object.symbol ?? "";
    message.description = object.description ?? "";
    message.uri = object.uri ?? "";
    message.uriHash = object.uriHash ?? "";
    return message;
  },
};

function createBaseMsgUpdateClassResponse(): MsgUpdateClassResponse {
  return {};
}

export const MsgUpdateClassResponse = {
  encode(_: MsgUpdateClassResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateClassResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateClassResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateClassResponse {
    return {};
  },

  toJSON(_: MsgUpdateClassResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpdateClassResponse>, I>>(_: I): MsgUpdateClassResponse {
    const message = createBaseMsgUpdateClassResponse();
    return message;
  },
};

function createBaseMsgBurn(): MsgBurn {
  return { creator: "", classId: "", id: "" };
}

export const MsgBurn = {
  encode(message: MsgBurn, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.classId !== "") {
      writer.uint32(18).string(message.classId);
    }
    if (message.id !== "") {
      writer.uint32(26).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBurn {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBurn();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.classId = reader.string();
          break;
        case 3:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgBurn {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      classId: isSet(object.classId) ? String(object.classId) : "",
      id: isSet(object.id) ? String(object.id) : "",
    };
  },

  toJSON(message: MsgBurn): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.classId !== undefined && (obj.classId = message.classId);
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgBurn>, I>>(object: I): MsgBurn {
    const message = createBaseMsgBurn();
    message.creator = object.creator ?? "";
    message.classId = object.classId ?? "";
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseMsgBurnResponse(): MsgBurnResponse {
  return {};
}

export const MsgBurnResponse = {
  encode(_: MsgBurnResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBurnResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBurnResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgBurnResponse {
    return {};
  },

  toJSON(_: MsgBurnResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgBurnResponse>, I>>(_: I): MsgBurnResponse {
    const message = createBaseMsgBurnResponse();
    return message;
  },
};

function createBaseMsgUpdateCreator(): MsgUpdateCreator {
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

export const MsgUpdateCreator = {
  encode(message: MsgUpdateCreator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCreator {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateCreator();
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

  fromJSON(object: any): MsgUpdateCreator {
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

  toJSON(message: MsgUpdateCreator): unknown {
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

  fromPartial<I extends Exact<DeepPartial<MsgUpdateCreator>, I>>(object: I): MsgUpdateCreator {
    const message = createBaseMsgUpdateCreator();
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

function createBaseMsgUpdateCreatorResponse(): MsgUpdateCreatorResponse {
  return {};
}

export const MsgUpdateCreatorResponse = {
  encode(_: MsgUpdateCreatorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateCreatorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateCreatorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateCreatorResponse {
    return {};
  },

  toJSON(_: MsgUpdateCreatorResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpdateCreatorResponse>, I>>(_: I): MsgUpdateCreatorResponse {
    const message = createBaseMsgUpdateCreatorResponse();
    return message;
  },
};

function createBaseMsgDeleteCreator(): MsgDeleteCreator {
  return { address: "" };
}

export const MsgDeleteCreator = {
  encode(message: MsgDeleteCreator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteCreator {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteCreator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeleteCreator {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: MsgDeleteCreator): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeleteCreator>, I>>(object: I): MsgDeleteCreator {
    const message = createBaseMsgDeleteCreator();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseMsgDeleteCreatorResponse(): MsgDeleteCreatorResponse {
  return {};
}

export const MsgDeleteCreatorResponse = {
  encode(_: MsgDeleteCreatorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteCreatorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteCreatorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgDeleteCreatorResponse {
    return {};
  },

  toJSON(_: MsgDeleteCreatorResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeleteCreatorResponse>, I>>(_: I): MsgDeleteCreatorResponse {
    const message = createBaseMsgDeleteCreatorResponse();
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  Mint(request: MsgMint): Promise<MsgMintResponse>;
  UpdateClass(request: MsgUpdateClass): Promise<MsgUpdateClassResponse>;
  Burn(request: MsgBurn): Promise<MsgBurnResponse>;
  UpdateCreator(request: MsgUpdateCreator): Promise<MsgUpdateCreatorResponse>;
  DeleteCreator(request: MsgDeleteCreator): Promise<MsgDeleteCreatorResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Mint = this.Mint.bind(this);
    this.UpdateClass = this.UpdateClass.bind(this);
    this.Burn = this.Burn.bind(this);
    this.UpdateCreator = this.UpdateCreator.bind(this);
    this.DeleteCreator = this.DeleteCreator.bind(this);
  }
  Mint(request: MsgMint): Promise<MsgMintResponse> {
    const data = MsgMint.encode(request).finish();
    const promise = this.rpc.request("iconlake.icon.Msg", "Mint", data);
    return promise.then((data) => MsgMintResponse.decode(new _m0.Reader(data)));
  }

  UpdateClass(request: MsgUpdateClass): Promise<MsgUpdateClassResponse> {
    const data = MsgUpdateClass.encode(request).finish();
    const promise = this.rpc.request("iconlake.icon.Msg", "UpdateClass", data);
    return promise.then((data) => MsgUpdateClassResponse.decode(new _m0.Reader(data)));
  }

  Burn(request: MsgBurn): Promise<MsgBurnResponse> {
    const data = MsgBurn.encode(request).finish();
    const promise = this.rpc.request("iconlake.icon.Msg", "Burn", data);
    return promise.then((data) => MsgBurnResponse.decode(new _m0.Reader(data)));
  }

  UpdateCreator(request: MsgUpdateCreator): Promise<MsgUpdateCreatorResponse> {
    const data = MsgUpdateCreator.encode(request).finish();
    const promise = this.rpc.request("iconlake.icon.Msg", "UpdateCreator", data);
    return promise.then((data) => MsgUpdateCreatorResponse.decode(new _m0.Reader(data)));
  }

  DeleteCreator(request: MsgDeleteCreator): Promise<MsgDeleteCreatorResponse> {
    const data = MsgDeleteCreator.encode(request).finish();
    const promise = this.rpc.request("iconlake.icon.Msg", "DeleteCreator", data);
    return promise.then((data) => MsgDeleteCreatorResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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

export function createIconAminoConverters() {
  return {
    '/iconlake.icon.MsgMint': {
      aminoType: 'icon/Mint',
  
      fromAmino(object: any): MsgMint {
        return MsgMint.fromPartial({
          creator: object.creator,
          classId: object.class_id,
          id: object.id,
          name: object.name,
          description: object.description,
          uri: object.uri,
          uriHash: object.uri_hash,
          supply: object.supply,
        });
      },
  
      toAmino(message: MsgMint): unknown {
        const obj: any = {};
        message.classId !== undefined && (obj.class_id = message.classId);
        message.creator !== undefined && (obj.creator = message.creator);
        message.description !== undefined && (obj.description = message.description);
        message.id !== undefined && (obj.id = message.id);
        message.name !== undefined && (obj.name = message.name);
        message.supply !== undefined && (obj.supply = message.supply);
        message.uri !== undefined && (obj.uri = message.uri);
        message.uriHash !== undefined && (obj.uri_hash = message.uriHash);
        return obj;
      },
    },
    '/iconlake.icon.MsgBurn': {
      aminoType: 'icon/Burn',
  
      fromAmino(object: any): MsgBurn {
        return MsgBurn.fromPartial({
          creator: object.creator,
          classId: object.class_id,
          id: object.id,
        });
      },
  
      toAmino(message: MsgBurn): unknown {
        const obj: any = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.classId !== undefined && (obj.class_id = message.classId);
        message.id !== undefined && (obj.id = message.id);
        return obj;
      },
    },
    '/iconlake.icon.MsgUpdateClass': {
      aminoType: 'icon/UpdateClass',
  
      fromAmino(object: any): MsgUpdateClass {
        return MsgUpdateClass.fromPartial({
          creator: object.creator,
          id: object.id,
          name: object.name,
          description: object.description,
          uri: object.uri,
          uriHash: object.uri_hash,
        });
      },
  
      toAmino(message: MsgUpdateClass): unknown {
        const obj: any = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.id !== undefined && (obj.id = message.id);
        message.name !== undefined && (obj.name = message.name);
        message.description !== undefined && (obj.description = message.description);
        message.uri !== undefined && (obj.uri = message.uri);
        message.uriHash !== undefined && (obj.uri_hash = message.uriHash);
        return obj;
      },
    },
    '/iconlake.icon.MsgUpdateCreator': {
      aminoType: 'icon/UpdateCreator',
  
      fromAmino(object: any): MsgUpdateCreator {
        return MsgUpdateCreator.fromPartial({
          address: object.address,
          name: object.name,
          description: object.description,
          avatar: object.avatar,
          avatarHash: object.avatar_hash,
          medias: object.medias,
          sex: object.sex,
          birthday: object.birthday,
          location: object.location,
        });
      },
  
      toAmino(message: MsgUpdateCreator): unknown {
        const obj: any = {};
        message.address !== undefined && (obj.address = message.address);
        message.name !== undefined && (obj.name = message.name);
        message.description !== undefined && (obj.description = message.description);
        message.avatar !== undefined && (obj.avatar = message.avatar);
        message.avatarHash !== undefined && (obj.avatar_hash = message.avatarHash);
        if (message.medias !== undefined) {
          obj.medias = message.medias.map((e) => ({
            name: e.name,
            content: e.content,
          }));
        }
        message.sex !== undefined && (obj.sex = message.sex);
        message.birthday !== undefined && (obj.birthday = message.birthday);
        message.location !== undefined && (obj.location = message.location);
        return obj;
      },
    },
    '/iconlake.icon.MsgDeleteCreator': {
      aminoType: 'icon/DeleteCreator',
  
      fromAmino(object: any): MsgDeleteCreator {
        return MsgDeleteCreator.fromPartial({
          address: object.address,
        });
      },
  
      toAmino(message: MsgDeleteCreator): unknown {
        const obj: any = {};
        message.address !== undefined && (obj.address = message.address);
        return obj;
      },
    },
  }
}
