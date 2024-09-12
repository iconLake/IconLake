package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
)

const TypeMsgInit = "init"

var _ sdk.Msg = &MsgInit{}

func NewMsgInit(creator string, address string) *MsgInit {
	return &MsgInit{
		Creator: creator,
		Address: address,
	}
}

func (msg *MsgInit) Route() string {
	return RouterKey
}

func (msg *MsgInit) Type() string {
	return TypeMsgInit
}

func (msg *MsgInit) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgInit) GetSignBytes() []byte {
	bz := Amino.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgInit) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return ErrAddress.Wrapf("invalid creator address (%s)", err)
	}
	_, err = sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		return ErrAddress.Wrapf("invalid initializing address (%s)", err)
	}
	return nil
}
