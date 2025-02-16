import { Hex } from "viem";
import { hardhat, holesky } from "viem/chains";

const useCoprocessor = true

// Holesky
const nftPlayersContractAddressProd: Hex = '0x0Ab8cCcE9E29E5F1197b4f39F12fEBD3dB66EA74';
const coprocessorAdapter: Hex = '0xb702fF362B0E26a0Dbe2C5dc3fd3904808296d87';
const rpcUrl = 'https://1rpc.io/holesky';

// Codespaces
// const nftPlayersContractAddressProd: Hex = '0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07';
// const nftPlayersContractAddressProd: Hex = '0x162A433068F51e18b7d13932F27e66a3f99E6890';

// const coprocessorAdapter: Hex = '0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f';


// const coprocessorAdapter: Hex = '0xf7Ad6E7a7019c8Ee2f816D922Be2963E20d4dF7e';
// const coprocessorAdapter: Hex = '0xf67d5f475B37c3fD64E56031833442f0ABd6E60B';
const TestnetTaskIssuer: Hex = '0xff35E413F5e22A9e1Cc02F92dcb78a5076c1aaf3';

// Nonodo v2 config
const DevnetTaskIssuerTask: Hex = '0x95401dc811bb5740090279Ba06cfA8fcF6113778';
const nonodoV2DappAddress: Hex = '0x75135d8ADb7180640d29d822D9AD59E83E8695b2';
const inputBoxAddress: Hex = '0x593E5BCf894D6829Dd26D0810DA7F064406aebB6';
const fakeCoprocessorAdapter: Hex = '0x68B1D87F95878fE05B998F19b66F4baba5De1aed';
const nftPlayersContractAddress: Hex = '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1';
// const rpcUrl = 'https://organic-invention-jj7p6p76766qhqrvr-8545.app.github.dev/';

const config = {
    taskContractAddress: useCoprocessor ? TestnetTaskIssuer : DevnetTaskIssuerTask,
    // taskContractAddress: DevnetTaskIssuerTask,
    nonodoDappAddress: nonodoV2DappAddress,
    inputBoxAddress,
    coprocessorAdapter: useCoprocessor ? coprocessorAdapter : fakeCoprocessorAdapter,
    nftPlayersContractAddress: useCoprocessor ? nftPlayersContractAddressProd : nftPlayersContractAddress,
    useCoprocessor,
    chain: useCoprocessor ? holesky : hardhat,
    // chain: hardhat,
    // rpcUrl: rpcUrl,
    rpcUrl: undefined,
}

export default config