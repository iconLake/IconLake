package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "iconlake/testutil/keeper"
	"iconlake/testutil/nullify"
	"iconlake/x/drop/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestInfoQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.DropKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgRaws := createNInfo(keeper, ctx, 2)
	msgs := []types.Info{keeper.ConvertToInfo(msgRaws[0]), keeper.ConvertToInfo(msgRaws[1])}
	tests := []struct {
		desc     string
		request  *types.QueryGetInfoRequest
		response *types.QueryGetInfoResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryGetInfoRequest{
				Address: msgs[0].Address,
			},
			response: &types.QueryGetInfoResponse{Info: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryGetInfoRequest{
				Address: msgs[1].Address,
			},
			response: &types.QueryGetInfoResponse{Info: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryGetInfoRequest{
				Address: "cosmos1xy4yqngt0nlkdcenxymg8tenrghmek4nmqm28k",
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	}
	for _, tc := range tests {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.Info(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}
		})
	}
}

func TestInfoQueryPaginated(t *testing.T) {
	keeper, ctx := keepertest.DropKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgRaws := createNInfo(keeper, ctx, 5)
	var msgs []types.Info
	for _, msgRaw := range msgRaws {
		msgs = append(msgs, keeper.ConvertToInfo(msgRaw))
	}

	request := func(next []byte, offset, limit uint64, total bool) *types.QueryAllInfoRequest {
		return &types.QueryAllInfoRequest{
			Pagination: &query.PageRequest{
				Key:        next,
				Offset:     offset,
				Limit:      limit,
				CountTotal: total,
			},
		}
	}
	t.Run("ByOffset", func(t *testing.T) {
		step := 2
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.InfoAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.Info), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.Info),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.InfoAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.Info), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.Info),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.InfoAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.Info),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.InfoAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
