const { createPublicClient, encodeAbiParameters, http, createWalletClient, parseAbi } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { hardhat } = require('viem/chains');

const nftPlayersAddress = '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1';
const fakeCoAdapterAddress = '0x68B1D87F95878fE05B998F19b66F4baba5De1aed';

const contractABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "payloadHash", "type": "bytes32" },
      { "internalType": "bytes", "name": "notice", "type": "bytes" }
    ],
    "name": "handleNotice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "nftAddress", "type": "address" }],
    "name": "setNFTPlayersContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  }
];

const tokenIds = [1n, 2n, 3n];
const xpAmounts = [100n, 200n, 300n];

const encodedNotice = encodeAbiParameters(
  [
    { type: 'uint256[]' },
    { type: 'uint256[]' },
  ],
  [tokenIds, xpAmounts]
);

const payloadHash = `0x11223344c39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`;
const privateKey = `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`;

const account = privateKeyToAccount(privateKey);
const wallet = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
});

async function setNFTPlayersContract() {
  const { request } = await createPublicClient({ chain: hardhat, transport: http() }).simulateContract({
    address: fakeCoAdapterAddress,
    abi: contractABI,
    functionName: 'setNFTPlayersContract',
    args: [nftPlayersAddress],
    gas: BigInt(2_000_000),
  });
  const txHash = await wallet.writeContract(request);
  console.log('setNFTPlayersContract TX Hash:', txHash);
}

async function sendNoticeToContract() {
  const { request } = await createPublicClient({ chain: hardhat, transport: http() }).simulateContract({
    address: fakeCoAdapterAddress,
    abi: contractABI,
    functionName: 'handleNotice',
    args: [payloadHash, encodedNotice],
    gas: BigInt(2_000_000),
  });
  const txHash = await wallet.writeContract(request);
  console.log('sendNoticeToContract TX Hash:', txHash);
}

async function getLevel(tokenId) {
  const abi = parseAbi([
    'function getName(uint256 tokenId) external view returns (string)',
    'function getLevel(uint256 tokenId) external view returns (uint32)',
    'function getXp(uint256 tokenId) external view returns (uint256)'
  ])
  const publicClient = createPublicClient({ chain: hardhat, transport: http() })
  const name = await publicClient.readContract({
    address: nftPlayersAddress,
    abi,
    functionName: 'getName',
    args: [tokenId]
  })
  const xp = await publicClient.readContract({
    address: nftPlayersAddress,
    abi,
    functionName: 'getXp',
    args: [tokenId]
  })
  console.log({ name, xp })
  const level = await publicClient.readContract({
    address: nftPlayersAddress,
    abi,
    functionName: 'getLevel',
    args: [tokenId]
  })
  console.log({ name, level })
}

async function main() {
  await getLevel(1n)
  await getLevel(2n)
  await setNFTPlayersContract()
  await sendNoticeToContract()
  await getLevel(1n)
  await getLevel(2n)
}

main()
