package drop_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	keepertest "iconlake/testutil/keeper"
	"iconlake/testutil/nullify"
	"iconlake/x/drop"
	"iconlake/x/drop/types"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		InfoList: []types.Info{
			{
				Address: "0",
			},
			{
				Address: "1",
			},
		},
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.DropKeeper(t)
	drop.InitGenesis(ctx, *k, genesisState)
	got := drop.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.ElementsMatch(t, genesisState.InfoList, got.InfoList)
	// this line is used by starport scaffolding # genesis/test/assert
}
