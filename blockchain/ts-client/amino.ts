import { createDropAminoConverters } from "./iconlake.drop/types/iconlake/drop/tx";
import { createIconAminoConverters } from "./iconlake.icon/types/iconlake/icon/tx";

export function createIconlakeAminoConverters() {
  return {
    ...createIconAminoConverters(),
    ...createDropAminoConverters(),
  }
}
