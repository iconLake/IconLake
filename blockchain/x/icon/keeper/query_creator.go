package keeper

import (
	"context"

	"iconlake/x/icon/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) CreatorAll(goCtx context.Context, req *types.QueryAllCreatorRequest) (*types.QueryAllCreatorResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var creators []types.Creator
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
	creatorStore := prefix.NewStore(store, types.KeyPrefix(types.CreatorKeyPrefix))

	pageRes, err := query.Paginate(creatorStore, req.Pagination, func(key []byte, value []byte) error {
		var creatorRaw types.CreatorRaw
		if err := k.cdc.Unmarshal(value, &creatorRaw); err != nil {
			return err
		}
		creator := types.Creator{
			Address:     sdk.AccAddress(creatorRaw.Address).String(),
			Name:        creatorRaw.Name,
			Description: creatorRaw.Description,
			Avatar:      creatorRaw.Avatar,
			AvatarHash:  creatorRaw.AvatarHash,
			Medias:      creatorRaw.Medias,
			Sex:         creatorRaw.Sex,
			Birthday:    creatorRaw.Birthday,
			Location:    creatorRaw.Location,
		}
		creators = append(creators, creator)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllCreatorResponse{Creator: creators, Pagination: pageRes}, nil
}

func (k Keeper) Creator(goCtx context.Context, req *types.QueryGetCreatorRequest) (*types.QueryGetCreatorResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	address, err := sdk.AccAddressFromBech32(req.Address)
	if err != nil {
		return nil, err
	}

	val, found := k.GetCreator(
		ctx,
		address,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	creator := types.Creator{
		Address:     sdk.AccAddress(val.Address).String(),
		Name:        val.Name,
		Description: val.Description,
		Avatar:      val.Avatar,
		AvatarHash:  val.AvatarHash,
		Medias:      val.Medias,
		Sex:         val.Sex,
		Birthday:    val.Birthday,
		Location:    val.Location,
	}

	return &types.QueryGetCreatorResponse{Creator: creator}, nil
}
