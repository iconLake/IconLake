// Generated by Ignite ignite.com/cli

import { StdFee } from "@cosmjs/launchpad";
import { SigningStargateClient, DeliverTxResponse, AminoTypes } from "@cosmjs/stargate";
import { EncodeObject, GeneratedType, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import { msgTypes } from './registry';
import { IgniteClient } from "../client"
import { Api } from "./rest";
import { createIconAminoConverters, MsgUpdateClass } from "./types/iconlake/icon/tx";
import { MsgUpdateCreator } from "./types/iconlake/icon/tx";
import { MsgDeleteCreator } from "./types/iconlake/icon/tx";
import { MsgBurn } from "./types/iconlake/icon/tx";
import { MsgMint } from "./types/iconlake/icon/tx";

import { ClassData as typeClassData} from "./types"
import { ClassDataRaw as typeClassDataRaw} from "./types"
import { CreatorRaw as typeCreatorRaw} from "./types"
import { Creator as typeCreator} from "./types"
import { IconData as typeIconData} from "./types"
import { IconDataRaw as typeIconDataRaw} from "./types"
import { Media as typeMedia} from "./types"
import { Params as typeParams} from "./types"
import { NFT as typeNFT} from "./types"
import { QueryNFTsResponse as typeQueryNFTsResponse} from "./types"
import { Class as typeClass} from "./types"
import { QueryClassesResponse as typeQueryClassesResponse} from "./types"

export { MsgUpdateClass, MsgUpdateCreator, MsgDeleteCreator, MsgBurn, MsgMint };

type sendMsgUpdateClassParams = {
  value: MsgUpdateClass,
  fee?: StdFee,
  memo?: string
};

type sendMsgUpdateCreatorParams = {
  value: MsgUpdateCreator,
  fee?: StdFee,
  memo?: string
};

type sendMsgDeleteCreatorParams = {
  value: MsgDeleteCreator,
  fee?: StdFee,
  memo?: string
};

type sendMsgBurnParams = {
  value: MsgBurn,
  fee?: StdFee,
  memo?: string
};

type sendMsgMintParams = {
  value: MsgMint,
  fee?: StdFee,
  memo?: string
};


type msgUpdateClassParams = {
  value: MsgUpdateClass,
};

type msgUpdateCreatorParams = {
  value: MsgUpdateCreator,
};

type msgDeleteCreatorParams = {
  value: MsgDeleteCreator,
};

type msgBurnParams = {
  value: MsgBurn,
};

type msgMintParams = {
  value: MsgMint,
};


export const registry = new Registry(msgTypes);

type Field = {
	name: string;
	type: unknown;
}
function getStructure(template) {
	const structure: {fields: Field[]} = { fields: [] }
	for (let [key, value] of Object.entries(template)) {
		let field = { name: key, type: typeof value }
		structure.fields.push(field)
	}
	return structure
}
const defaultFee = {
  amount: [],
  gas: "200000",
};

interface TxClientOptions {
  addr: string
	prefix: string
	signer?: OfflineSigner
}

export const txClient = ({ signer, prefix, addr }: TxClientOptions = { addr: "https://rpc.iconlake.com", prefix: "iconlake" }) => {

  return {
		
		async sendMsgUpdateClass({ value, fee, memo }: sendMsgUpdateClassParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgUpdateClass: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix, aminoTypes: new AminoTypes(createIconAminoConverters())});
				let msg = this.msgUpdateClass({ value: MsgUpdateClass.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgUpdateClass: Could not broadcast Tx: '+ e.message)
			}
		},
		
		async sendMsgUpdateCreator({ value, fee, memo }: sendMsgUpdateCreatorParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgUpdateCreator: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix, aminoTypes: new AminoTypes(createIconAminoConverters())});
				let msg = this.msgUpdateCreator({ value: MsgUpdateCreator.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgUpdateCreator: Could not broadcast Tx: '+ e.message)
			}
		},
		
		async sendMsgDeleteCreator({ value, fee, memo }: sendMsgDeleteCreatorParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgDeleteCreator: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix, aminoTypes: new AminoTypes(createIconAminoConverters())});
				let msg = this.msgDeleteCreator({ value: MsgDeleteCreator.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgDeleteCreator: Could not broadcast Tx: '+ e.message)
			}
		},
		
		async sendMsgBurn({ value, fee, memo }: sendMsgBurnParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgBurn: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix, aminoTypes: new AminoTypes(createIconAminoConverters())});
				let msg = this.msgBurn({ value: MsgBurn.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgBurn: Could not broadcast Tx: '+ e.message)
			}
		},
		
		async sendMsgMint({ value, fee, memo }: sendMsgMintParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgMint: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix, aminoTypes: new AminoTypes(createIconAminoConverters())});
				let msg = this.msgMint({ value: MsgMint.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgMint: Could not broadcast Tx: '+ e.message)
			}
		},
		
		
		msgUpdateClass({ value }: msgUpdateClassParams): EncodeObject {
			try {
				return { typeUrl: "/iconlake.icon.MsgUpdateClass", value: MsgUpdateClass.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgUpdateClass: Could not create message: ' + e.message)
			}
		},
		
		msgUpdateCreator({ value }: msgUpdateCreatorParams): EncodeObject {
			try {
				return { typeUrl: "/iconlake.icon.MsgUpdateCreator", value: MsgUpdateCreator.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgUpdateCreator: Could not create message: ' + e.message)
			}
		},
		
		msgDeleteCreator({ value }: msgDeleteCreatorParams): EncodeObject {
			try {
				return { typeUrl: "/iconlake.icon.MsgDeleteCreator", value: MsgDeleteCreator.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgDeleteCreator: Could not create message: ' + e.message)
			}
		},
		
		msgBurn({ value }: msgBurnParams): EncodeObject {
			try {
				return { typeUrl: "/iconlake.icon.MsgBurn", value: MsgBurn.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgBurn: Could not create message: ' + e.message)
			}
		},
		
		msgMint({ value }: msgMintParams): EncodeObject {
			try {
				return { typeUrl: "/iconlake.icon.MsgMint", value: MsgMint.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgMint: Could not create message: ' + e.message)
			}
		},
		
	}
};

interface QueryClientOptions {
  addr: string
}

export const queryClient = ({ addr: addr }: QueryClientOptions = { addr: "https://lcd.iconlake.com" }) => {
  return new Api({ baseURL: addr });
};

class SDKModule {
	public query: ReturnType<typeof queryClient>;
	public tx: ReturnType<typeof txClient>;
	public structure: Record<string,unknown>;
	public registry: Array<[string, GeneratedType]> = [];

	constructor(client: IgniteClient) {		
	
		this.query = queryClient({ addr: client.env.apiURL });		
		this.updateTX(client);
		this.structure =  {
						ClassData: getStructure(typeClassData.fromPartial({})),
						ClassDataRaw: getStructure(typeClassDataRaw.fromPartial({})),
						CreatorRaw: getStructure(typeCreatorRaw.fromPartial({})),
						Creator: getStructure(typeCreator.fromPartial({})),
						IconData: getStructure(typeIconData.fromPartial({})),
						IconDataRaw: getStructure(typeIconDataRaw.fromPartial({})),
						Media: getStructure(typeMedia.fromPartial({})),
						Params: getStructure(typeParams.fromPartial({})),
						NFT: getStructure(typeNFT.fromPartial({})),
						QueryNFTsResponse: getStructure(typeQueryNFTsResponse.fromPartial({})),
						Class: getStructure(typeClass.fromPartial({})),
						QueryClassesResponse: getStructure(typeQueryClassesResponse.fromPartial({})),
						
		};
		client.on('signer-changed',(signer) => {			
		 this.updateTX(client);
		})
	}
	updateTX(client: IgniteClient) {
    const methods = txClient({
        signer: client.signer,
        addr: client.env.rpcURL,
        prefix: client.env.prefix ?? "iconlake",
    })
	
    this.tx = methods;
    for (let m in methods) {
        this.tx[m] = methods[m].bind(this.tx);
    }
	}
};

const Module = (test: IgniteClient) => {
	return {
		module: {
			IconlakeIcon: new SDKModule(test)
		},
		registry: msgTypes
  }
}
export default Module;