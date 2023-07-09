package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"iconlake/x/iconlake/types"
)

func (k msgServer) MintDrop(goCtx context.Context, msg *types.MsgMintDrop) (*types.MsgMintDropResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgMintDropResponse{}, nil
}
