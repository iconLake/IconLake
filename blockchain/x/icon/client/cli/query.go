package cli

import (
	"fmt"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"

	"iconlake/x/icon/types"
)

// GetQueryCmd returns the cli query commands for this module
func GetQueryCmd(queryRoute string) *cobra.Command {
	// Group icon queries under a subcommand
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("Querying commands for the %s module", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	cmd.AddCommand(CmdQueryParams())
	cmd.AddCommand(CmdNFT())
	cmd.AddCommand(CmdNFTs())
	cmd.AddCommand(CmdClass())
	cmd.AddCommand(CmdClasses())

	cmd.AddCommand(CmdCreators())
	cmd.AddCommand(CmdCreator())
	// this line is used by starport scaffolding # 1

	return cmd
}
