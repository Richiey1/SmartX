# GigID Smart Contracts - Deployment Guide

This guide provides step-by-step instructions for deploying and verifying GigID smart contracts on Base Mainnet and testnet.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Testing](#testing)
4. [Deployment](#deployment)
5. [Contract Verification](#contract-verification)
6. [Post-Deployment](#post-deployment)

## Prerequisites

- Node.js v18+ and npm/yarn
- Hardhat installed globally: `npm install -g hardhat`
- Base network configured in Hardhat
- Private key for deployment account
- BaseScan API key for contract verification

## Environment Setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in required variables:
   - `PRIVATE_KEY`: Your deployment account's private key
   - `BASE_RPC_URL`: RPC URL for Base network
   - `ETHERSCAN_API_KEY`: BaseScan API key

3. Install dependencies:
   ```bash
   npm install
   ```

## Testing

### Run All Tests

```bash
npx hardhat test
```

### Run Specific Test Suite

```bash
npx hardhat test test/smartx.test.ts
```

### Run Tests with Coverage Report

```bash
npx hardhat coverage
```

Expected coverage target: **>95%**

### Test Scenarios Covered

The test suite (`test/smartx.test.ts`) includes:

#### IncomeRegistry Tests (40+ cases)
- ✅ Deployment verification
- ✅ Verifier management (add/remove)
- ✅ Income recording with validation
- ✅ Event emission verification
- ✅ Access control checks
- ✅ Multiple records per worker
- ✅ Timestamp verification
- ✅ Data retrieval functions

#### CredentialNFT Tests (20+ cases)
- ✅ Deployment verification
- ✅ Credential minting
- ✅ Soulbound enforcement
- ✅ Transfer prevention
- ✅ ERC721 enumerable functions
- ✅ Owner management

#### Integration Tests
- ✅ Full workflow: Record income → Mint credential
- ✅ Multiple workers with separate records

## Deployment

### Deploy to Base Sepolia (Testnet)

```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

### Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.ts --network base
```

### Manual Deployment Steps

```bash
# 1. Compile contracts
npx hardhat compile

# 2. Deploy IncomeRegistry
npx hardhat run --network base scripts/deploy/IncomeRegistry.ts

# 3. Deploy CredentialNFT
npx hardhat run --network base scripts/deploy/CredentialNFT.ts

# 4. Save contract addresses to config
```

## Contract Verification

### Verify on BaseScan

After deployment, verify contracts for transparency:

```bash
# Verify IncomeRegistry
npx hardhat verify --network base <INCOME_REGISTRY_ADDRESS>

# Verify CredentialNFT
npx hardhat verify --network base <CREDENTIAL_NFT_ADDRESS>
```

### Programmatic Verification

The deployment script automatically attempts to verify contracts:

```bash
npx hardhat run scripts/deploy.ts --network base
```

## Post-Deployment

### 1. Verify Deployment

```bash
npx hardhat run scripts/verify.ts --network base
```

### 2. Set Verifiers (IncomeRegistry)

Add authorized verifiers to the IncomeRegistry:

```bash
npx hardhat run scripts/setVerifiers.ts --network base \
  --verifier-addresses "0x123...,0x456..."
```

### 3. Update Configuration

Update frontend `.env.local` with deployed contract addresses:

```env
NEXT_PUBLIC_INCOME_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_CREDENTIAL_NFT_ADDRESS=0x...
```

### 4. Monitor Deployment

Check contract status:

```bash
# View contract on BaseScan
https://basescan.org/address/0x...

# Check initialization
npx hardhat run scripts/checkStatus.ts --network base
```

## Deployed Contracts

### Base Mainnet (8453)

| Contract | Address | Explorer |
|----------|---------|----------|
| IncomeRegistry | `0x...` | [BaseScan](https://basescan.org/address/0x...) |
| CredentialNFT | `0x...` | [BaseScan](https://basescan.org/address/0x...) |

### Base Sepolia Testnet (84532)

| Contract | Address | Explorer |
|----------|---------|----------|
| IncomeRegistry | `0x...` | [BaseScan](https://sepolia.basescan.org/address/0x...) |
| CredentialNFT | `0x...` | [BaseScan](https://sepolia.basescan.org/address/0x...) |

## Troubleshooting

### "Insufficient balance" Error

- Ensure your deployment account has enough ETH for gas
- Request testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### "Already verified" Error

The contract is already verified on BaseScan. This is not an error.

### "Network not found" Error

Configure the network in `hardhat.config.ts`:

```typescript
networks: {
  base: {
    url: process.env.BASE_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
  },
  baseSepolia: {
    url: process.env.BASE_SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
  },
}
```

### RPC Rate Limiting

If you hit rate limits, use a different RPC provider:
- Alchemy: https://www.alchemy.com
- Infura: https://www.infura.io
- QuickNode: https://www.quicknode.com

## Security Best Practices

1. **Never expose private keys** - Use secure key management
2. **Test on testnet first** - Always deploy to Sepolia before mainnet
3. **Audit contracts** - Have code reviewed before mainnet
4. **Use hardware wallets** - For mainnet deployments
5. **Verify addresses** - Double-check contract addresses after deployment
6. **Monitor events** - Watch for unauthorized activities

## Support

For issues during deployment:

1. Check Hardhat documentation: https://hardhat.org
2. Review Base documentation: https://docs.base.org
3. Check contract event logs on BaseScan
4. Open an issue with deployment logs and error messages

## Additional Resources

- [Hardhat Documentation](https://hardhat.org)
- [Base Documentation](https://docs.base.org)
- [BaseScan](https://basescan.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com)
- [Solidity Documentation](https://docs.soliditylang.org)
