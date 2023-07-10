package icon_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	keepertest "iconlake/testutil/keeper"
	"iconlake/testutil/nullify"
	"iconlake/x/icon"
	"iconlake/x/icon/types"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.IconKeeper(t)
	icon.InitGenesis(ctx, *k, genesisState)
	got := icon.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
