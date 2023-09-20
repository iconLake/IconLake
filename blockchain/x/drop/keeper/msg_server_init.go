package keeper

import (
	"context"

	"iconlake/x/drop/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdktx "github.com/cosmos/cosmos-sdk/types/tx"
	minttypes "github.com/cosmos/cosmos-sdk/x/mint/types"
)

func (k msgServer) Init(goCtx context.Context, msg *types.MsgInit) (*types.MsgMintResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	tx := &sdktx.Tx{}
	err := k.cdc.Unmarshal(ctx.TxBytes(), tx)
	if err != nil {
		k.Logger(ctx).Error(types.ErrFee.Wrap(err.Error()).Error())
		return nil, err
	}
	fee := tx.GetFee()
	if fee.Len() != 1 || fee[0].Denom != types.LakeDenom {
		return nil, types.ErrFee.Wrapf("only denom of %s is available", types.LakeDenom)
	}

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
		LastMintTime: ctx.BlockTime().UnixMilli(),
	}

	k.SetInfo(ctx, info)

	return &types.MsgMintResponse{
		Amount:       amounts[0],
		LastMintTime: info.LastMintTime,
	}, nil
}
