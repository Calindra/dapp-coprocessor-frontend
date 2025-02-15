

# export DEV_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
# export RPC_URL=https://organic-invention-jj7p6p76766qhqrvr-8545.app.github.dev/
export RPC_URL=https://1rpc.io/holesky

# forge create \
#   --broadcast \
#   --rpc-url $RPC_URL \
#   --private-key $DEV_PRIVATE_KEY \
#   contracts/NFTPlayers.sol:NFTPlayers

# exit 0

# Codespaces Anvil
# export COPROCESSOR_ADAPTER=0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f;
# export NFT_PLAYERS_ADDRESS=0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07;
# export NFT_PLAYERS_ADDRESS=0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07;

# Holesky Testnet
export COPROCESSOR_ADAPTER=0xb702fF362B0E26a0Dbe2C5dc3fd3904808296d87;
export NFT_PLAYERS_ADDRESS=0x0Ab8cCcE9E29E5F1197b4f39F12fEBD3dB66EA74;

cast send \
    --private-key $DEV_PRIVATE_KEY \
    --rpc-url $RPC_URL \
    $COPROCESSOR_ADAPTER "setNFTPlayersContract(address)" $NFT_PLAYERS_ADDRESS
