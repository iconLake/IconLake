package cli

import (
	"strconv"
	"time"

	"iconlake/x/icon/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdMint() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "mint [class-id] [id] [uri] [uri-hash] [data.author] [data.name] [data.description] [data.create-time] [supply]",
		Short: "Broadcast message mint",
		Args:  cobra.ExactArgs(9),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argClassId := args[0]
			argId := args[1]
			argUri := args[2]
			argUriHash := args[3]
			if err != nil {
				return err
			}
			_, err = time.Parse(time.RFC3339, args[7])
			if err != nil {
				return err
			}
			argData := &types.IconData{
				Author:      args[4],
				Name:        args[5],
				Description: args[6],
				CreateTime:  args[7],
			}
			argSupply, err := cast.ToUint64E(args[8])
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
