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
	accAddress sdk.AccAddress,
) []byte {
	var key []byte

	key = append(key, accAddress...)
	key = append(key, []byte("/")...)

	return key
}
