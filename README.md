# **Cartesi Super Soccer**  

## **Why the Coprocessor?**  

With the coprocessor, we can upgrade players' attributes quickly without needing vouchers.  

The end user will purchase a pack of 8 soccer players (ERC-721).  
Each player will start at a pseudo-random level.  
If you're a hacker, you can choose your player's name and get a better starting level.  

The match leverages [Drand](https://drand.love/), utilizing knowledge from another project.  

At the end of the match, for an AI LLM use case, we compiled the [Ollama](https://ollama.com/) command line for **riscv64**.  
It was a crazy journey! To achieve this compilation, we fixed numerous bugs related to CPU-only mode,  
running it inside the Cartesi Machine with a **backdoor** to explore and debug errors that only occurred within the CM.  
Ollama is a great convenience tool, as you can easily choose from a variety of LLM models.
For our case, we chose [SmolLM](https://huggingface.co/blog/smollm) to run it quickly inside the CM.

## How to Run Locally  

Follow these steps to set up and run the project locally:  

### 1. Deploy the Co-Processor

- Clone and start the [dapp-coprocessor](https://github.com/Calindra/dapp-coprocessor).  
- Deploy the Co-Processor contract and obtain its deployed address.  

### 2. Configure the Frontend

- Open `./frontend/src/config/Config.ts`.  
- Set the `coprocessorAdapter` variable to the deployed Co-Processor contract address.  

### 3. Deploy the NFTPlayers Contract

- Deploy the contract located at `onchain/contracts/NFTPlayers.sol`.  
- Update `nftPlayersContractAddress` in `Config.ts` with the deployed contract address.  

### 4. Link the Contracts

After deploying both contracts, call `setNFTPlayersContract` to link them. You can use the example script below:  

```js
const coprocessorAdapter = `0x`; // Replace with deployed Co-Processor contract address
const nftPlayersAddress = `0x`; // Replace with deployed NFTPlayers contract address

const contractABI = [
  {
    "inputs": [{ "internalType": "address", "name": "nftAddress", "type": "address" }],
    "name": "setNFTPlayersContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const { request } = await createPublicClient({ chain: hardhat, transport: http() }).simulateContract({
    address: coprocessorAdapter,
    abi: contractABI,
    functionName: 'setNFTPlayersContract',
    args: [nftPlayersAddress],
    gas: BigInt(2_000_000),
});

await wallet.writeContract(request);
```

**Note:** You can find a working example in `./onchain/scripts/addXp.js`.  

### 5. Start the Frontend

Run the following commands to install dependencies and start the frontend:  

```sh
cd ./frontend
npm install
npm run dev
```
