package types

import (
	sdkerrors "cosmossdk.io/errors"
	"cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

const TypeMsgMint = "mint"

var _ sdk.Msg = &MsgMint{}

func NewMsgMint(creator string, amount sdk.Coin) *MsgMint {
	return &MsgMint{
		Creator: creator,
		Amount:  amount,
	}
}

func (msg *MsgMint) Route() string {
	return RouterKey
}

func (msg *MsgMint) Type() string {
	return TypeMsgMint
}

func (msg *MsgMint) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgMint) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgMint) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(ErrAddress, "invalid creator address (%s)", err)
	}
	if msg.Amount.Denom != DropDenom {
		return sdkerrors.Wrapf(ErrDenom, "only amount denom of \"%s\" is supported (%s)", DropDenom, err)
	}
	if msg.Amount.Amount.LT(math.NewInt(10000)) {
		return sdkerrors.Wrapf(ErrAmount, "amount should be greater than 10000%s (%s)", DropDenom, err)
	}
	return nil
}
