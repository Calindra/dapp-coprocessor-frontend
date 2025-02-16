import { createPublicClient, http, parseAbi, Hex, parseAbiItem, decodeAbiParameters, toHex, keccak256 } from 'viem';
import { getWalletClient } from './WalletService';
import config from '../config/Config';
import { GameResultI } from '../model/GameResult';
import { Team } from '../model/Team';
import { RunMatchRequest } from '../model/RunMatchRequest';

const LOCAL_BLOCK_NUMBER_KEY = 'localBlockNum';

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
        const publicClient = createPublicClient({ chain, transport: http(config.rpcUrl) })
        const block = await publicClient.getBlockNumber()
        localStorage.setItem(LOCAL_BLOCK_NUMBER_KEY, block.toString(10));
        const watchPromise = watchEvent(req.reqId, block.toString(10));
        if (config.useCoprocessor) {
            const { request } = await publicClient.simulateContract({
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
            const { request } = await publicClient.simulateContract({
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
        return await watchPromise;
    } catch (error) {
        console.error('Error calling runExecution:', error);
    }
}

async function fetchPastLogs(reqId: string, fromBlock: string, toBlock: string): Promise<GameResultI | undefined> {
    console.log('fetchPastLogs fromBlock', fromBlock)
    const reqIdBytes = '0x' + reqId.replace(/-/g, '')
    const client = createPublicClient({ chain: config.chain, transport: http(config.rpcUrl) })
    const logs = await client.getLogs({
        address: config.coprocessorAdapter,
        event: parseAbiItem('event ResultReceived(bytes32 payloadHash, bytes output)'),
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
    })
    localStorage.setItem(LOCAL_BLOCK_NUMBER_KEY, toBlock)
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
            console.log('uuidBytes: ', uuidBytes);
            console.log('reqIdBytes', reqIdBytes);
            if (reqIdBytes === uuidBytes) {
                console.log('Token IDs:', tokenIds);
                console.log('XP Amounts:', xpAmounts);
                console.log('Goals A:', goalsA);
                console.log('Goals B:', goalsB);
                return { goalsA, goalsB, tokenIds, xpAmounts }
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export async function watchEvent(reqId: string, fromBlock?: string): Promise<GameResultI> {
    const client = createPublicClient({ chain: config.chain, transport: http(config.rpcUrl) })
    if (!fromBlock) {
        fromBlock = localStorage.getItem(LOCAL_BLOCK_NUMBER_KEY) || '';
        if (!fromBlock) {
            fromBlock = (await client.getBlockNumber()).toString(10);
            localStorage.setItem(LOCAL_BLOCK_NUMBER_KEY, fromBlock);
        }
    }
    while (true) {
        const lastBlock = (await client.getBlockNumber()).toString(10);
        const event = await fetchPastLogs(reqId, fromBlock, lastBlock)
        if (event) {
            return event
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    // const reqIdBytes = '0x' + reqId.replace(/-/g, '')
    // return new Promise((resolve, reject) => {
    //     const unwatch = client.watchEvent({
    //         address: config.coprocessorAdapter,
    //         event: parseAbiItem('event ResultReceived(bytes32 payloadHash, bytes output)'),
    //         onLogs: (logs: any) => {
    //             console.log('>>> Event detected:', logs.length);
    //             for (const log of logs) {
    //                 try {
    //                     const [_payloadHash, output] = decodeAbiParameters(
    //                         [
    //                             { type: 'bytes32' },
    //                             { type: 'bytes' }
    //                         ],
    //                         log.data
    //                     );
    //                     const decodedOutput = decodeAbiParameters(
    //                         [
    //                             { type: 'uint256[]' },
    //                             { type: 'uint256[]' },
    //                             { type: 'uint32' },
    //                             { type: 'uint32' },
    //                             { type: 'bytes16' },
    //                         ],
    //                         output
    //                     ) as any;
    //                     const tokenIds = decodedOutput[0] as bigint[];
    //                     const xpAmounts = decodedOutput[1] as bigint[];
    //                     const goalsA = decodedOutput[2] as number | undefined;
    //                     const goalsB = decodedOutput[3] as number | undefined;
    //                     const uuidBytes = decodedOutput[4] as `0x${string}`;
    //                     console.log('Token IDs:', tokenIds);
    //                     console.log('XP Amounts:', xpAmounts);
    //                     console.log('Goals A:', goalsA);
    //                     console.log('Goals B:', goalsB);
    //                     console.log('uuidBytes: ', uuidBytes);
    //                     console.log('reqIdBytes', reqIdBytes);
    //                     if (reqIdBytes === uuidBytes) {
    //                         resolve({ goalsA, goalsB, tokenIds, xpAmounts })
    //                     }
    //                 } catch (e) {
    //                     console.error(e)
    //                     reject(e)
    //                 }
    //             }
    //             unwatch()
    //         },
    //     });
    //     console.log(`Listening events for coprocessorAdapter=${config.coprocessorAdapter}`)
    // })

}

