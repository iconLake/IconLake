package icon

import (
	"iconlake/x/icon/keeper"
	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// Set all the creator
	for _, elem := range genState.CreatorList {
		accAddress, err := sdk.AccAddressFromBech32(elem.Address)
		if err != nil {
			panic(err)
		}
		creator := types.CreatorRaw{
			Address:     accAddress,
			Name:        elem.Name,
			Description: elem.Description,
			Avatar:      elem.Avatar,
			AvatarHash:  elem.AvatarHash,
			Medias:      elem.Medias,
			Sex:         elem.Sex,
			Birthday:    elem.Birthday,
			Location:    elem.Location,
		}
		k.SetCreator(ctx, creator)
	}
	// this line is used by starport scaffolding # genesis/module/init
	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the module's exported genesis
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	var list []types.Creator
	creators := k.GetAllCreator(ctx)
	for _, elem := range creators {
		accAddress := sdk.AccAddress(elem.Address)
		list = append(list, types.Creator{
			Address:     accAddress.String(),
			Name:        elem.Name,
			Description: elem.Description,
			Avatar:      elem.Avatar,
			AvatarHash:  elem.AvatarHash,
			Medias:      elem.Medias,
			Sex:         elem.Sex,
			Birthday:    elem.Birthday,
			Location:    elem.Location,
		})
	}
	genesis.CreatorList = list
	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
