package keeper

import (
	"context"
	"time"

	"iconlake/x/icon/types"

	codec "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/nft"
)

func (k msgServer) Mint(goCtx context.Context, msg *types.MsgMint) (*types.MsgMintResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	if !k.nftKeeper.HasClass(ctx, msg.ClassId) {
		data := types.ClassData{
			CreateTime: time.Now().Format(time.RFC3339),
		}
		dataAny, err := codec.NewAnyWithValue(&data)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
		k.nftKeeper.SaveClass(ctx, nft.Class{
			Id:   msg.ClassId,
			Data: dataAny,
		})
	}

	dataAny, err := codec.NewAnyWithValue(msg.Data)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}
	err = k.nftKeeper.Mint(ctx, nft.NFT{
		ClassId: msg.ClassId,
		Id:      msg.Id,
		Uri:     msg.Uri,
		UriHash: msg.UriHash,
		Data:    dataAny,
	}, accAddress)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	_ = ctx

	return &types.MsgMintResponse{}, nil
}
