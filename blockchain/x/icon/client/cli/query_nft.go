package cli

import (
	"strconv"

	"iconlake/x/icon/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdNFT() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "nft [class-id] [id]",
		Short: "Query nft",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			reqClassId := args[0]
			reqId := args[1]

			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryNFTRequest{
				ClassId: reqClassId,
				Id:      reqId,
			}

			res, err := queryClient.NFT(cmd.Context(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
