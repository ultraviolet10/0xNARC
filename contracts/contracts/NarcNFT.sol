// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    // Mapping from token ID to the timestamp of last transfer
    mapping(uint256 => uint256) private lastTransferTimestamp;

    constructor() ERC721("NFT Name", "NFT") {}

    function mint(address recipient)
        public
        returns (uint256)
    {
        currentTokenId.increment();
        uint256 tokenId = currentTokenId.current();
        _safeMint(recipient, tokenId);
        // Set the initial transfer time as the minting time
        lastTransferTimestamp[tokenId] = block.timestamp;
        return tokenId;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
        // Check if the token was transferred in the last 3 months
        require(
            block.timestamp - lastTransferTimestamp[tokenId] >= 3 * 30 days,
            "Transfer not allowed yet"
        );
        // Update the last transfer timestamp
        lastTransferTimestamp[tokenId] = block.timestamp;
    }
}
