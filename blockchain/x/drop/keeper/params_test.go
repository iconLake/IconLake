package keeper_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	testkeeper "iconlake/testutil/keeper"
	"iconlake/x/drop/types"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.DropKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
