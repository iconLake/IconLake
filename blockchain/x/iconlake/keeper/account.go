package keeper

import (
	"iconlake/x/iconlake/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetAccount set a specific account in the store from its index
func (k Keeper) SetAccount(ctx sdk.Context, account types.Account) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AccountKeyPrefix))
	b := k.cdc.MustMarshal(&account)
	store.Set(types.AccountKey(
		account.AccAddress,
	), b)
}

// GetAccount returns a account from its index
func (k Keeper) GetAccount(
	ctx sdk.Context,
	accAddress []byte,

) (val types.Account, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AccountKeyPrefix))

	b := store.Get(types.AccountKey(
		accAddress,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveAccount removes a account from the store
func (k Keeper) RemoveAccount(
	ctx sdk.Context,
	accAddress []byte,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AccountKeyPrefix))
	store.Delete(types.AccountKey(
		accAddress,
	))
}

// GetAllAccount returns all account
func (k Keeper) GetAllAccount(ctx sdk.Context) (list []types.Account) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AccountKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.Account
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
