package types

// DONTCOVER

import (
	sdkerrors "cosmossdk.io/errors"
)

// x/drop module sentinel errors
var (
	ErrAddress = sdkerrors.Register(ModuleName, 1100, "address error")
	ErrDenom   = sdkerrors.Register(ModuleName, 1101, "denom error")
	ErrAmount  = sdkerrors.Register(ModuleName, 1102, "amount error")
)
