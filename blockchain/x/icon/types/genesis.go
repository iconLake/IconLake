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
		CreatorList: []Creator{},
		// this line is used by starport scaffolding # genesis/types/default
		Params: DefaultParams(),
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	// Check for duplicated index in creator
	creatorIndexMap := make(map[string]struct{})

	for _, elem := range gs.CreatorList {
		accAddress, err := sdk.AccAddressFromBech32(elem.Address)
		if err != nil {
			return err
		}
		index := string(CreatorKey(accAddress))
		if _, ok := creatorIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for creator")
		}
		creatorIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate

	return gs.Params.Validate()
}
