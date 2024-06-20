package keeper

import (
	"context"
	"strconv"

	"iconlake/x/icon/types"

	codecTypes "github.com/cosmos/cosmos-sdk/codec/types"
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

	blockTime := ctx.BlockTime().UnixMilli()

	classInfo, hasClass := k.nftKeeper.GetClass(ctx, msg.ClassId)
	if !hasClass {
		data := types.ClassDataRaw{
			Author:     accAddress,
			CreateTime: blockTime,
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
		var classData types.ClassDataRawI
		err = k.cdc.UnpackAny(classInfo.Data, &classData)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
		var accAuthor sdk.AccAddress = classData.GetAuthor()
		if !accAddress.Equals(accAuthor) {
			err = types.ErrPermission.Wrapf("expected class author is (%s)", accAuthor.String())
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
	}

	iconDataRaw := types.IconDataRaw{
		Author:      accAddress,
		Name:        msg.Name,
		Description: msg.Description,
		CreateTime:  blockTime,
	}
	dataAny, err := codecTypes.NewAnyWithValue(&iconDataRaw)
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
