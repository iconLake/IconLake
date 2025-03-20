package cli

import (
	"iconlake/x/icon/types"
	"strings"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

func CmdUpdateCreator() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "update-creator [address] [name] [description] [avatar] [avatar-hash] [medias] [sex] [birthday] [location]",
		Short: "Update a creator",
		Args:  cobra.ExactArgs(9),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			address := args[0]

			// Get value arguments
			argName := args[1]
			argDescription := args[2]
			argAvatar := args[3]
			argAvatarHash := args[4]

			medias := strings.Split(args[5], listSeparator)
			var argMedias []*types.Media
			for _, media := range medias {
				parts := strings.Split(media, ":")
				argMedias = append(argMedias, &types.Media{
					Name:    parts[0],
					Content: parts[1],
				})
			}

			argSex := args[6]
			argBirthday := args[7]
			argLocation := args[8]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgUpdateCreator(
				address,
				argName,
				argDescription,
				argAvatar,
				argAvatarHash,
				argMedias,
				argSex,
				argBirthday,
				argLocation,
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

func CmdDeleteCreator() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "delete-creator [address]",
		Short: "Delete a creator",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			address := args[0]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgDeleteCreator(
				address,
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
