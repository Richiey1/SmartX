// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CredentialNFT
 * @dev Soulbound (non-transferable) NFT representing a worker's income credential.
 */
contract CredentialNFT is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    struct Credential {
        uint256 totalIncome;
        uint256 periodStart;
        uint256 periodEnd;
        string category; // e.g., "Annual Income 2025"
    }

    mapping(uint256 => Credential) public credentials;

    event CredentialMinted(address indexed worker, uint256 tokenId, string category);

    constructor() ERC721("GigID Credential", "GIGID") Ownable(msg.sender) {}

    /**
     * @dev Mints a new soulbound credential NFT to a worker.
     * @param worker The address of the gig worker.
     * @param totalIncome The aggregated income amount for the period.
     * @param periodStart Start timestamp of the income period.
     * @param periodEnd End timestamp of the income period.
     * @param category A label for the credential.
     */
    function mintCredential(
        address worker,
        uint256 totalIncome,
        uint256 periodStart,
        uint256 periodEnd,
        string calldata category
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(worker, tokenId);

        credentials[tokenId] = Credential({
            totalIncome: totalIncome,
            periodStart: periodStart,
            periodEnd: periodEnd,
            category: category
        });

        emit CredentialMinted(worker, tokenId, category);
        return tokenId;
    }

    /**
     * @dev Soulbound implementation: override transfer functions to prevent movement.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("GIGID: Non-transferable credential");
        }
        return super._update(to, tokenId, auth);
    }
}
