package drop

import (
	"iconlake/x/drop/keeper"
	"iconlake/x/drop/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// Set all the info
	for _, elem := range genState.InfoList {
		accAddress, _ := sdk.AccAddressFromBech32(elem.Address)
		k.SetInfo(ctx, types.InfoRaw{
			Address:      accAddress,
			LastMintTime: elem.LastMintTime,
		})
	}
	// this line is used by starport scaffolding # genesis/module/init
	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the module's exported genesis
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	genesis.InfoList = k.GetAllInfo(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
