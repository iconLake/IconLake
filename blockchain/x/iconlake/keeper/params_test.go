package keeper_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	testkeeper "iconlake/testutil/keeper"
	"iconlake/x/iconlake/types"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.IconlakeKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
