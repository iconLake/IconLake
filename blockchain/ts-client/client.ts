/// <reference path="./types.d.ts" />
import {
  GeneratedType,
  OfflineSigner,
  EncodeObject,
  Registry,
} from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/launchpad";
import { AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import { Env } from "./env";
import { UnionToIntersection, Return, Constructor } from "./helpers";
import { Module } from "./modules";
import { EventEmitter } from "events";
import { ChainInfo } from "@keplr-wallet/types";
import { createIconlakeAminoConverters } from "./amino";

const defaultFee = {
  amount: [],
  gas: "200000",
};

export class IgniteClient extends EventEmitter {
	static plugins: Module[] = [];
  env: Env;
  signer?: OfflineSigner;
  registry: Array<[string, GeneratedType]> = [];
  aminoTypes: AminoTypes;
  static plugin<T extends Module | Module[]>(plugin: T) {
    const currentPlugins = this.plugins;

    class AugmentedClient extends this {
      static plugins = currentPlugins.concat(plugin);
    }

    if (Array.isArray(plugin)) {
      type Extension = UnionToIntersection<Return<T>['module']>
      return AugmentedClient as typeof IgniteClient & Constructor<Extension>;  
    }

    type Extension = Return<T>['module']
    return AugmentedClient as typeof IgniteClient & Constructor<Extension>;
  }

  async signAndBroadcast(msgs: EncodeObject[], fee: StdFee, memo: string) {
    if (this.signer) {
      const { address } = (await this.signer.getAccounts())[0];
      const signingClient = await SigningStargateClient.connectWithSigner(this.env.rpcURL, this.signer, { registry: new Registry(this.registry), prefix: this.env.prefix, aminoTypes: this.aminoTypes });
      return await signingClient.signAndBroadcast(address, msgs, fee ? fee : defaultFee, memo)
    } else {
      throw new Error(" Signer is not present.");
    }
  }

  constructor(env: Env, signer?: OfflineSigner) {
    super();
    this.env = env;
    this.setMaxListeners(0);
    this.signer = signer;
    const classConstructor = this.constructor as typeof IgniteClient;
    classConstructor.plugins.forEach(plugin => {
      const pluginInstance = plugin(this);
      Object.assign(this, pluginInstance.module)
      if (this.registry) {
        this.registry = this.registry.concat(pluginInstance.registry)
      }
		});
    this.aminoTypes = new AminoTypes(createIconlakeAminoConverters());
  }
  useSigner(signer: OfflineSigner) {    
      this.signer = signer;
      this.emit("signer-changed", this.signer);
  }
  removeSigner() {    
      this.signer = undefined;
      this.emit("signer-changed", this.signer);
  }
  async useKeplr(keplrChainInfo: Partial<ChainInfo> = {}) {
    const chainId = "iconlake-1";
    const chainName = "iconLake";
    const addrPrefix = this.env.prefix ?? "iconlake";
    const rpc = this.env.rpcURL;
    const rest = this.env.apiURL;

    let bip44 = {
      coinType: 1009,
    };

    let bech32Config = {
      bech32PrefixAccAddr: addrPrefix,
      bech32PrefixAccPub: addrPrefix + "pub",
      bech32PrefixValAddr: addrPrefix + "valoper",
      bech32PrefixValPub: addrPrefix + "valoperpub",
      bech32PrefixConsAddr: addrPrefix + "valcons",
      bech32PrefixConsPub: addrPrefix + "valconspub",
    };

    let currencies = [{
      coinDenom: "LAKE",
      coinMinimalDenom: "ulake",
      coinDecimals: 6,
    }, {
      coinDenom: "DROP",
      coinMinimalDenom: "udrop",
      coinDecimals: 4,
    }];

    
    let stakeCurrency = {
            coinDenom: "LAKE",
            coinMinimalDenom: "ulake",
            coinDecimals: 6,
          };
    
    let feeCurrencies = currencies;

    let coinType = 1009;

    if (chainId) {
      const suggestOptions: ChainInfo = {
        chainId,
        chainName,
        rpc,
        rest,
        stakeCurrency,
        bip44,
        bech32Config,
        currencies,
        feeCurrencies,
        coinType,
        ...keplrChainInfo,
      };
      await window.keplr.experimentalSuggestChain(suggestOptions);

      window.keplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,
          preferNoSetMemo: true,
        },
      };
    }
    await window.keplr.enable(chainId);
    this.signer = window.keplr.getOfflineSigner(chainId);
    this.emit("signer-changed", this.signer);
  }
}