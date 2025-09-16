import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function WalletDebug() {
  const [debugInfo, setDebugInfo] = useState('');
  const { isMetaMaskInstalled, connectWallet } = useWeb3();

  const checkWalletStatus = async () => {
    let info = 'Wallet Debug Information:\n\n';
    
    // Check if MetaMask is installed
    info += `MetaMask Installed: ${isMetaMaskInstalled}\n`;
    
    if (typeof window !== 'undefined') {
      info += `Window.ethereum exists: ${!!window.ethereum}\n`;
      
      if (window.ethereum) {
        info += `Ethereum provider: ${window.ethereum.constructor.name}\n`;
        
        try {
          // Check current accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          info += `Current accounts: ${accounts.length > 0 ? accounts[0] : 'None'}\n`;
          
          // Check current network
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          info += `Current Chain ID: ${chainId} (${parseInt(chainId, 16)})\n`;
          
          // Check if connected to Ganache
          info += `Connected to Ganache: ${chainId === '0x539' ? 'Yes' : 'No'}\n`;
          
        } catch (error) {
          info += `Error checking wallet: ${error.message}\n`;
        }
      }
    }
    
    setDebugInfo(info);
  };

  const testConnection = async () => {
    try {
      const result = await connectWallet();
      setDebugInfo(prev => prev + `\nConnection Test: SUCCESS\nAccount: ${result.account}\nChain ID: ${result.chainId}`);
    } catch (error) {
      setDebugInfo(prev => prev + `\nConnection Test: FAILED\nError: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-md">
      <h3 className="font-bold mb-2">Wallet Debug</h3>
      <div className="space-y-2">
        <button 
          onClick={checkWalletStatus}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Check Status
        </button>
        <button 
          onClick={testConnection}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm ml-2"
        >
          Test Connection
        </button>
      </div>
      {debugInfo && (
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {debugInfo}
        </pre>
      )}
    </div>
  );
}