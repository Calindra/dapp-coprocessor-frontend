import { createPublicClient, http, parseAbi, Hex } from 'viem';
import { getWalletClient } from './WalletService';

// Replace with your contract address
const contractAddress = '0x95401dc811bb5740090279Ba06cfA8fcF6113778';
const nonodoDappAddress = '0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e';
const inputBoxAddress = '0x59b22D57D4f067708AB0c00552767405926dc768';

// ABI for `runExecution`
const contractAbi = parseAbi([
    "function runExecution(bytes input) external"
]);

const contractInputBoxAbi = parseAbi([
    "function addInput(address appContract, bytes calldata payload)"
]);
const useCoprocessor = false
// Function to call `runExecution`
export async function callRunExecution(inputData: Hex) {
    try {
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
        if (useCoprocessor) {
            const { request } = await createPublicClient({ chain, transport: http() }).simulateContract({
                address: contractAddress,
                abi: contractAbi,
                functionName: 'runExecution',
                args: [inputData],
                account,
                gas: BigInt(2_000_000),
            });
            const txHash = await walletClient.writeContract(request as any);
            console.log('Transaction sent:', txHash);
        } else {
            const { request } = await createPublicClient({ chain, transport: http() }).simulateContract({
                address: inputBoxAddress,
                abi: contractInputBoxAbi,
                functionName: 'addInput',
                args: [nonodoDappAddress, inputData],
                account,
                gas: BigInt(2_000_000),
            });
            const txHash = await walletClient.writeContract(request as any);
            console.log('Transaction sent:', txHash);
        }
    } catch (error) {
        console.error('Error calling runExecution:', error);
    }
}
