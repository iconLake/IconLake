package cli

import (
	"strconv"

	"iconlake/x/icon/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdUpdateClass() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "update-class [id] [name] [symbol] [description] [uri] [uri-hash]",
		Short: "Broadcast message updateClass",
		Args:  cobra.ExactArgs(6),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argId := args[0]
			argName := args[1]
			argSymbol := args[2]
			argDescription := args[3]
			argUri := args[4]
			argUriHash := args[5]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgUpdateClass(
				clientCtx.GetFromAddress().String(),
				argId,
				argName,
				argSymbol,
				argDescription,
				argUri,
				argUriHash,
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
