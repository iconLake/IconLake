package types

import (
	"encoding/binary"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ binary.ByteOrder

const (
	// InfoKeyPrefix is the prefix to retrieve all Info
	InfoKeyPrefix = "Info/value/"
)

// InfoKey returns the store key to retrieve a Info from the index fields
func InfoKey(
	address string,
) []byte {
	var key []byte

	addressBytes, err := sdk.AccAddressFromBech32(address)
	if err != nil {
		panic(ErrAddress)
	}
	key = append(key, addressBytes...)
	key = append(key, []byte("/")...)

	return key
}
