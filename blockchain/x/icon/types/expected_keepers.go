package types

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/cosmos/cosmos-sdk/x/nft"
)

type NftKeeper interface {
	HasClass(ctx sdk.Context, classID string) bool
	SaveClass(ctx sdk.Context, class nft.Class) error
	UpdateClass(ctx sdk.Context, class nft.Class) error
	GetClass(ctx sdk.Context, classID string) (nft.Class, bool)
	HasNFT(ctx sdk.Context, classID, nftID string) bool
	GetNFT(ctx sdk.Context, classID, nftID string) (nft.NFT, bool)
	Mint(ctx sdk.Context, token nft.NFT, receiver sdk.AccAddress) error
	Burn(ctx sdk.Context, classID string, nftID string) error
	NFTs(goCtx context.Context, req *nft.QueryNFTsRequest) (*nft.QueryNFTsResponse, error)
	Classes(goCtx context.Context, req *nft.QueryClassesRequest) (*nft.QueryClassesResponse, error)
	GetOwner(ctx sdk.Context, classID string, nftID string) sdk.AccAddress
	// Methods imported from nft should be defined here
}

// AccountKeeper defines the expected account keeper used for simulations (noalias)
type AccountKeeper interface {
	GetAccount(ctx sdk.Context, addr sdk.AccAddress) types.AccountI
	// Methods imported from account should be defined here
}

// BankKeeper defines the expected interface needed to retrieve account balances.
type BankKeeper interface {
	SpendableCoins(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins
	// Methods imported from bank should be defined here
}
