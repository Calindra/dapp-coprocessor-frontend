import { createPublicClient, Hex, http } from "viem";
import { getWalletClient } from "./WalletService";
import Chance from 'chance';

const chance = new Chance();

const CONTRACT_ADDRESS = `0x1F2C6E90F3DF741E0191eAbB1170f0B9673F12b3`;

const abi = [
    {
        "inputs": [
            { "internalType": "address", "name": "collector", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "string", "name": "_tokenURI", "type": "string" },
            { "internalType": "string", "name": "name", "type": "string" }
        ],
        "name": "mintNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLastTokenId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export async function mintNFT() {
    const walletClient = getWalletClient()
    if (!walletClient) {
        alert('Please connect your wallet')
        return
    }
    const [account] = await walletClient.requestAddresses();
    if (!account) {
        alert('No account found. Please connect your wallet.');
        return;
    }
    const { chain } = walletClient as any;
    const collector = account;
    const tokenId = BigInt(1); // Replace with desired tokenId
    const tokenURI = "https://example.com/metadata/"; // Replace with actual metadata URL
    const name = chance.name();

    const client = createPublicClient({ chain, transport: http() })

    const { request } = await client.simulateContract({
        account,
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "mintNFT",
        args: [collector, tokenId, tokenURI, name],
        gas: BigInt(2_000_000),
    });

    const txHash = await walletClient.writeContract(request as any);
    console.log("Transaction sent! Hash:", txHash);
}

const getNFTsABI = [
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "getAllTokens",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    }
];

export async function getNFTs(ownerAddress?: Hex) {
    const walletClient = getWalletClient()
    if (!walletClient) {
        alert('Please connect your wallet')
        return
    }
    const [account] = await walletClient.requestAddresses();
    if (!account) {
        alert('No account found. Please connect your wallet.');
        return;
    }
    const { chain } = walletClient as any;
    const publicClient = createPublicClient({ chain, transport: http() })
    const tokenIds = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: getNFTsABI,
        functionName: 'getAllTokens',
        args: [ownerAddress ?? account],
    });

    console.log('Owned NFTs:', tokenIds);
}