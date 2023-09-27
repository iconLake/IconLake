package keeper

import (
	"context"

	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/nft"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) Class(goCtx context.Context, req *types.QueryClassRequest) (*types.QueryClassResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	if len(req.Id) == 0 {
		return nil, status.Error(codes.InvalidArgument, "invalid class id")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	classRaw, isExist := k.nftKeeper.GetClass(ctx, req.Id)
	if !isExist {
		return nil, status.Error(codes.NotFound, "class not found")
	}

	class, err := k.ConvertToClass(&classRaw)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryClassResponse{
		Class: class,
	}, nil
}

func (k Keeper) Classes(goCtx context.Context, req *nft.QueryClassesRequest) (*types.QueryClassesResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	res, err := k.nftKeeper.Classes(ctx, req)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	var classes []*types.Class
	for _, classRaw := range res.Classes {
		class, err := k.ConvertToClass(classRaw)
		if err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		classes = append(classes, class)
	}

	return &types.QueryClassesResponse{
		Classes:    classes,
		Pagination: res.Pagination,
	}, nil
}

func (k Keeper) ConvertToClass(classRaw *nft.Class) (*types.Class, error) {
	var classDataRaw types.ClassDataRawI
	err := k.cdc.UnpackAny(classRaw.Data, &classDataRaw)
	if err != nil {
		return nil, err
	}
	var accAuthor sdk.AccAddress = classDataRaw.GetAuthor()
	return &types.Class{
		Id:          classRaw.Id,
		Name:        classRaw.Name,
		Symbol:      classRaw.Symbol,
		Description: classRaw.Description,
		Uri:         classRaw.Uri,
		UriHash:     classRaw.UriHash,
		Data: &types.ClassData{
			Author:     accAuthor.String(),
			CreateTime: classDataRaw.GetCreateTime(),
		},
	}, nil
}
