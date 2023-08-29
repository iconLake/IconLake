package keeper

import (
	"context"
	"time"

	"iconlake/x/icon/types"

	codecTypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/nft"
)

func (k msgServer) UpdateClass(goCtx context.Context, msg *types.MsgUpdateClass) (*types.MsgUpdateClassResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	classInfo, hasClass := k.nftKeeper.GetClass(ctx, msg.Id)
	if !hasClass {
		data := types.ClassData{
			Author:     msg.Creator,
			CreateTime: ctx.BlockTime().Format(time.RFC3339),
		}
		dataAny, err := codecTypes.NewAnyWithValue(&data)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
		err = k.nftKeeper.SaveClass(ctx, nft.Class{
			Id:          msg.Id,
			Name:        msg.Name,
			Symbol:      msg.Symbol,
			Description: msg.Description,
			Uri:         msg.Uri,
			UriHash:     msg.UriHash,
			Data:        dataAny,
		})
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
	} else {
		var classData types.ClassDataI
		err := k.cdc.UnpackAny(classInfo.Data, &classData)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
		if classData.GetAuthor() != msg.Creator {
			err = types.ErrPermission.Wrapf("expected class author is (%s)", classData.GetAuthor())
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
		err = k.nftKeeper.UpdateClass(ctx, nft.Class{
			Id:          msg.Id,
			Name:        msg.Name,
			Symbol:      msg.Symbol,
			Description: msg.Description,
			Uri:         msg.Uri,
			UriHash:     msg.UriHash,
			Data:        classInfo.Data,
		})
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			return nil, err
		}
	}

	return &types.MsgUpdateClassResponse{}, nil
}
