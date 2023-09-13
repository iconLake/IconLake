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

	info, isCreated := k.GetInfo(ctx, msg.Creator)
	if !isCreated {
		return nil, types.ErrMint.Wrap("account has not been initialized")
	}

	timestamp := time.Now().UnixMilli()
	seconds := sdk.NewInt((timestamp - info.LastMintTime) / 1000)
	if msg.Amount.Amount.GT(seconds) {
		return nil, types.ErrAmount.Wrapf("amount (%s%s) is available since last mint", seconds, types.DropDenom)
	}
	info.LastMintTime = timestamp

	amounts := sdk.NewCoins(msg.Amount)
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

	return &types.MsgMintResponse{
		Amount:       amounts[0],
		LastMintTime: timestamp,
	}, nil
}