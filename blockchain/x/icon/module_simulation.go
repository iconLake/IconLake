package icon

import (
	"math/rand"

	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
	"iconlake/testutil/sample"
	iconsimulation "iconlake/x/icon/simulation"
	"iconlake/x/icon/types"
)

// avoid unused import issue
var (
	_ = sample.AccAddress
	_ = iconsimulation.FindAccount
	_ = simulation.MsgEntryKind
	_ = baseapp.Paramspace
	_ = rand.Rand{}
)

const (
	opWeightMsgMint = "op_weight_msg_mint"
	// TODO: Determine the simulation weight value
	defaultWeightMsgMint int = 100

	opWeightMsgUpdateClass = "op_weight_msg_update_class"
	// TODO: Determine the simulation weight value
	defaultWeightMsgUpdateClass int = 100

	opWeightMsgBurn = "op_weight_msg_burn"
	// TODO: Determine the simulation weight value
	defaultWeightMsgBurn int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module.
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	iconGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&iconGenesis)
}

// RegisterStoreDecoder registers a decoder.
func (am AppModule) RegisterStoreDecoder(_ sdk.StoreDecoderRegistry) {}

// ProposalContents doesn't return any content functions for governance proposals.
func (AppModule) ProposalContents(_ module.SimulationState) []simtypes.WeightedProposalContent {
	return nil
}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	operations := make([]simtypes.WeightedOperation, 0)

	var weightMsgMint int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgMint, &weightMsgMint, nil,
		func(_ *rand.Rand) {
			weightMsgMint = defaultWeightMsgMint
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgMint,
		iconsimulation.SimulateMsgMint(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgUpdateClass int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgUpdateClass, &weightMsgUpdateClass, nil,
		func(_ *rand.Rand) {
			weightMsgUpdateClass = defaultWeightMsgUpdateClass
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgUpdateClass,
		iconsimulation.SimulateMsgUpdateClass(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgBurn int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgBurn, &weightMsgBurn, nil,
		func(_ *rand.Rand) {
			weightMsgBurn = defaultWeightMsgBurn
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgBurn,
		iconsimulation.SimulateMsgBurn(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}

// ProposalMsgs returns msgs used for governance proposals for simulations.
func (am AppModule) ProposalMsgs(simState module.SimulationState) []simtypes.WeightedProposalMsg {
	return []simtypes.WeightedProposalMsg{
		simulation.NewWeightedProposalMsg(
			opWeightMsgMint,
			defaultWeightMsgMint,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				iconsimulation.SimulateMsgMint(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgUpdateClass,
			defaultWeightMsgUpdateClass,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				iconsimulation.SimulateMsgUpdateClass(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgBurn,
			defaultWeightMsgBurn,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				iconsimulation.SimulateMsgBurn(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		// this line is used by starport scaffolding # simapp/module/OpMsg
	}
}
