package keeper

import (
	"context"
	"strings"
	"time"

	"iconlake/x/iconlake/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	mintTypes "github.com/cosmos/cosmos-sdk/x/mint/types"
)

// 1 second mint 1 udrop, when create account mint 1drop, 1drop = 10000udrop
func (k msgServer) MintDrop(goCtx context.Context, msg *types.MsgMintDrop) (*types.MsgMintDropResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	denom := strings.ToLower(msg.Amount.GetDenom())
	if denom != types.DropDenom {
		return nil, sdkerrors.ErrPanic.Wrapf("denom (%s) is invalid, expect (%s)", denom, types.DropDenom)
	}

	amounts := sdk.NewCoins(msg.Amount)

	account, isAccountCreated := k.GetAccount(ctx, accAddress)
	timestamp := time.Now().UnixMilli()
	if !isAccountCreated {
		gasMeter := ctx.GasMeter()
		gasMeter.RefundGas(gasMeter.GasConsumed(), "create account")
		account = types.Account{
			AccAddress:       accAddress,
			LastMintDropTime: timestamp,
		}
		amounts = sdk.NewCoins(sdk.NewCoin(types.DropDenom, sdk.NewInt(100000)))
	} else {
		seconds := sdk.NewInt((timestamp - account.LastMintDropTime) / 1000)
		if msg.Amount.Amount.GT(seconds) {
			return nil, sdkerrors.ErrPanic.Wrapf("amount (%s) is invalid", msg.Amount)
		}
		account.LastMintDropTime = timestamp
	}

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

	k.SetAccount(ctx, account)

	_ = ctx

	return &types.MsgMintDropResponse{
		Creator:          msg.Creator,
		Amount:           &amounts[0],
		LastMintDropTime: timestamp,
	}, nil
}
