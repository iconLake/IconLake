package keeper

import (
	"context"

	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) Hash(goCtx context.Context, req *types.QueryHashRequest) (*types.QueryHashResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	graphHash, fileHash, err := types.GetImgHash(req.Uri, req.HashType)

	if err != nil {
		return nil, status.Error(codes.Aborted, err.Error())
	}

	_ = ctx

	return &types.QueryHashResponse{
		GraphHash: graphHash,
		FileHash:  fileHash,
	}, nil
}
