package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// CreatorKeyPrefix is the prefix to retrieve all Creator
	CreatorKeyPrefix = "Creator/value/"
)

// CreatorKey returns the store key to retrieve a Creator from the index fields
func CreatorKey(
	address []byte,
) []byte {
	var key []byte

	key = append(key, address...)
	key = append(key, []byte("/")...)

	return key
}
