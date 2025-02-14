import { createPublicClient, http, parseAbi, Hex, parseAbiItem, decodeAbiParameters } from 'viem';
import { getWalletClient } from './WalletService';
import config from '../config/Config';
import { GameResult } from '../model/GameResult';

const contractAbi = parseAbi([
    "function runExecution(bytes input) external"
]);

const contractInputBoxAbi = parseAbi([
    "function addInput(address appContract, bytes calldata payload)"
]);

const useCoprocessor = false

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
                address: config.taskContractAddress,
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
                address: config.inputBoxAddress,
                abi: contractInputBoxAbi,
                functionName: 'addInput',
                args: [config.nonodoDappAddress, inputData],
                account,
                gas: BigInt(2_000_000),
            });
            const txHash = await walletClient.writeContract(request as any);
            console.log('Transaction sent:', txHash);
        }
        return await watchEvent();
    } catch (error) {
        console.error('Error calling runExecution:', error);
    }
}

export async function watchEvent(): Promise<GameResult> {
    return new Promise((resolve, reject) => {
        const walletClient = getWalletClient()
        if (!walletClient) {
            console.log(`No wallet connected`)
            return
        }
        const { chain } = walletClient as any;
        const client = createPublicClient({ chain, transport: http() })
        const unwatch = client.watchEvent({
            address: config.coprocessorAdapter,
            event: parseAbiItem('event ResultReceived(bytes32 payloadHash, bytes output)'),
            onLogs: (logs: any) => {
                console.log('>>> Event detected:', logs.length);
                for (const log of logs) {
                    try {
                        const [payloadHash, output] = decodeAbiParameters(
                            [
                                { type: 'bytes32' },
                                { type: 'bytes' }
                            ],
                            log.data
                        );
                        const decodedOutput = decodeAbiParameters(
                            [
                                { type: 'uint256[]' },
                                { type: 'uint256[]' },
                                { type: 'uint32' },
                                { type: 'uint32' }
                            ],
                            output
                        ) as any;
                        const tokenIds = decodedOutput[0] as bigint[];
                        const xpAmounts = decodedOutput[1] as bigint[];
                        const goalsA = decodedOutput[2] as number | undefined; // Handle undefined case
                        const goalsB = decodedOutput[3] as number | undefined; // Handle undefined case
    
                        console.log('Token IDs:', tokenIds);
                        console.log('XP Amounts:', xpAmounts);
                        console.log('Goals A:', goalsA);
                        console.log('Goals B:', goalsB);
                        resolve({ goalsA, goalsB, tokenIds, xpAmounts })
                    } catch (e) {
                        console.error(e)
                        reject(e)
                    }
                }
                unwatch()
            },
        });
        console.log(`Listening events for coprocessorAdapter=${config.coprocessorAdapter}`)
    })
    
}

