package types

// DONTCOVER

import (
	"cosmossdk.io/errors"
)

// x/icon module sentinel errors
var (
	ErrInvalidParam = errors.Register(ModuleName, 1100, "invalid param error")
)
