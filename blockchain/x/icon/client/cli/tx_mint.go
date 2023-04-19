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
		Use:   "mint [class-id] [uri] [uri-hash] [data.author] [data.name] [data.description] [data.create-time] [supply]",
		Short: "Broadcast message mint",
		Args:  cobra.ExactArgs(8),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argClassId := args[0]
			argUri := args[1]
			argUriHash := args[2]
			if err != nil {
				return err
			}
			_, err = time.Parse(time.RFC3339, args[6])
			if err != nil {
				return err
			}
			argData := &types.IconData{
				Author:      args[3],
				Name:        args[4],
				Description: args[5],
				CreateTime:  args[6],
			}
			argSupply, err := cast.ToUint64E(args[7])
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
