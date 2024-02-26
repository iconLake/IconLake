package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	cdc.RegisterConcrete(&MsgMint{}, "icon/Mint", nil)
	cdc.RegisterConcrete(&MsgUpdateClass{}, "icon/UpdateClass", nil)
	cdc.RegisterConcrete(&MsgBurn{}, "icon/Burn", nil)
	// this line is used by starport scaffolding # 2
}

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgMint{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgUpdateClass{},
	)
	registry.RegisterInterface("icon/IconDataRaw", (*IconDataRawI)(nil))
	registry.RegisterImplementations((*IconDataRawI)(nil), &IconDataRaw{})
	registry.RegisterInterface("icon/ClassDataRaw", (*ClassDataRawI)(nil))
	registry.RegisterImplementations((*ClassDataRawI)(nil), &ClassDataRaw{})
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgBurn{},
	)
	// this line is used by starport scaffolding # 3

	msgservice.RegisterMsgServiceDesc(registry, &_Msg_serviceDesc)
}

var (
	Amino     = codec.NewLegacyAmino()
	ModuleCdc = codec.NewProtoCodec(cdctypes.NewInterfaceRegistry())
)
