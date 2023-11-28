package keeper

import (
	"context"

	"iconlake/x/iconlake/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) AccountAll(goCtx context.Context, req *types.QueryAllAccountRequest) (*types.QueryAllAccountResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var accounts []types.Account
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
	accountStore := prefix.NewStore(store, types.KeyPrefix(types.AccountKeyPrefix))

	pageRes, err := query.Paginate(accountStore, req.Pagination, func(key []byte, value []byte) error {
		var account types.Account
		if err := k.cdc.Unmarshal(value, &account); err != nil {
			return err
		}

		accounts = append(accounts, account)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllAccountResponse{Account: accounts, Pagination: pageRes}, nil
}

func (k Keeper) Account(goCtx context.Context, req *types.QueryGetAccountRequest) (*types.QueryGetAccountResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(req.Address)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "address invalid")
	}

	val, found := k.GetAccount(
		ctx,
		accAddress,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetAccountResponse{Account: val}, nil
}
