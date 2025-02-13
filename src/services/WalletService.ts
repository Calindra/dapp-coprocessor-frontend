import { createWalletClient, custom } from 'viem';

declare global {
    interface Window {
        ethereum?: any; // Use 'any' or a more specific type if you prefer
    }
}

export async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const walletClient = createWalletClient({
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

// Call this function when the user clicks a "Connect" button
// connectMetaMask();
