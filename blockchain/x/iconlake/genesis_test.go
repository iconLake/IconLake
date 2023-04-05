package iconlake_test

import (
	"testing"

	keepertest "iconlake/testutil/keeper"
	"iconlake/testutil/nullify"
	"iconlake/x/iconlake"
	"iconlake/x/iconlake/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		AccountList: []types.Account{
			{
				AccAddress: []byte("0"),
			},
			{
				AccAddress: []byte("1"),
			},
		},
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.IconlakeKeeper(t)
	iconlake.InitGenesis(ctx, *k, genesisState)
	got := iconlake.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.ElementsMatch(t, genesisState.AccountList, got.AccountList)
	// this line is used by starport scaffolding # genesis/test/assert
}
