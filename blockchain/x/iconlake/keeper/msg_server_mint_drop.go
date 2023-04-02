package keeper

import (
	"context"

	"iconlake/x/iconlake/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	mintTypes "github.com/cosmos/cosmos-sdk/x/mint/types"
)

func (k msgServer) MintDrop(goCtx context.Context, msg *types.MsgMintDrop) (*types.MsgMintDropResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	amounts := sdk.NewCoins(msg.Amount)

	err = k.mint.MintCoins(ctx, amounts)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	err = k.bank.SendCoinsFromModuleToAccount(ctx, mintTypes.ModuleName, accAddress, amounts)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	_ = ctx

	return &types.MsgMintDropResponse{}, nil
}
