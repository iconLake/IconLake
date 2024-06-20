package cli

import (
	"strconv"

	"iconlake/x/icon/types"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/cosmos/cosmos-sdk/x/nft"
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

func CmdNFTs() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "nfts",
		Short: "query all NFTs of a given class or owner address.",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			owner, err := cmd.Flags().GetString("owner")
			if err != nil {
				return err
			}

			if len(owner) > 0 {
				if _, err := sdk.AccAddressFromBech32(owner); err != nil {
					return err
				}
			}

			classID, err := cmd.Flags().GetString("class-id")
			if err != nil {
				return err
			}

			if len(owner) == 0 && len(classID) == 0 {
				return errors.ErrInvalidRequest.Wrap("must provide at least one of classID or owner")
			}

			request := &nft.QueryNFTsRequest{
				ClassId:    classID,
				Owner:      owner,
				Pagination: pageReq,
			}
			res, err := queryClient.NFTs(cmd.Context(), request)
			if err != nil {
				return err
			}
			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)
	flags.AddPaginationFlagsToCmd(cmd, "nfts")
	cmd.Flags().String("owner", "", "The owner of the nft")
	cmd.Flags().String("class-id", "", "The class-id of the nft")

	return cmd
}
