import { createWalletClient, custom, WalletClient } from 'viem';
import config from '../config/Config';

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
                chain: config.chain,
                transport: custom(window.ethereum),
            });

            const [account] = await walletClient.requestAddresses();
            console.log('Connected account:', account);

            // Get the current chain ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log('Connected to chain:', parseInt(chainId, 16));
            localStorage.setItem("connectedAccount", account);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log('MetaMask is not installed');
    }
}

window.ethereum?.on("accountsChanged", (accounts: string[]) => {
    if (accounts.length > 0) {
        console.log("Switched account:", accounts[0]);
        localStorage.setItem("connectedAccount", accounts[0]);
    } else {
        console.log("Disconnected");
        localStorage.removeItem("connectedAccount");
    }
});

window.addEventListener("DOMContentLoaded", async () => {
    const savedAccount = localStorage.getItem("connectedAccount");
    if (savedAccount) {
        console.log("Restoring connection for:", savedAccount);
        try {
            connectMetaMask();
        } catch (e) {
            console.error(e)
        }
    }
});
