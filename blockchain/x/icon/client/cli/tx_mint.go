package cli

import (
	"strconv"

	"encoding/json"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
	"iconlake/x/icon/types"
)

var _ = strconv.Itoa(0)

func CmdMint() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "mint [class-id] [id] [uri] [uri-hash] [data] [supply]",
		Short: "Broadcast message mint",
		Args:  cobra.ExactArgs(6),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argClassId := args[0]
			argId := args[1]
			argUri := args[2]
			argUriHash := args[3]
			argData := new(types.IconData)
			err = json.Unmarshal([]byte(args[4]), argData)
			if err != nil {
				return err
			}
			argSupply, err := cast.ToUint64E(args[5])
			if err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgMint(
				clientCtx.GetFromAddress().String(),
				argClassId,
				argId,
				argUri,
				argUriHash,
				argData,
				argSupply,
			)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
