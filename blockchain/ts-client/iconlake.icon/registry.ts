import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgMint } from "./types/iconlake/icon/tx";
import { MsgUpdateClass } from "./types/iconlake/icon/tx";
import { MsgBurn } from "./types/iconlake/icon/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/iconlake.icon.MsgMint", MsgMint],
    ["/iconlake.icon.MsgUpdateClass", MsgUpdateClass],
    ["/iconlake.icon.MsgBurn", MsgBurn],
    
];

export { msgTypes }