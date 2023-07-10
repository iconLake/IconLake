package types

// DONTCOVER

import (
	"cosmossdk.io/errors"
)

// x/icon module sentinel errors
var (
	ErrParam      = errors.Register(ModuleName, 1200, "param error")
	ErrPermission = errors.Register(ModuleName, 1201, "permission error")
)
