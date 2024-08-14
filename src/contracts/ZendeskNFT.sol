// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ZendeskNFT is ERC721, Ownable {
    IERC20 public tokenContract;
    uint256 private _tokenIds;
    uint256 public constant TOKENS_PER_ETH = 200;

    struct NFT {
        string name;
        uint256 price;
        address seller;
    }

    mapping(uint256 => NFT) public nfts;
    mapping(address => bool) public verifiedUsers;

    event NFTCreated(uint256 tokenId, string name, uint256 price, address seller);
    event NFTSold(uint256 tokenId, address buyer, address seller, uint256 price);

    constructor(address _tokenContract) ERC721("ZendeskNFT", "ZNFT") {
        tokenContract = IERC20(_tokenContract);
    }

    function verifyUser(address user) external onlyOwner {
        verifiedUsers[user] = true;
    }

    function createNFT(string memory name, uint256 price) external returns (uint256) {
        require(verifiedUsers[msg.sender], "User not verified");
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _safeMint(msg.sender, newTokenId);
        nfts[newTokenId] = NFT(name, price, msg.sender);
        emit NFTCreated(newTokenId, name, price, msg.sender);
        return newTokenId;
    }

    function buyNFT(uint256 tokenId) external {
        NFT memory nft = nfts[tokenId];
        require(nft.seller != address(0), "NFT does not exist");
        require(msg.sender != nft.seller, "Cannot buy your own NFT");
        
        uint256 tokenAmount = nft.price * TOKENS_PER_ETH;
        require(tokenContract.balanceOf(msg.sender) >= tokenAmount, "Insufficient tokens");
        
        tokenContract.transferFrom(msg.sender, nft.seller, tokenAmount);
        _transfer(nft.seller, msg.sender, tokenId);
        
        emit NFTSold(tokenId, msg.sender, nft.seller, nft.price);
        delete nfts[tokenId];
    }

    function getNFT(uint256 tokenId) external view returns (NFT memory) {
        return nfts[tokenId];
    }
}