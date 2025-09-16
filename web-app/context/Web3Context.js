import { createContext, useContext, useState, useEffect } from 'react';
import Web3Service from '../utils/web3';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Check if already connected on mount
  useEffect(() => {
    setIsMetaMaskInstalled(Web3Service.isMetaMaskInstalled());
    checkConnection();
    setupEventListeners();
  }, []);

  const checkConnection = async () => {
    try {
      if (Web3Service.isMetaMaskInstalled()) {
        const currentAccount = await Web3Service.getCurrentAccount();
        if (currentAccount) {
          setAccount(currentAccount);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const setupEventListeners = () => {
    Web3Service.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    });

    Web3Service.onChainChanged((chainId) => {
      setChainId(chainId);
      window.location.reload(); // Reload to reset state
    });
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const result = await Web3Service.connectWallet();
      setAccount(result.account);
      setChainId(result.chainId);
      setIsConnected(true);
      return result;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    Web3Service.disconnect();
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
  };

  const createBatch = async (herbName, quantity, ipfsHash, geoLocation) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    return await Web3Service.createBatch(herbName, quantity, ipfsHash, geoLocation);
  };

  const getBatchDetails = async (batchId) => {
    return await Web3Service.getBatchDetails(batchId);
  };

  const updateBatchStatus = async (batchId, newStatus) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    return await Web3Service.updateBatchStatus(batchId, newStatus);
  };

  const getBatchCount = async () => {
    return await Web3Service.getBatchCount();
  };

  const setContractAddress = (address) => {
    Web3Service.setContractAddress(address);
  };

  const value = {
    account,
    isConnected,
    isLoading,
    chainId,
    connectWallet,
    disconnect,
    createBatch,
    getBatchDetails,
    updateBatchStatus,
    getBatchCount,
    setContractAddress,
    isMetaMaskInstalled,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};