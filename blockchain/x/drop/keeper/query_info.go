package keeper

import (
	"context"

	"iconlake/x/drop/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) InfoAll(goCtx context.Context, req *types.QueryAllInfoRequest) (*types.QueryAllInfoResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var infos []types.Info
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
	infoStore := prefix.NewStore(store, types.KeyPrefix(types.InfoKeyPrefix))

	pageRes, err := query.Paginate(infoStore, req.Pagination, func(key []byte, value []byte) error {
		var infoRaw types.InfoRaw
		if err := k.cdc.Unmarshal(value, &infoRaw); err != nil {
			return err
		}
		infos = append(infos, k.ConvertToInfo(infoRaw))
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllInfoResponse{Info: infos, Pagination: pageRes}, nil
}

func (k Keeper) Info(goCtx context.Context, req *types.QueryGetInfoRequest) (*types.QueryGetInfoResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(req.Address)
	if err != nil {
		return nil, err
	}
	val, found := k.GetInfo(
		ctx,
		accAddress,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetInfoResponse{Info: val}, nil
}
