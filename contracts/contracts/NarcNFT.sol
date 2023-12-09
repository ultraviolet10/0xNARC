// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Time lock duration (3 months in seconds)
    uint256 public constant lockDuration = 3 * 30 days;

    // Mapping from token ID to the timestamp when it was minted
    mapping(uint256 => uint256) private mintTimestamps;

    constructor() ERC721("OxNARC Badge", "0xNARC") {}

    // Override the transferFrom function
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            block.timestamp >= mintTimestamps[tokenId] + lockDuration,
            "Token is locked and cannot be transferred yet"
        );
        super.transferFrom(from, to, tokenId);
    }

    // Override the safeTransferFrom function
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            block.timestamp >= mintTimestamps[tokenId] + lockDuration,
            "Token is locked and cannot be transferred yet"
        );
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    // Public function to mint tokens
    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId);
        mintTimestamps[tokenId] = block.timestamp;
    }
}
