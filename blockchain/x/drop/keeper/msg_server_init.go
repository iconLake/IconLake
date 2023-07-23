package keeper

import (
	"context"
	"time"

	"iconlake/x/drop/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	minttypes "github.com/cosmos/cosmos-sdk/x/mint/types"
)

func (k msgServer) Init(goCtx context.Context, msg *types.MsgInit) (*types.MsgMintResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		k.Logger(ctx).Error(types.ErrAddress.Wrap(err.Error()).Error())
		return nil, err
	}

	_, isCreated := k.GetInfo(ctx, msg.Address)
	if isCreated {
		return nil, types.ErrInit.Wrap("account has been initialized")
	}

	amounts := sdk.NewCoins(sdk.NewCoin(types.DropDenom, sdk.NewInt(100000)))

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

	info := types.Info{
		Address:      msg.Address,
		LastMintTime: time.Now().UnixMilli(),
	}

	k.SetInfo(ctx, info)

	return &types.MsgMintResponse{
		Amount:       amounts[0],
		LastMintTime: info.LastMintTime,
	}, nil
}
