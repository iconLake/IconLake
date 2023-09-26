package types

import (
	"net/url"
	"unicode/utf8"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const TypeMsgMint = "mint"

var _ sdk.Msg = &MsgMint{}

func NewMsgMint(creator string, classId string, id string, name string, description string, uri string, uriHash string, supply uint64) *MsgMint {
	return &MsgMint{
		Creator:     creator,
		ClassId:     classId,
		Id:          id,
		Name:        name,
		Description: description,
		Uri:         uri,
		UriHash:     uriHash,
		Supply:      supply,
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
		return ErrParam.Wrapf("invalid param (Creator) (%s)", err)
	}
	classIdLen := len(msg.ClassId)
	if classIdLen < 6 || classIdLen > 64 {
		return ErrParam.Wrap("invalid param (ClassId), length should between 6 and 64")
	}
	hashType := msg.Id[0:1]
	idLen := len(msg.Id)
	if idLen <= 2 || idLen > 66 || hashType != string(pHash) || msg.Id[1:2] != ":" {
		return ErrParam.Wrap("invalid param (Id), expect format of \"p:xxxx\" or \"p:xxxx:123\"")
	}
	if utf8.RuneCountInString(msg.Name) > 64 {
		return ErrParam.Wrap("invalid param (Name), expect within 64 chars")
	}
	if utf8.RuneCountInString(msg.Description) > 300 {
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
	if msg.Supply <= 0 || msg.Supply > 99 {
		return ErrParam.Wrap("invalid param (Supply), expect from 1 to 99")
	}
	return nil
}
