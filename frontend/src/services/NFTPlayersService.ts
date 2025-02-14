import { createPublicClient, Hex, http, parseAbi } from "viem";
import { getWalletClient } from "./WalletService";
import Chance from 'chance';
import { Player } from "../model/Player";

const chance = new Chance();

const CONTRACT_ADDRESS = `0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1`;

const abi = [
    {
        "inputs": [
            { "internalType": "address", "name": "collector", "type": "address" },
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
    const tokenURI = "https://example.com/metadata/"; // Replace with actual metadata URL
    const name = chance.name();

    const client = createPublicClient({ chain, transport: http() })

    const { request } = await client.simulateContract({
        account,
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "mintNFT",
        args: [collector, tokenURI, name],
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

export async function getNFTs(collector?: Hex) {
    const walletClient = getWalletClient()
    if (!walletClient) {
        alert('Please connect your wallet')
        return
    }
    const { chain } = walletClient as any;
    console.log({ collector, chain })
    const publicClient = createPublicClient({ chain, transport: http() })
    const tokenIds = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: getNFTsABI,
        functionName: 'getAllTokens',
        args: [collector],
    }) as number[];

    const abi = parseAbi([
        'function getName(uint256 tokenId) external view returns (string)',
        'function getLevel(uint256 tokenId) external view returns (uint8)',
        'function getXp(uint256 tokenId) external view returns (uint256)',
    ])
    const players: Player[] = []
    for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i] as any
        const name = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'getName',
            args: [tokenId]
        }) as string;
        const level = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'getLevel',
            args: [tokenId]
        }) as number;
        const xp = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'getXp',
            args: [tokenId]
        });
        players.push({
            id: tokenId.toString(),
            name,
            level,
            position: '',
            xp,
        } as any)
    }
    // const bigIntSerializer = (_key: any, value: any) => {
    //     return typeof value === "bigint" ? value.toString() : value;
    // };
    // console.log(JSON.stringify(players, bigIntSerializer, 4))
    return players
}


// ABI of the function
const mintNFTsAbi = parseAbi([
    'function mintNFTs(address collector, string[] names, string baseTokenURI)'
])

export async function mintNFTs() {
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
    console.log(`mintNFTs`, { contract: CONTRACT_ADDRESS, account, chain })
    const publicClient = createPublicClient({ chain, transport: http() })
    const names = []
    for (let i = 0; i < 8; i++) {
        names.push(chance.name({ gender: 'male' }))
    }
    const { request } = await publicClient.simulateContract({
        account,
        address: CONTRACT_ADDRESS,
        abi: mintNFTsAbi,
        functionName: 'mintNFTs',
        args: [account, names, 'https://example.com/metadata/'],
        gas: BigInt(3_000_000),
    })

    const txHash = await walletClient.writeContract(request as any)
    console.log('Transaction Hash:', txHash)
}