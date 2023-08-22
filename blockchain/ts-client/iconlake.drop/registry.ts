import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgInit } from "./types/iconlake/drop/tx";
import { MsgMint } from "./types/iconlake/drop/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/iconlake.drop.MsgInit", MsgInit],
    ["/iconlake.drop.MsgMint", MsgMint],
    
];

export { msgTypes }