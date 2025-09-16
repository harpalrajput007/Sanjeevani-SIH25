import { ethers } from 'ethers';

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_herbName", "type": "string"},
      {"internalType": "string", "name": "_quantity", "type": "string"},
      {"internalType": "string", "name": "_ipfsImageHash", "type": "string"},
      {"internalType": "string", "name": "_geoLocation", "type": "string"}
    ],
    "name": "createBatch",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_batchId", "type": "uint256"}],
    "name": "getBatchDetails",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "herbName", "type": "string"},
      {"internalType": "string", "name": "quantity", "type": "string"},
      {"internalType": "string", "name": "ipfsImageHash", "type": "string"},
      {"internalType": "string", "name": "geoLocation", "type": "string"},
      {"internalType": "uint256", "name": "collectionTimestamp", "type": "uint256"},
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_batchId", "type": "uint256"},
      {"internalType": "string", "name": "_newStatus", "type": "string"}
    ],
    "name": "updateBatchStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBatchCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Ganache local network configuration
const GANACHE_CONFIG = {
  chainId: '0x539', // 1337 in hex
  chainName: 'Ganache Local',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:7545'],
  blockExplorerUrls: null,
};

// Contract address (will be set after deployment)
let CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || null;

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Set up provider and signer first
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = accounts[0];

      // Try to switch to Ganache network (optional)
      try {
        await this.switchToGanache();
      } catch (networkError) {
        console.warn('Could not switch to Ganache network:', networkError.message);
        // Continue anyway - user might be on a different network
      }

      // Initialize contract if address is set
      if (CONTRACT_ADDRESS) {
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      }

      const network = await this.provider.getNetwork();
      return {
        account: this.account,
        chainId: Number(network.chainId),
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error(`Failed to connect: ${error.message}`);
    }
  }

  // Switch to Ganache network
  async switchToGanache() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: GANACHE_CONFIG.chainId }],
      });
    } catch (switchError) {
      // Network doesn't exist, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [GANACHE_CONFIG],
          });
        } catch (addError) {
          throw new Error('Failed to add Ganache network');
        }
      } else if (switchError.code === 4001) {
        throw new Error('User rejected network switch');
      } else {
        throw new Error(`Network switch failed: ${switchError.message}`);
      }
    }
  }

  // Set contract address (call this after deployment)
  setContractAddress(address) {
    CONTRACT_ADDRESS = address;
    if (this.signer) {
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
    }
  }

  // Get current account
  async getCurrentAccount() {
    if (!this.provider) return null;
    
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    
    return accounts[0] || null;
  }

  // Create a new batch on blockchain
  async createBatch(herbName, quantity, ipfsHash, geoLocation) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.createBatch(herbName, quantity, ipfsHash, geoLocation);
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        batchId: receipt.logs.length > 0 ? Number(receipt.logs[0].args[0]) : null,
      };
    } catch (error) {
      console.error('Error creating batch:', error);
      throw error;
    }
  }

  // Get batch details from blockchain
  async getBatchDetails(batchId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await this.contract.getBatchDetails(batchId);
      return {
        id: Number(result[0]),
        herbName: result[1],
        quantity: result[2],
        ipfsImageHash: result[3],
        geoLocation: result[4],
        collectionTimestamp: Number(result[5]),
        owner: result[6],
      };
    } catch (error) {
      console.error('Error getting batch details:', error);
      throw error;
    }
  }

  // Update batch status
  async updateBatchStatus(batchId, newStatus) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.updateBatchStatus(batchId, newStatus);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error updating batch status:', error);
      throw error;
    }
  }

  // Get total batch count
  async getBatchCount() {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const count = await this.contract.getBatchCount();
      return Number(count);
    } catch (error) {
      console.error('Error getting batch count:', error);
      throw error;
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  // Listen for chain changes
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }
}

export default new Web3Service();