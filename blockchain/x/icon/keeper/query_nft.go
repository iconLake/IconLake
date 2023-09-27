package keeper

import (
	"context"

	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/nft"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) NFT(goCtx context.Context, req *nft.QueryNFTRequest) (*types.QueryNFTResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	if len(req.ClassId) == 0 {
		return nil, status.Error(codes.InvalidArgument, "invalid class id")
	}
	if len(req.Id) == 0 {
		return nil, status.Error(codes.InvalidArgument, "invalid nft id")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	nftRaw, isExist := k.nftKeeper.GetNFT(ctx, req.ClassId, req.Id)
	if !isExist {
		return nil, status.Error(codes.NotFound, "nft not found")
	}

	nft, err := k.ConvertToNFT(&nftRaw)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryNFTResponse{
		Nft: nft,
	}, nil
}

func (k Keeper) NFTs(goCtx context.Context, req *nft.QueryNFTsRequest) (*types.QueryNFTsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	res, err := k.nftKeeper.NFTs(ctx, req)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	var nfts []*types.NFT
	for _, nftRaw := range res.Nfts {
		var iconDataRaw types.IconDataRawI
		err := k.cdc.UnpackAny(nftRaw.Data, &iconDataRaw)
		if err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		nft, err := k.ConvertToNFT(nftRaw)
		if err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		nfts = append(nfts, nft)
	}

	return &types.QueryNFTsResponse{
		Nfts:       nfts,
		Pagination: res.Pagination,
	}, nil
}

func (k Keeper) ConvertToNFT(nftRaw *nft.NFT) (*types.NFT, error) {
	var iconDataRaw types.IconDataRawI
	err := k.cdc.UnpackAny(nftRaw.Data, &iconDataRaw)
	if err != nil {
		return nil, err
	}
	var accAuthor sdk.AccAddress = iconDataRaw.GetAuthor()
	return &types.NFT{
		ClassId: nftRaw.ClassId,
		Id:      nftRaw.Id,
		Uri:     nftRaw.Uri,
		UriHash: nftRaw.UriHash,
		Data: &types.IconData{
			Author:      accAuthor.String(),
			Name:        iconDataRaw.GetName(),
			Description: iconDataRaw.GetDescription(),
			CreateTime:  iconDataRaw.GetCreateTime(),
		},
	}, nil
}
