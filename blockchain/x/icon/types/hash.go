package types

import (
	"bytes"
	"crypto/sha256"
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

	_ "golang.org/x/image/bmp"
	_ "golang.org/x/image/tiff"
	_ "golang.org/x/image/webp"

	imageHash "github.com/corona10/goimagehash"
	"github.com/gabriel-vasile/mimetype"
	"gopkg.in/gographics/imagick.v2/imagick"
)

type HashType string

const (
	pHash HashType = "p"
)

var httpClient = &http.Client{
	Timeout: time.Minute * 10,
}

func GetFile(uri string) (file []byte, e error) {
	_, err := url.ParseRequestURI(uri)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest("GET", uri, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "iconlake")
	res, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return bodyBytes, nil
}

func GetImgHash(uri string, hashType string) (graphHash string, fileHash string, e error) {
	bodyBytes, err := GetFile(uri)
	if err != nil {
		return "", "", ErrParam.Wrapf("invalid param (Uri) (%s)", err)
	}
	var img image.Image
	if strings.HasPrefix(mimetype.Detect(bodyBytes).String(), "image/svg+xml") {
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
	bodyBytes, err := GetFile(uri)
	if err != nil {
		return "", ErrParam.Wrapf("invalid param (Uri) (%s)", err)
	}
	hash := sha256.New()
	hash.Write(bodyBytes)
	hashStr := hex.EncodeToString(hash.Sum(nil))
	return hashStr, nil
}

func CheckHash(uri string, uriHash string, id string) (bool, error) {
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
