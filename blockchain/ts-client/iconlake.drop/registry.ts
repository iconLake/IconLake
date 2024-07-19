import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/iconlake/drop/tx";
import { MsgInit } from "./types/iconlake/drop/tx";
import { MsgMint } from "./types/iconlake/drop/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/iconlake.drop.MsgUpdateParams", MsgUpdateParams],
    ["/iconlake.drop.MsgInit", MsgInit],
    ["/iconlake.drop.MsgMint", MsgMint],
    
];

export { msgTypes }