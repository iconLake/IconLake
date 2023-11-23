package keeper

import (
	"context"

	"iconlake/x/icon/types"

	codecTypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/nft"
)

func (k msgServer) UpdateClass(goCtx context.Context, msg *types.MsgUpdateClass) (*types.MsgUpdateClassResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	accAddress, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		k.Logger(ctx).Error(err.Error())
		return nil, err
	}

	classInfo, hasClass := k.nftKeeper.GetClass(ctx, msg.Id)
	if !hasClass {
		data := types.ClassDataRaw{
			Author:     accAddress,
			CreateTime: ctx.BlockTime().UnixMilli(),
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
		var classData types.ClassDataRawI
		err := k.cdc.UnpackAny(classInfo.Data, &classData)
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
