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

func (k msgServer) MintDrop(goCtx context.Context, msg *types.MsgMintDrop) (*types.MsgMintDropResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	denom := strings.ToLower(msg.Amount.GetDenom())
	if denom != types.DropDenom {
		return nil, sdkerrors.ErrPanic.Wrapf("denom %s is invalid", denom)
	}

	amounts := sdk.NewCoins(msg.Amount)

	account, isAccountCreated := k.GetAccount(ctx, accAddress)
	timestamp := time.Now().Unix()
	if !isAccountCreated {
		account = types.Account{
			AccAddress:       accAddress,
			LastMintDropTime: timestamp,
		}
		amounts = sdk.NewCoins(sdk.NewCoin(types.DropDenom, sdk.NewInt(10)))
	} else {
		hours := sdk.NewInt((timestamp - account.LastMintDropTime) / 3600000)
		if msg.Amount.Amount.GT(hours) {
			return nil, sdkerrors.ErrPanic.Wrapf("amount %s is invalid", msg.Amount)
		}
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
