package keeper

import (
	"iconlake/x/icon/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetCreator set a specific creator in the store from its index
func (k Keeper) SetCreator(ctx sdk.Context, creator types.CreatorRaw) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CreatorKeyPrefix))
	b := k.cdc.MustMarshal(&creator)
	store.Set(types.CreatorKey(
		creator.Address,
	), b)
}

// GetCreator returns a creator from its index
func (k Keeper) GetCreator(
	ctx sdk.Context,
	address []byte,

) (val types.CreatorRaw, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CreatorKeyPrefix))

	b := store.Get(types.CreatorKey(
		address,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveCreator removes a creator from the store
func (k Keeper) RemoveCreator(
	ctx sdk.Context,
	address []byte,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CreatorKeyPrefix))
	store.Delete(types.CreatorKey(
		address,
	))
}

// GetAllCreator returns all creator
func (k Keeper) GetAllCreator(ctx sdk.Context) (list []types.CreatorRaw) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CreatorKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.CreatorRaw
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
