package types

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"image"
	"io"
	"net/http"
	"net/url"
	"strings"

	imageHash "github.com/corona10/goimagehash"
	"gopkg.in/gographics/imagick.v2/imagick"
)

type HashType string

const (
	pHash HashType = "p"
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
		return "", "", ErrParam.Wrapf("invalid param (Uri) (%s)", err)
	}
	var img image.Image
	if strings.HasPrefix(resp.Header.Get("Content-Type"), "image/svg+xml") {
		imagick.Initialize()
		defer imagick.Terminate()
		mw := imagick.NewMagickWand()
		defer mw.Destroy()
		err = mw.ReadImageBlob(bodyBytes)
		if err != nil {
			return "", "", ErrParam.Wrapf("invalid param (Uri) (%s)", err)
		}
		mw.SetImageFormat("png")
		pixels, err := mw.ExportImagePixels(0, 0, mw.GetImageWidth(), mw.GetImageHeight(), "RGBA", imagick.PIXEL_CHAR)
		if err != nil {
			return "", "", ErrParam.Wrapf("invalid param (Uri) (%s)", err)
		}
		imgTmp := image.NewRGBA(image.Rect(0, 0, int(mw.GetImageWidth()), int(mw.GetImageHeight())))
		copy(imgTmp.Pix, pixels.([]uint8))
		img = imgTmp
	} else {
		img, _, err = image.Decode(bytes.NewReader(bodyBytes))
		if err != nil {
			return "", "", ErrParam.Wrapf("invalid param (Uri) (%s)", err)
		}
	}
	switch hashType {
	case string(pHash):
		phash, err := imageHash.PerceptionHash(img)
		if err != nil {
			return "", "", err
		}
		hash := sha256.New()
		hash.Write(bodyBytes)
		hashStr := hex.EncodeToString(hash.Sum(nil))
		return phash.ToString(), hashStr, nil
	default:
		return "", "", ErrParam.Wrap("invalid hash type, expect (p)")
	}
}

func GetFileHash(uri string) (fileHash string, e error) {
	_, err := url.ParseRequestURI(uri)
	if err != nil {
		return "", err
	}
	resp, err := http.Get(uri)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", ErrParam.Wrapf("invalid param (Uri) (%s)", err)
	}
	hash := sha256.New()
	hash.Write(bodyBytes)
	hashStr := hex.EncodeToString(hash.Sum(nil))
	return hashStr, nil
}
