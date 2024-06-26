package types

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// DefaultIndex is the default global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		InfoList: []Info{},
		// this line is used by starport scaffolding # genesis/types/default
		Params: DefaultParams(),
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	// Check for duplicated index in info
	infoIndexMap := make(map[string]struct{})

	for _, elem := range gs.InfoList {
		accAddress, err := sdk.AccAddressFromBech32(elem.Address)
		if err != nil {
			return err
		}
		index := string(InfoKey(accAddress))
		if _, ok := infoIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for info")
		}
		infoIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate

	return gs.Params.Validate()
}
