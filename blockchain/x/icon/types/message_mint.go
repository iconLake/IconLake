package types

import (
	"crypto/sha256"
	"encoding/hex"
	"image"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"cosmossdk.io/errors"
	imageHash "github.com/corona10/goimagehash"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgMint = "mint"

var _ sdk.Msg = &MsgMint{}

func NewMsgMint(creator string, classId string, uri string, uriHash string, data *IconData, supply uint64) *MsgMint {
	return &MsgMint{
		Creator: creator,
		ClassId: classId,
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

func checkImgHash(uri string, uriHash string, id string) bool {
	_, err := url.ParseRequestURI(uri)
	if err != nil {
		return false
	}
	resp, err := http.Get(uri)
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	img, _, err := image.Decode(resp.Body)
	if err != nil {
		return false
	}
	hashType, err := strconv.Atoi(uriHash[0:2])
	if err != nil {
		return false
	}
	switch hashType {
	case 1:
		phash, err := imageHash.PerceptionHash(img)
		if err != nil || phash.ToString() != uriHash[2:] {
			return false
		}
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return false
		}
		hash := sha256.New()
		hash.Write(bodyBytes)
		hashStr := hex.EncodeToString(hash.Sum(nil))
		if hashStr != id {
			return false
		}
	default:
		return false
	}
	return true
}

func (msg *MsgMint) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if len(msg.ClassId) == 0 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (ClassId)")
	}
	if len(msg.Id) == 0 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Id)")
	}
	if len(msg.Uri) == 0 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Uri)")
	}
	if len(msg.UriHash) < 3 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (UriHash)")
	}
	createTime, err := time.Parse(time.RFC3339, msg.Data.CreateTime)
	if err != nil || createTime.After(time.Now()) || createTime.Before(time.Now().Add(-24*time.Hour)) {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Data.CreateTime)")
	}
	if !checkImgHash(msg.Uri, msg.UriHash, msg.Id) {
		return errors.Wrapf(ErrInvalidParam, "invalid params (Uri, UriHash, Id)")
	}
	return nil
}
