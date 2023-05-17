package types

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"image"
	"io"
	"net/http"
	"net/url"
	"strings"

	"cosmossdk.io/errors"
	imageHash "github.com/corona10/goimagehash"
	"gopkg.in/gographics/imagick.v3/imagick"
)

func GetImgHash(uri string, hashType string) (graphHash string, fileHash string, e error) {
	_, err := url.ParseRequestURI(uri)
	if err != nil {
		return "", "", err
	}
	resp, err := http.Get(uri)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", "", errors.Wrapf(err, "invalid param (Uri)")
	}
	var img image.Image
	if strings.HasPrefix(resp.Header.Get("Content-Type"), "image/svg+xml") {
		imagick.Initialize()
		defer imagick.Terminate()
		mw := imagick.NewMagickWand()
		defer mw.Destroy()
		err = mw.ReadImageBlob(bodyBytes)
		if err != nil {
			return "", "", errors.Wrapf(err, "invalid param (Uri)")
		}
		mw.SetImageFormat("png")
		pixels, err := mw.ExportImagePixels(0, 0, mw.GetImageWidth(), mw.GetImageHeight(), "RGBA", imagick.PIXEL_CHAR)
		if err != nil {
			return "", "", errors.Wrapf(err, "invalid param (Uri)")
		}
		imgTmp := image.NewRGBA(image.Rect(0, 0, int(mw.GetImageWidth()), int(mw.GetImageHeight())))
		copy(imgTmp.Pix, pixels.([]uint8))
		img = imgTmp
	} else {
		img, _, err = image.Decode(bytes.NewReader(bodyBytes))
		if err != nil {
			return "", "", errors.Wrapf(err, "invalid param (Uri)")
		}
	}
	switch hashType {
	case "p":
		phash, err := imageHash.PerceptionHash(img)
		if err != nil {
			return "", "", err
		}
		hash := sha1.New()
		hash.Write(bodyBytes)
		hashStr := hex.EncodeToString(hash.Sum(nil))
		return phash.ToString(), hashStr, nil
	default:
		return "", "", errors.Wrapf(errors.Error{}, "invalid hash type, expect (p)")
	}
}
