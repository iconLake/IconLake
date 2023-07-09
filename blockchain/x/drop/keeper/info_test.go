package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	keepertest "iconlake/testutil/keeper"
	"iconlake/testutil/nullify"
	"iconlake/x/drop/keeper"
	"iconlake/x/drop/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNInfo(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.Info {
	items := make([]types.Info, n)
	for i := range items {
		items[i].Address = strconv.Itoa(i)

		keeper.SetInfo(ctx, items[i])
	}
	return items
}

func TestInfoGet(t *testing.T) {
	keeper, ctx := keepertest.DropKeeper(t)
	items := createNInfo(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetInfo(ctx,
			item.Address,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestInfoRemove(t *testing.T) {
	keeper, ctx := keepertest.DropKeeper(t)
	items := createNInfo(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveInfo(ctx,
			item.Address,
		)
		_, found := keeper.GetInfo(ctx,
			item.Address,
		)
		require.False(t, found)
	}
}

func TestInfoGetAll(t *testing.T) {
	keeper, ctx := keepertest.DropKeeper(t)
	items := createNInfo(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllInfo(ctx)),
	)
}
