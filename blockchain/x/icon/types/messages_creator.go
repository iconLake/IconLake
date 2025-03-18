package types

import (
	"net/url"
	"unicode/utf8"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const (
	TypeMsgCreateCreator = "create_creator"
	TypeMsgUpdateCreator = "update_creator"
	TypeMsgDeleteCreator = "delete_creator"
)

var _ sdk.Msg = &MsgUpdateCreator{}

func NewMsgUpdateCreator(
	address string,
	name string,
	description string,
	avatar string,
	avatarHash string,
	medias []*Media,
	sex string,
	birthday string,
	location string,

) *MsgUpdateCreator {
	return &MsgUpdateCreator{
		Address:     address,
		Name:        name,
		Description: description,
		Avatar:      avatar,
		AvatarHash:  avatarHash,
		Medias:      medias,
		Sex:         sex,
		Birthday:    birthday,
		Location:    location,
	}
}

func (msg *MsgUpdateCreator) Route() string {
	return RouterKey
}

func (msg *MsgUpdateCreator) Type() string {
	return TypeMsgUpdateCreator
}

func (msg *MsgUpdateCreator) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgUpdateCreator) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgUpdateCreator) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		return ErrParam.Wrapf("invalid creator address (%s)", err)
	}
	if utf8.RuneCountInString(msg.Name) > 16 {
		return ErrParam.Wrap("invalid param (Name), expect within 16 chars")
	}
	if utf8.RuneCountInString(msg.Description) > 1024 {
		return ErrParam.Wrap("invalid param (Description), expect within 1024 chars")
	}
	_, err = url.ParseRequestURI(msg.Avatar)
	if err != nil {
		return ErrParam.Wrap("invalid param (Avatar)")
	}
	avatarHashLen := len(msg.AvatarHash)
	if avatarHashLen < 32 || avatarHashLen > 64 {
		return ErrParam.Wrap("invalid param (AvatarHash)")
	}
	for _, media := range msg.Medias {
		if utf8.RuneCountInString(media.Name) > 16 {
			return ErrParam.Wrap("invalid param (MediaName), expect within 16 chars")
		}
		if utf8.RuneCountInString(media.Content) > 128 {
			return ErrParam.Wrap("invalid param (MediaContent), expect within 128 chars")
		}
	}
	if utf8.RuneCountInString(msg.Sex) > 8 {
		return ErrParam.Wrap("invalid param (Sex), expect within 8 chars")
	}
	if utf8.RuneCountInString(msg.Birthday) > 32 {
		return ErrParam.Wrap("invalid param (Birthday), expect within 32 chars")
	}
	if utf8.RuneCountInString(msg.Location) > 64 {
		return ErrParam.Wrap("invalid param (Location), expect within 64 chars")
	}
	return nil
}

var _ sdk.Msg = &MsgDeleteCreator{}

func NewMsgDeleteCreator(
	address string,
) *MsgDeleteCreator {
	return &MsgDeleteCreator{
		Address: address,
	}
}
func (msg *MsgDeleteCreator) Route() string {
	return RouterKey
}

func (msg *MsgDeleteCreator) Type() string {
	return TypeMsgDeleteCreator
}

func (msg *MsgDeleteCreator) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgDeleteCreator) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgDeleteCreator) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Address)
	if err != nil {
		return ErrParam.Wrapf("invalid creator address (%s)", err)
	}
	return nil
}
