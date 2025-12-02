const { ethers } = require('ethers');

// Sepolia RPC endpoint
const ETH_RPC = process.env.NEXT_PUBLIC_ETH_RPC_URL || process.env.NEXT_PUBLIC_POLYGON_RPC_URL;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS;

// Minimal ERC20 ABI for transfer events
const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function decimals() view returns (uint8)'
];

async function verifyTransaction(txHash, expectedAmount, expectedToken, expectedReceiver) {
  try {
    const provider = new ethers.JsonRpcProvider(ETH_RPC);

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return { valid: false, error: 'Transaction not found' };
    }

    // Check if transaction was successful
    if (receipt.status !== 1) {
      return { valid: false, error: 'Transaction failed' };
    }

    // Parse transfer logs
    const contract = new ethers.Contract(expectedToken, ERC20_ABI, provider);
    const decimals = await contract.decimals();

    // Find Transfer event in logs
    const transferLog = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'Transfer';
      } catch {
        return false;
      }
    });

    if (!transferLog) {
      return { valid: false, error: 'No transfer event found' };
    }

    const parsedLog = contract.interface.parseLog(transferLog);
    const transferredAmount = ethers.formatUnits(parsedLog.args.value, decimals);
    const transferredTo = parsedLog.args.to.toLowerCase();

    // Validate amount and receiver
    const amountValid = parseFloat(transferredAmount) >= parseFloat(expectedAmount);
    const receiverValid = transferredTo === expectedReceiver.toLowerCase();

    if (!amountValid || !receiverValid) {
      return {
        valid: false,
        error: 'Amount or receiver mismatch',
        details: {
          expected: { amount: expectedAmount, receiver: expectedReceiver },
          actual: { amount: transferredAmount, receiver: transferredTo }
        }
      };
    }

    return {
      valid: true,
      txHash,
      amount: transferredAmount,
      receiver: transferredTo,
      blockNumber: receipt.blockNumber
    };

  } catch (error) {
    console.error('Verification error:', error);
    return { valid: false, error: error.message };
  }
}

async function getTokenBalance(address, tokenAddress, provider) {
  try {
    const contract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
      provider
    );

    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();

    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Balance check error:', error);
    return '0';
  }
}

module.exports = {
  verifyTransaction,
  getTokenBalance
};