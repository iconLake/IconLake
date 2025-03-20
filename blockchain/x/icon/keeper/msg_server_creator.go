package keeper

import (
	"context"

	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) UpdateCreator(goCtx context.Context, msg *types.MsgUpdateCreator) (*types.MsgUpdateCreatorResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		return nil, err
	}

	var creator = types.CreatorRaw{
		Address:     accAddress,
		Name:        msg.Name,
		Description: msg.Description,
		Avatar:      msg.Avatar,
		AvatarHash:  msg.AvatarHash,
		Medias:      msg.Medias,
		Sex:         msg.Sex,
		Birthday:    msg.Birthday,
		Location:    msg.Location,
	}

	k.SetCreator(ctx, creator)

	return &types.MsgUpdateCreatorResponse{}, nil
}

func (k msgServer) DeleteCreator(goCtx context.Context, msg *types.MsgDeleteCreator) (*types.MsgDeleteCreatorResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		return nil, err
	}

	_, isFound := k.GetCreator(
		ctx,
		accAddress,
	)
	if !isFound {
		return nil, types.ErrParam.Wrap("creator not found")
	}

	k.RemoveCreator(
		ctx,
		accAddress,
	)

	return &types.MsgDeleteCreatorResponse{}, nil
}
