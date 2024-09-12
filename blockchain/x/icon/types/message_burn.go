package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
)

const TypeMsgBurn = "burn"

var _ sdk.Msg = &MsgBurn{}

func NewMsgBurn(creator string, classId string, id string) *MsgBurn {
	return &MsgBurn{
		Creator: creator,
		ClassId: classId,
		Id:      id,
	}
}

func (msg *MsgBurn) Route() string {
	return RouterKey
}

func (msg *MsgBurn) Type() string {
	return TypeMsgBurn
}

func (msg *MsgBurn) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgBurn) GetSignBytes() []byte {
	bz := Amino.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgBurn) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return ErrParam.Wrapf("invalid creator address (%s)", err)
	}
	err = CheckClassId(msg.ClassId)
	if err != nil {
		return err
	}
	err = CheckId(msg.Id)
	if err != nil {
		return err
	}
	return nil
}
