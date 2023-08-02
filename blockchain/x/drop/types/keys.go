package types

const (
	// ModuleName defines the module name
	ModuleName = "drop"

	// Denom
	DropDenom = "udrop"
	LakeDenom = "ulake"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_drop"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
