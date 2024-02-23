package keeper

import (
	"context"

	"iconlake/x/drop/types"

	"cosmossdk.io/math"
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

	info, isCreated := k.GetInfo(ctx, accAddress)
	if !isCreated {
		return nil, types.ErrMint.Wrap("account has not been initialized")
	}

	params := k.GetParams(ctx)
	if msg.Amount.Amount.LT(math.NewInt(params.MinAmountPerMint)) {
		return nil, types.ErrAmount.Wrapf("amount should be greater than %d%s", params.MinAmountPerMint, types.DropDenom)
	}
	if msg.Amount.Amount.GT(math.NewInt(params.MaxAmountPerMint)) {
		return nil, types.ErrAmount.Wrapf("amount should be littler than %d%s", params.MaxAmountPerMint, types.DropDenom)
	}

	timestamp := ctx.BlockTime().UnixMilli()
	seconds := sdk.NewInt((timestamp - info.LastMintTime) / 1000)
	if msg.Amount.Amount.GT(seconds) {
		return nil, types.ErrAmount.Wrapf("amount (%s%s) is available since last mint", seconds, types.DropDenom)
	}

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

	k.SetInfo(ctx, types.InfoRaw{
		Address:      accAddress,
		LastMintTime: timestamp,
	})

	return &types.MsgMintResponse{
		Amount:       amounts[0],
		LastMintTime: timestamp,
	}, nil
}
