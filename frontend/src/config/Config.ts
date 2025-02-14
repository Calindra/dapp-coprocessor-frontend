import { Hex } from "viem";

// const taskContractAddress: Hex = '0x95401dc811bb5740090279Ba06cfA8fcF6113778';
// const nonodoDappAddress: Hex = '0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e';
// const inputBoxAddress: Hex = '0x59b22D57D4f067708AB0c00552767405926dc768';

// Nonodo v2 config
const DevnetTaskIssuerTask: Hex = '0x95401dc811bb5740090279Ba06cfA8fcF6113778';
const nonodoV2DappAddress: Hex = '0x75135d8ADb7180640d29d822D9AD59E83E8695b2';
const inputBoxAddress: Hex = '0x593E5BCf894D6829Dd26D0810DA7F064406aebB6';
const fakeCoprocessorAdapter: Hex = '0x68B1D87F95878fE05B998F19b66F4baba5De1aed';

const config = {
    taskContractAddress: DevnetTaskIssuerTask,
    nonodoDappAddress: nonodoV2DappAddress,
    inputBoxAddress,
    coprocessorAdapter: fakeCoprocessorAdapter,
}

export default config