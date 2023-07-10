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
	hashType := lowerId[0:1]
	switch hashType {
	case string(pHash):
		graphHash, fileHash, err := GetImgHash(uri, hashType)
		if err != nil {
			return false, err
		}
		if fileHash != lowerUriHash {
			return false, ErrParam.Wrapf("invalid param (UriHash), expect (%s)", fileHash)
		}
		if graphHash != lowerId {
			return false, ErrParam.Wrapf("invalid param (id), expect (%s)", graphHash)
		}
	default:
		return false, ErrParam.Wrap("invalid param (UriHash), invalid hash type, expect (p)")
	}
	return true, nil
}

func (msg *MsgMint) ValidateBasic() error {
	classIdLen := len(msg.ClassId)
	if classIdLen < 6 || classIdLen > 64 {
		return ErrParam.Wrap("invalid param (ClassId), length should between 6 and 64")
	}
	hashType := msg.Id[0:1]
	idLen := len(msg.Id)
	if idLen <= 2 || idLen > 130 || hashType != string(pHash) || msg.Id[1:2] != ":" {
		return ErrParam.Wrap("invalid param (Id), expect format of \"p:xxxx\"")
	}
	_, err := url.ParseRequestURI(msg.Uri)
	if err != nil {
		return ErrParam.Wrap("invalid param (Uri)")
	}
	if len(msg.UriHash) < 32 {
		return ErrParam.Wrap("invalid param (UriHash)")
	}
	_, err = sdk.AccAddressFromBech32(msg.Data.Author)
	if err != nil {
		return ErrParam.Wrap("invalid param (Data.Author)")
	}
	if len(msg.Data.Name) > 64 {
		return ErrParam.Wrap("invalid param (Data.Name), expect within 64 chars")
	}
	if len(msg.Data.Description) > 1024 {
		return ErrParam.Wrap("invalid param (Data.Description), expect within 1024 chars")
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
	if msg.Supply == 0 {
		return ErrParam.Wrap("invalid param (Supply)")
	}
	isImgHashOk, err := CheckImgHash(msg.Uri, msg.UriHash, msg.Id)
	if !isImgHashOk {
		return err
	}
	return nil
}
