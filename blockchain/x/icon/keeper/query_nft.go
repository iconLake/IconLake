package keeper

import (
	"context"

	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) NFT(goCtx context.Context, req *types.QueryNFTRequest) (*types.QueryNFTResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	nft, isExist := k.nftKeeper.GetNFT(ctx, req.ClassId, req.Id)
	if !isExist {
		return nil, status.Error(codes.NotFound, "nft not found")
	}

	var iconDataRaw types.IconDataRawI
	err := k.cdc.UnpackAny(nft.Data, &iconDataRaw)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	var accAuthor sdk.AccAddress = iconDataRaw.GetAuthor()
	iconData := types.IconData{
		Author:      accAuthor.String(),
		Name:        iconDataRaw.GetName(),
		Description: iconDataRaw.GetDescription(),
		CreateTime:  iconDataRaw.GetCreateTime(),
	}

	return &types.QueryNFTResponse{
		ClassId: nft.ClassId,
		Id:      nft.Id,
		Uri:     nft.Uri,
		UriHash: nft.UriHash,
		Data:    &iconData,
	}, nil
}
