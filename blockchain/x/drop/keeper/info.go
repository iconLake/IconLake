package keeper

import (
	"iconlake/x/drop/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetInfo set a specific info in the store from its index
func (k Keeper) SetInfo(ctx sdk.Context, infoRaw types.InfoRaw) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.InfoKeyPrefix))
	b := k.cdc.MustMarshal(&infoRaw)
	store.Set(types.InfoKey(
		infoRaw.Address,
	), b)
}

// GetInfo returns a info from its index
func (k Keeper) GetInfo(
	ctx sdk.Context,
	accAddress sdk.AccAddress,
) (val types.Info, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.InfoKeyPrefix))

	b := store.Get(types.InfoKey(
		accAddress,
	))
	if b == nil {
		return val, false
	}

	infoRaw := types.InfoRaw{}
	k.cdc.MustUnmarshal(b, &infoRaw)

	return k.ConvertToInfo(infoRaw), true
}

// RemoveInfo removes a info from the store
func (k Keeper) RemoveInfo(
	ctx sdk.Context,
	accAddress sdk.AccAddress,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.InfoKeyPrefix))
	store.Delete(types.InfoKey(
		accAddress,
	))
}

// GetAllInfo returns all info
func (k Keeper) GetAllInfo(ctx sdk.Context) (list []types.Info) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.InfoKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.InfoRaw
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, k.ConvertToInfo(val))
	}

	return
}

func (k Keeper) ConvertToInfo(infoRaw types.InfoRaw) types.Info {
	var aa sdk.AccAddress = infoRaw.Address
	return types.Info{
		Address:      aa.String(),
		LastMintTime: infoRaw.LastMintTime,
	}
}
