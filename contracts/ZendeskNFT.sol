// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZendeskNFT is ERC721, Ownable {
    uint256 private _tokenIds;

    constructor(address initialOwner) ERC721("ZendeskNFT", "ZNFT") Ownable(initialOwner) {
        // Constructor body can be empty if no additional initialization is needed
    }

    function mint(address recipient) public onlyOwner returns (uint256) {
        _tokenIds++;
        _mint(recipient, _tokenIds);
        return _tokenIds;
    }
}