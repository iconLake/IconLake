package types

import (
	"net/url"
	"strings"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const TypeMsgMint = "mint"

var _ sdk.Msg = &MsgMint{}

func NewMsgMint(creator string, classId string, id string, uri string, uriHash string, data *IconData, supply uint64) *MsgMint {
	return &MsgMint{
		Creator: creator,
		ClassId: classId,
		Id:      id,
		Uri:     uri,
		UriHash: uriHash,
		Data:    data,
		Supply:  supply,
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

func CheckImgHash(uri string, uriHash string, id string) (bool, error) {
	lowerUriHash := strings.ToLower(uriHash)
	lowerId := strings.ToLower(id)
	idParts := strings.SplitN(lowerId, ":", 3)
	hashType := idParts[0]
	switch hashType {
	case string(pHash):
		graphHash, fileHash, err := GetImgHash(uri, hashType)
		if err != nil {
			return false, err
		}
		if fileHash != lowerUriHash {
			return false, ErrParam.Wrapf("invalid param (UriHash), expect (%s)", fileHash)
		}
		if graphHash != strings.Join(idParts[:2], ":") {
			return false, ErrParam.Wrapf("invalid param (id), expect graph hash (%s)", graphHash)
		}
	default:
		return false, ErrParam.Wrap("invalid param (UriHash), invalid hash type, expect (p)")
	}
	return true, nil
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
	_, err = url.ParseRequestURI(msg.Uri)
	if err != nil {
		return ErrParam.Wrap("invalid param (Uri)")
	}
	uriHashLen := len(msg.UriHash)
	if uriHashLen < 32 || uriHashLen > 64 {
		return ErrParam.Wrap("invalid param (UriHash)")
	}
	_, err = sdk.AccAddressFromBech32(msg.Data.Author)
	if err != nil || msg.Creator != msg.Data.Author {
		return ErrParam.Wrap("invalid param (Data.Author)")
	}
	if len(msg.Data.Name) > 64 {
		return ErrParam.Wrap("invalid param (Data.Name), expect within 64 chars")
	}
	if len(msg.Data.Description) > 300 {
		return ErrParam.Wrap("invalid param (Data.Description), expect within 300 chars")
	}
	createTime, err := time.Parse(time.RFC3339, msg.Data.CreateTime)
	if err != nil {
		return ErrParam.Wrapf("invalid param (Data.CreateTime) (%s)", err)
	}
	now := time.Now()
	if createTime.After(now) || createTime.Before(now.Add(-10*time.Hour)) {
		return ErrParam.Wrapf("invalid param (Data.CreateTime: %s), expect within 10 hours (%s to %s)",
			createTime,
			now.Add(-10*time.Hour),
			now,
		)
	}
	if msg.Supply <= 0 || msg.Supply > 99 {
		return ErrParam.Wrap("invalid param (Supply), expect from 1 to 99")
	}
	isImgHashOk, err := CheckImgHash(msg.Uri, msg.UriHash, msg.Id)
	if !isImgHashOk {
		return err
	}
	return nil
}
