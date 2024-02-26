package keeper

import (
	"context"

	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) Burn(goCtx context.Context, msg *types.MsgBurn) (*types.MsgBurnResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	isClassExist := k.nftKeeper.HasClass(ctx, msg.ClassId)
	if !isClassExist {
		return nil, types.ErrParam.Wrap("class not exist")
	}

	isNftExist := k.nftKeeper.HasNFT(ctx, msg.ClassId, msg.Id)
	if !isNftExist {
		return nil, types.ErrParam.Wrap("nft not exist")
	}

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}
	owner := k.nftKeeper.GetOwner(ctx, msg.ClassId, msg.Id)
	if !accAddress.Equals(owner) {
		return nil, types.ErrPermission.Wrapf("expected owner is (%s)", owner.String())
	}

	err = k.nftKeeper.Burn(ctx, msg.ClassId, msg.Id)
	if err != nil {
		return nil, err
	}

	return &types.MsgBurnResponse{}, nil
}
