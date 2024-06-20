package types

import (
	"fmt"

	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	"gopkg.in/yaml.v2"
)

var (
	KeyInitAmount       = []byte("InitAmount")
	KeyMinAmountPerMint = []byte("MinAmountPerMint")
	KeyMaxAmountPerMint = []byte("MaxAmountPerMint")
)

var _ paramtypes.ParamSet = (*Params)(nil)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(initAmount, minAmountPerMint, maxAmountPerMint int64) Params {
	return Params{
		initAmount,
		minAmountPerMint,
		maxAmountPerMint,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(100000, 10000, 600000)
}

func ValidateAmount(i interface{}) error {
	_, ok := i.(int64)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", i)
	}
	if i.(int64) < 0 {
		return fmt.Errorf("amount must be larger than or equal to 0: %d", i)
	}
	return nil
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyInitAmount, &p.InitAmount, ValidateAmount),
		paramtypes.NewParamSetPair(KeyMinAmountPerMint, &p.MinAmountPerMint, ValidateAmount),
		paramtypes.NewParamSetPair(KeyMaxAmountPerMint, &p.MaxAmountPerMint, ValidateAmount),
	}
}

// Validate validates the set of params
func (p Params) Validate() error {
	if p.MaxAmountPerMint < p.MinAmountPerMint {
		return fmt.Errorf("max amount per mint (%d) must be larger than or equal to min amount per mint (%d)", p.MaxAmountPerMint, p.MinAmountPerMint)
	}
	return nil
}

// String implements the Stringer interface.
func (p Params) String() string {
	out, _ := yaml.Marshal(p)
	return string(out)
}
