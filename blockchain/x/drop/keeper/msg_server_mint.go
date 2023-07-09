package keeper

import (
	"context"
	"time"

	"iconlake/x/drop/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	minttypes "github.com/cosmos/cosmos-sdk/x/mint/types"
)

func (k msgServer) Mint(goCtx context.Context, msg *types.MsgMint) (*types.MsgMintResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(types.ErrAddress.Wrap(err.Error()).Error())
		return nil, err
	}

	amounts := sdk.NewCoins(msg.Amount)

	info, isCreated := k.GetInfo(ctx, msg.Creator)
	timestamp := time.Now().UnixMilli()
	if !isCreated {
		info = types.Info{
			Address:      msg.Creator,
			LastMintTime: timestamp,
		}
		amounts = sdk.NewCoins(sdk.NewCoin(types.DropDenom, sdk.NewInt(100000)))
	} else {
		seconds := sdk.NewInt((timestamp - info.LastMintTime) / 1000)
		if msg.Amount.Amount.GT(seconds) {
			return nil, types.ErrAmount.Wrapf("amount (%s) is invalid", msg.Amount)
		}
		info.LastMintTime = timestamp
	}

	err = k.mintKeeper.MintCoins(ctx, amounts)
	if err != nil {
		k.Logger(ctx).Error(types.ErrMint.Wrap(err.Error()).Error())
		return nil, err
	}

	err = k.bankKeeper.SendCoinsFromModuleToAccount(ctx, minttypes.ModuleName, accAddress, amounts)
	if err != nil {
		k.Logger(ctx).Error(types.ErrMint.Wrap(err.Error()).Error())
		return nil, err
	}

	k.SetInfo(ctx, info)

	_ = ctx

	return &types.MsgMintResponse{
		Amount:       amounts[0],
		LastMintTime: timestamp,
	}, nil
}
