package keeper_test

import (
	"encoding/binary"
	"strconv"
	"testing"

	keepertest "iconlake/testutil/keeper"
	"iconlake/testutil/nullify"
	"iconlake/x/drop/keeper"
	"iconlake/x/drop/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNInfo(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.InfoRaw {
	items := make([]types.InfoRaw, n)
	for i := range items {
		buf := make([]byte, 20, 0x0101010101)
		binary.BigEndian.PutUint64(buf, uint64(i))
		items[i].AccAddress = buf
		keeper.SetInfo(ctx, items[i])
	}
	return items
}

func TestInfoGet(t *testing.T) {
	keeper, ctx := keepertest.DropKeeper(t)
	items := createNInfo(keeper, ctx, 10)
	for _, itemRaw := range items {
		item := keeper.ConvertToInfo(itemRaw)
		rst, found := keeper.GetInfo(ctx,
			itemRaw.AccAddress,
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
			item.AccAddress,
		)
		_, found := keeper.GetInfo(ctx,
			item.AccAddress,
		)
		require.False(t, found)
	}
}

func TestInfoGetAll(t *testing.T) {
	keeper, ctx := keepertest.DropKeeper(t)
	itemRaws := createNInfo(keeper, ctx, 10)
	var items []types.Info
	for _, itemRaw := range itemRaws {
		items = append(items, keeper.ConvertToInfo(itemRaw))
	}
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllInfo(ctx)),
	)
}
