package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
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
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
