// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ContractCrab is ReentrancyGuard{
    string private baseTokenURI ;
    uint256 private nextTokenId;
    
    mapping(uint256 => string) private _tokenImages; 

    constructor(string memory _name, string memory _symbol, string memory _baseURI) 
        ERC721(_name, _symbol) 
    {
        baseTokenURI = _baseURI;
        nextTokenId = 20000;
    }

    function mint(string memory imageIPFS) external payable nonReentrant {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _tokenImages[tokenId] = imageIPFS;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function tokenImage(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenImages[tokenId];
    }

}
    
