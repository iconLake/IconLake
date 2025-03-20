import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateClass } from "./types/iconlake/icon/tx";
import { MsgUpdateCreator } from "./types/iconlake/icon/tx";
import { MsgDeleteCreator } from "./types/iconlake/icon/tx";
import { MsgBurn } from "./types/iconlake/icon/tx";
import { MsgMint } from "./types/iconlake/icon/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/iconlake.icon.MsgUpdateClass", MsgUpdateClass],
    ["/iconlake.icon.MsgUpdateCreator", MsgUpdateCreator],
    ["/iconlake.icon.MsgDeleteCreator", MsgDeleteCreator],
    ["/iconlake.icon.MsgBurn", MsgBurn],
    ["/iconlake.icon.MsgMint", MsgMint],
    
];

export { msgTypes }