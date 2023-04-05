/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "iconlake.iconlake";

export interface Account {
  accAddress: string;
  lastMintDropTime: string;
}

function createBaseAccount(): Account {
  return { accAddress: "", lastMintDropTime: "" };
}

export const Account = {
  encode(message: Account, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accAddress !== "") {
      writer.uint32(10).string(message.accAddress);
    }
    if (message.lastMintDropTime !== "") {
      writer.uint32(18).string(message.lastMintDropTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Account {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accAddress = reader.string();
          break;
        case 2:
          message.lastMintDropTime = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Account {
    return {
      accAddress: isSet(object.accAddress) ? String(object.accAddress) : "",
      lastMintDropTime: isSet(object.lastMintDropTime) ? String(object.lastMintDropTime) : "",
    };
  },

  toJSON(message: Account): unknown {
    const obj: any = {};
    message.accAddress !== undefined && (obj.accAddress = message.accAddress);
    message.lastMintDropTime !== undefined && (obj.lastMintDropTime = message.lastMintDropTime);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Account>, I>>(object: I): Account {
    const message = createBaseAccount();
    message.accAddress = object.accAddress ?? "";
    message.lastMintDropTime = object.lastMintDropTime ?? "";
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
