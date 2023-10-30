import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateClass } from "./types/iconlake/icon/tx";
import { MsgMint } from "./types/iconlake/icon/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/iconlake.icon.MsgUpdateClass", MsgUpdateClass],
    ["/iconlake.icon.MsgMint", MsgMint],
    
];

export { msgTypes }