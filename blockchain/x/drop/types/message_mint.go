package types

import (
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
	bz := Amino.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgMint) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return ErrAddress.Wrapf("invalid creator address (%s)", err)
	}
	if msg.Amount.Denom != DropDenom {
		return ErrDenom.Wrapf("only amount denom of \"%s\" is supported", DropDenom)
	}
	return nil
}
