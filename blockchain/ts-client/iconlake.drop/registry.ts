import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgMint } from "./types/iconlake/drop/tx";
import { MsgInit } from "./types/iconlake/drop/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/iconlake.drop.MsgMint", MsgMint],
    ["/iconlake.drop.MsgInit", MsgInit],
    
];

export { msgTypes }