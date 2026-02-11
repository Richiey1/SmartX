# GigID Smart Contracts Architecture

## Overview

GigID smart contracts provide on-chain income credentials for gig workers. The architecture consists of two main contracts that work together to create a verifiable income identification system.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GigID System                          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐          ┌──────────────────┐     │
│  │  IncomeRegistry  │          │  CredentialNFT   │     │
│  │  (Records Layer) │◄────────►│   (Identity)     │     │
│  └──────────────────┘          └──────────────────┘     │
│         ▲                               ▲                │
│         │                               │                │
│    Records Income              Issues Credentials        │
│    from Attestations          Based on Records           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Contract Details

### 1. IncomeRegistry

**Purpose:** Records and manages verified income events on-chain

**Key Features:**
- Stores income records with metadata
- Access control via authorized verifiers
- Immutable audit trail
- Selective data retrieval

**Key Functions:**

```solidity
// Record new income event
function recordIncome(
  address worker,
  uint256 amount,
  string calldata source,
  bytes32 attestationId
) external onlyAuthorized

// Retrieve all income records for a worker
function getWorkerIncomes(address worker) 
  external view returns (IncomeRecord[] memory)

// Get total count of records
function getIncomeCount(address worker) 
  external view returns (uint256)

// Manage verifier access
function setVerifierStatus(address verifier, bool status) 
  external onlyOwner
```

**Data Structure:**

```solidity
struct IncomeRecord {
    uint256 amount;              // Income amount
    string source;               // Platform (e.g., "Uber")
    uint256 timestamp;           // When recorded
    bytes32 attestationId;       // Off-chain attestation ID
    bool verified;               // Verification status
}
```

**Access Control:**
- **Owner:** Contract deployer, manages verifiers
- **Authorized Verifiers:** Can record income events
- **Workers:** Subjects of income records (passive)
- **Public:** Can retrieve own or authorized data

**Events:**

```solidity
event IncomeRecorded(
    address indexed worker,
    uint256 amount,
    string source,
    bytes32 attestationId
);

event VerifierStatusChanged(
    address indexed verifier,
    bool authorized
);
```

### 2. CredentialNFT

**Purpose:** Issues soulbound (non-transferable) income credentials

**Key Features:**
- ERC-721 standard compliance
- Soulbound (non-transferable) enforcement
- Enumerable token support
- Aggregated credential metadata
- Worker ownership verification

**Key Functions:**

```solidity
// Mint credential to worker
function mintCredential(
    address worker,
    uint256 totalIncome,
    uint256 periodStart,
    uint256 periodEnd,
    string calldata category
) external onlyOwner returns (uint256)

// Retrieve credential metadata
function credentials(uint256 tokenId) 
  external view returns (Credential memory)

// Standard ERC-721 functions
function ownerOf(uint256 tokenId)
function balanceOf(address worker)
function totalSupply()
```

**Data Structure:**

```solidity
struct Credential {
    uint256 totalIncome;      // Aggregated income amount
    uint256 periodStart;      // Period start timestamp
    uint256 periodEnd;        // Period end timestamp
    string category;          // Credential category
}
```

**Access Control:**
- **Owner:** Contract deployer, can mint credentials
- **Workers:** Can hold and verify credentials (non-transferable)
- **Public:** Can verify credential existence

**Events:**

```solidity
event CredentialMinted(
    address indexed worker,
    uint256 tokenId,
    string category
);

// Standard ERC-721 events inherited
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
event Approval(address indexed owner, address indexed spender, uint256 indexed tokenId);
```

## Data Flow

### 1. Income Recording Flow

```
External Verifier
       │
       ├─ Call: recordIncome(worker, amount, source, attestationId)
       │
    IncomeRegistry
       │
       ├─ Validate inputs
       ├─ Check authorization
       ├─ Store IncomeRecord
       ├─ Emit IncomeRecorded event
       │
       └─► Immutable ledger created
```

### 2. Credential Issuance Flow

```
Contract Owner
       │
       ├─ Query: getWorkerIncomes(worker)
       │
    IncomeRegistry
       │
       ├─ Return aggregated records
       │
Contract Owner
       │
       ├─ Call: mintCredential(worker, totalIncome, ...)
       │
    CredentialNFT
       │
       ├─ Validate inputs
       ├─ Mint NFT to worker
       ├─ Store credential metadata
       ├─ Emit CredentialMinted event
       │
       └─► Non-transferable proof created
```

## Security Model

### Access Control

| Function | Owner | Verifier | Worker | Public |
|----------|-------|----------|--------|--------|
| recordIncome | ✅ | ✅ | ❌ | ❌ |
| getWorkerIncomes | ✅ | ✅ | ✅ | ✅ |
| setVerifierStatus | ✅ | ❌ | ❌ | ❌ |
| mintCredential | ✅ | ❌ | ❌ | ❌ |
| transferCredential | ❌ | ❌ | ❌ | ❌ |

### Attack Prevention

1. **Invalid Worker Address**
   - Validation: `worker != address(0)`
   - Impact: Prevents records to null account

2. **Zero Amount Recording**
   - Validation: `amount > 0`
   - Impact: Ensures meaningful income records

3. **Unauthorized Recording**
   - Validation: `onlyAuthorized` modifier
   - Impact: Only approved verifiers can record

4. **Token Transfers**
   - Soulbound: `_update` override prevents movement
   - Impact: Credentials cannot be sold/traded

5. **Reentrancy**
   - No external calls in state-changing functions
   - Impact: No reentrancy vulnerability

## Testing Strategy

### Unit Tests (60+ cases)

**IncomeRegistry:**
- Verifier management
- Income recording validation
- Access control enforcement
- Event emission
- Data retrieval

**CredentialNFT:**
- Minting functionality
- Soulbound enforcement
- ERC-721 compliance
- Ownership verification

### Integration Tests

- Record → Mint workflow
- Multi-worker scenarios
- Complete credential lifecycle

### Coverage

Target: **>95% code coverage**

Run with:
```bash
npx hardhat coverage
```

## Performance Considerations

### Gas Optimization

1. **Storage Layout**
   - Packed structs for reduced storage slots
   - uint256 used for temporal data

2. **Function Design**
   - View functions for data retrieval
   - Minimal state mutations

3. **Event Usage**
   - Comprehensive event logging
   - Enables off-chain indexing

### Scalability

1. **Array-Based Storage**
   - Per-worker income arrays
   - Efficient for most use cases
   - Consider indexer for large-scale queries

2. **Enumerable Support**
   - ERC721Enumerable for credential tracking
   - Enables portfolio queries

## Future Enhancements

1. **Privacy-Preserving Proofs**
   - ZK-SNARKs for income range verification
   - Hide exact amounts while proving range

2. **Cross-Chain Support**
   - Bridged credentials on other networks
   - Unified identity across chains

3. **DeFi Integration**
   - Use credentials for lending
   - Automated underwriting

4. **Marketplace**
   - Credential display
   - Lender portal integration

## Deployment Checklist

- [ ] All tests passing (>95% coverage)
- [ ] Code reviewed for security
- [ ] Gas optimization reviewed
- [ ] Contracts compiled without warnings
- [ ] Environment variables configured
- [ ] Deployment script tested on testnet
- [ ] Contract verification script ready
- [ ] Monitoring/alerting configured
- [ ] Emergency pause mechanism ready (if needed)
- [ ] Backup of private keys secured

## References

- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Security Guidelines](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [Base Documentation](https://docs.base.org)
