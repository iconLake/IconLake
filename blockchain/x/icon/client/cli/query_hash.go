package cli

import (
	"strconv"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
	"iconlake/x/icon/types"
)

var _ = strconv.Itoa(0)

func CmdHash() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "hash [hash-type] [uri]",
		Short: "Query hash",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			reqHashType := args[0]
			reqUri := args[1]

			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryHashRequest{

				HashType: reqHashType,
				Uri:      reqUri,
			}

			res, err := queryClient.Hash(cmd.Context(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
