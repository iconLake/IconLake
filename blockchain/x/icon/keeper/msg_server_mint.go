package keeper

import (
	"context"
	"strconv"
	"time"

	"iconlake/x/icon/types"

	codecTypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/nft"
)

func (k msgServer) Mint(goCtx context.Context, msg *types.MsgMint) (*types.MsgMintResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	isHashOk, err := types.CheckHash(msg.Uri, msg.UriHash, msg.Id)
	if !isHashOk {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	createTime, err := time.Parse(time.RFC3339, msg.Data.CreateTime)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}
	blockTime := ctx.BlockTime()
	if createTime.After(blockTime) || createTime.Before(blockTime.Add(-10*time.Hour)) {
		err = types.ErrParam.Wrapf("createTime invalid")
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	msg.Data.Author = msg.Creator
	msg.Data.CreateTime = blockTime.Format(time.RFC3339)

	classInfo, hasClass := k.nftKeeper.GetClass(ctx, msg.ClassId)
	if !hasClass {
		data := types.ClassData{
			Author:     msg.Creator,
			CreateTime: blockTime.Format(time.RFC3339),
		}
		dataAny, err := codecTypes.NewAnyWithValue(&data)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
		err = k.nftKeeper.SaveClass(ctx, nft.Class{
			Id:   msg.ClassId,
			Data: dataAny,
		})
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
	} else {
		var classData types.ClassDataI
		err = k.cdc.UnpackAny(classInfo.Data, &classData)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
		if classData.GetAuthor() != msg.Creator {
			err = types.ErrPermission.Wrapf("expected class author is (%s)", classData.GetAuthor())
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
	}

	dataAny, err := codecTypes.NewAnyWithValue(msg.Data)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}
	if msg.Supply > 1 {
		for i := 0; i < int(msg.Supply); i++ {
			err = k.nftKeeper.Mint(ctx, nft.NFT{
				ClassId: msg.ClassId,
				Id:      msg.Id + ":" + strconv.Itoa(i),
				Uri:     msg.Uri,
				UriHash: msg.UriHash,
				Data:    dataAny,
			}, accAddress)
			if err != nil {
				k.Logger(ctx).Error(err.Error())
				return nil, err
			}
		}
	} else {
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
	}

	return &types.MsgMintResponse{}, nil
}
