import { createPublicClient, http, parseAbi, Hex, parseAbiItem, decodeAbiParameters, toHex, keccak256 } from 'viem';
import { getWalletClient } from './WalletService';
import config from '../config/Config';
import { GameResult } from '../model/GameResult';
import { Team } from '../model/Team';
import { RunMatchRequest } from '../model/RunMatchRequest';

const contractAbi = parseAbi([
    "function runExecution(bytes input) external"
]);

const contractInputBoxAbi = parseAbi([
    "function addInput(address appContract, bytes calldata payload)"
]);


export function countPlayers(team?: Team | null) {
    if (!team) {
        return 0
    }
    return team.attack.length + team.defense.length + team.middle.length + 1
}

export async function callRunExecution(req: RunMatchRequest) {
    try {
        const bigIntSerializer = (_key: any, value: any) => {
            return typeof value === "bigint" ? value.toString() : value;
        };
        const str = JSON.stringify(req, bigIntSerializer)
        const inputData = toHex(str)
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
        if (config.useCoprocessor) {
            const { request } = await createPublicClient({ chain, transport: http(config.rpcUrl) }).simulateContract({
                address: config.coprocessorAdapter,
                abi: contractAbi,
                functionName: 'runExecution',
                args: [inputData],
                account,
                gas: BigInt(2_000_000),
            });
            const txHash = await walletClient.writeContract(request as any);
            console.log('Transaction sent:', txHash);
        } else {
            const { request } = await createPublicClient({ chain, transport: http(config.rpcUrl) }).simulateContract({
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
        return await watchEvent(req.reqId);
    } catch (error) {
        console.error('Error calling runExecution:', error);
    }
}

export async function watchEvent(reqId: string): Promise<GameResult> {
    const reqIdBytes = '0x' + reqId.replace(/-/g, '')
    return new Promise((resolve, reject) => {
        const walletClient = getWalletClient()
        if (!walletClient) {
            console.log(`No wallet connected`)
            return
        }
        const { chain } = walletClient as any;
        const client = createPublicClient({ chain, transport: http(config.rpcUrl) })
        const unwatch = client.watchEvent({
            address: config.coprocessorAdapter,
            event: parseAbiItem('event ResultReceived(bytes32 payloadHash, bytes output)'),
            onLogs: (logs: any) => {
                console.log('>>> Event detected:', logs.length);
                for (const log of logs) {
                    try {
                        const [_payloadHash, output] = decodeAbiParameters(
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
                                { type: 'uint32' },
                                { type: 'bytes16' },
                            ],
                            output
                        ) as any;
                        const tokenIds = decodedOutput[0] as bigint[];
                        const xpAmounts = decodedOutput[1] as bigint[];
                        const goalsA = decodedOutput[2] as number | undefined;
                        const goalsB = decodedOutput[3] as number | undefined;
                        const uuidBytes = decodedOutput[4] as `0x${string}`;
                        console.log('Token IDs:', tokenIds);
                        console.log('XP Amounts:', xpAmounts);
                        console.log('Goals A:', goalsA);
                        console.log('Goals B:', goalsB);
                        console.log('uuidBytes: ', uuidBytes);
                        console.log('reqIdBytes', reqIdBytes);
                        if (reqIdBytes === uuidBytes) {
                            resolve({ goalsA, goalsB, tokenIds, xpAmounts })
                        }
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

