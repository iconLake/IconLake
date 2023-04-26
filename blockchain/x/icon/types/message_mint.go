package types

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	_ "golang.org/x/image/webp"
	"gopkg.in/gographics/imagick.v3/imagick"

	"cosmossdk.io/errors"
	imageHash "github.com/corona10/goimagehash"
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

func checkImgHash(uri string, uriHash string, id string) (bool, error) {
	_, err := url.ParseRequestURI(uri)
	if err != nil {
		return false, err
	}
	resp, err := http.Get(uri)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, errors.Wrapf(err, "invalid param (Uri)")
	}
	var img image.Image
	if strings.HasPrefix(resp.Header.Get("Content-Type"), "image/svg+xml") {
		imagick.Initialize()
		defer imagick.Terminate()
		mw := imagick.NewMagickWand()
		defer mw.Destroy()
		err = mw.ReadImageBlob(bodyBytes)
		if err != nil {
			return false, errors.Wrapf(err, "invalid param (Uri)")
		}
		mw.SetImageFormat("png")
		pixels, err := mw.ExportImagePixels(0, 0, mw.GetImageWidth(), mw.GetImageHeight(), "RGBA", imagick.PIXEL_CHAR)
		if err != nil {
			return false, errors.Wrapf(err, "invalid param (Uri)")
		}
		imgTmp := image.NewRGBA(image.Rect(0, 0, int(mw.GetImageWidth()), int(mw.GetImageHeight())))
		copy(imgTmp.Pix, pixels.([]uint8))
		img = imgTmp
	} else {
		img, _, err = image.Decode(bytes.NewReader(bodyBytes))
		if err != nil {
			return false, errors.Wrapf(err, "invalid param (Uri)")
		}
	}
	lowerUriHash := strings.ToLower(uriHash)
	hashType := lowerUriHash[0:1]
	switch hashType {
	case "p":
		phash, err := imageHash.PerceptionHash(img)
		if err != nil || phash.ToString() != lowerUriHash {
			return false, errors.Wrapf(ErrInvalidParam, "invalid param (UriHash), expect (%s)", phash.ToString())
		}
		hash := sha1.New()
		hash.Write(bodyBytes)
		hashStr := hex.EncodeToString(hash.Sum(nil))
		if hashStr != id {
			return false, errors.Wrapf(ErrInvalidParam, "invalid param (id), expect (%s)", hashStr)
		}
	default:
		return false, errors.Wrapf(ErrInvalidParam, "invalid param (UriHash), invalid hash type, expect (p)")
	}
	return true, nil
}

func (msg *MsgMint) ValidateBasic() error {
	classIdLen := len(msg.ClassId)
	if classIdLen < 6 || classIdLen > 64 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (ClassId), length should between 6 and 64")
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
	if len(msg.Data.Author) == 0 || msg.Creator != msg.Data.Author {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Data.Author), expect (%s)", msg.Creator)
	}
	if len(msg.Data.Name) > 64 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Data.Name), expect within 64 chars")
	}
	if len(msg.Data.Description) > 1024 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Data.Description), expect within 1024 chars")
	}
	createTime, err := time.Parse(time.RFC3339, msg.Data.CreateTime)
	if err != nil {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Data.CreateTime)", err)
	}
	now := time.Now()
	if createTime.After(now) || createTime.Before(now.Add(-10*time.Hour)) {
		return errors.Wrapf(
			ErrInvalidParam,
			"invalid param (Data.CreateTime: %s), expect within 10 hours (%s to %s)",
			createTime,
			now.Add(-10*time.Hour),
			now,
		)
	}
	if msg.Supply == 0 {
		return errors.Wrapf(ErrInvalidParam, "invalid param (Supply)")
	}
	isImgHashOk, err := checkImgHash(msg.Uri, msg.UriHash, strings.Split(msg.Id, ":")[0])
	if !isImgHashOk {
		return err
	}
	return nil
}
