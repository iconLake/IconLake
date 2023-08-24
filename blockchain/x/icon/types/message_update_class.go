package types

import (
	"net/url"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const TypeMsgUpdateClass = "update_class"

var _ sdk.Msg = &MsgUpdateClass{}

func NewMsgUpdateClass(creator string, id string, name string, symbol string, description string, uri string, uriHash string) *MsgUpdateClass {
	return &MsgUpdateClass{
		Creator:     creator,
		Id:          id,
		Name:        name,
		Symbol:      symbol,
		Description: description,
		Uri:         uri,
		UriHash:     uriHash,
	}
}

func (msg *MsgUpdateClass) Route() string {
	return RouterKey
}

func (msg *MsgUpdateClass) Type() string {
	return TypeMsgUpdateClass
}

func (msg *MsgUpdateClass) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgUpdateClass) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgUpdateClass) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return ErrParam.Wrapf("invalid creator address (%s)", err)
	}
	idLen := len(msg.Id)
	if idLen < 6 || idLen > 64 {
		return ErrParam.Wrap("invalid param (Id), length should between 6 and 64")
	}
	if len(msg.Name) > 64 {
		return ErrParam.Wrap("invalid param (Name), expect within 64 chars")
	}
	if len(msg.Symbol) > 32 {
		return ErrParam.Wrap("invalid param (Symbol), expect within 32 chars")
	}
	if len(msg.Description) > 300 {
		return ErrParam.Wrap("invalid param (Description), expect within 300 chars")
	}
	_, err = url.ParseRequestURI(msg.Uri)
	if err != nil {
		return ErrParam.Wrap("invalid param (Uri)")
	}
	uriHashLen := len(msg.UriHash)
	if uriHashLen < 32 || uriHashLen > 64 {
		return ErrParam.Wrap("invalid param (UriHash)")
	}
	fileHash, err := GetFileHash(msg.Uri)
	if err != nil {
		return err
	}
	if fileHash != msg.UriHash {
		return ErrParam.Wrap("invalid param (UriHash)")
	}
	return nil
}
