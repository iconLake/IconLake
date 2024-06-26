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
	ErrMint    = sdkerrors.Register(ModuleName, 1103, "mint error")
	ErrInit    = sdkerrors.Register(ModuleName, 1104, "init error")
	ErrFee     = sdkerrors.Register(ModuleName, 1105, "fee error")
)
