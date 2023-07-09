package types

import (
	sdkerrors "cosmossdk.io/errors"
	math "cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

const TypeMsgMintDrop = "mint_drop"

var _ sdk.Msg = &MsgMintDrop{}

func NewMsgMintDrop(creator string, amount sdk.Coin) *MsgMintDrop {
	return &MsgMintDrop{
		Creator: creator,
		Amount:  amount,
	}
}

func (msg *MsgMintDrop) Route() string {
	return RouterKey
}

func (msg *MsgMintDrop) Type() string {
	return TypeMsgMintDrop
}

func (msg *MsgMintDrop) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgMintDrop) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgMintDrop) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(ErrAddress, "invalid creator address (%s)", err)
	}
	if msg.Amount.Denom != "udrop" {
		return sdkerrors.Wrapf(ErrDenom, "only amount denom of \"udrop\" is supported (%s)", err)
	}
	if msg.Amount.Amount.LTE(math.NewInt(10000)) {
		return sdkerrors.Wrapf(ErrAmount, "amount should be greater than 10000 (%s)", err)
	}
	return nil
}
