import { createWalletClient, custom, WalletClient } from 'viem';
import { hardhat } from 'viem/chains';

declare global {
    interface Window {
        ethereum?: any; // Use 'any' or a more specific type if you prefer
    }
}

let walletClient: WalletClient | undefined

export function getWalletClient() {
    return walletClient
}

export async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            walletClient = createWalletClient({
                chain: hardhat,
                transport: custom(window.ethereum),
            });

            const [account] = await walletClient.requestAddresses();
            console.log('Connected account:', account);

            // Get the current chain ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log('Connected to chain:', parseInt(chainId, 16));
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log('MetaMask is not installed');
    }
}

try {
    connectMetaMask();
} catch (e) {
    console.error(e)
}
