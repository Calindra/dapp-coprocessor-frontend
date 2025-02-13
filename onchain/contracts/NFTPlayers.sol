// contracts/NonFunToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTPlayers is ERC721, ERC721Enumerable, Ownable {
    // Constructor will be called on contract creation
    constructor() ERC721("NFTPlayers", "NONFUN") {}

    address private authority;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint8) private _levels;
    mapping(uint256 => string) private _names;
    uint256 private _currentTokenId;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getAllTokens(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }

    /**
     * make it better in the future
     */
    function getRandomNumber(uint256 tokenId) external view returns (uint8) {
        uint256 randomHash = uint256(
            keccak256(abi.encodePacked(tokenId, block.number, msg.sender))
        );
        return uint8((randomHash % 5) + 1); // Ensures a number between 1 and 5
    }

    function getName(uint256 tokenId) external view returns (string memory) {
        return _names[tokenId];
    }

    function getLevel(uint256 tokenId) external view returns (uint8) {
        return _levels[tokenId];
    }

    /**
     * @dev Sets the authority of the contract to mint new NFTs
     */
    function setAuthority(address _authority) public onlyOwner {
        authority = _authority;
    }

    function getAuthority() public view returns (address) {
        return authority;
    }

    function mintNFTs(
        address collector,
        string[] memory names,
        string memory baseTokenURI
    ) public {
        // require(
        //     authority == msg.sender || owner() == msg.sender,
        //     "Only the authority can mint NFTs"
        // );
        uint256 tokenId;
        for (uint256 i = 0; i < names.length; i++) {
            // this.mintNFT(collector, baseTokenURI, names[i]);
            tokenId = totalSupply(); // Gets the next token ID based on current supply
            _safeMint(collector, tokenId);
            _tokenURIs[tokenId] = baseTokenURI;
            _levels[tokenId] = this.getRandomNumber(tokenId);
            _names[tokenId] = names[i];
        }
    }

    function mintNFT(
        address collector,
        string memory _tokenURI,
        string memory name
    ) public returns (uint256) {
        // require(
        //     authority == msg.sender || owner() == msg.sender,
        //     "Only the authority can mint NFTs"
        // );
        _currentTokenId++; // Increment before minting
        uint256 newTokenId = _currentTokenId;

        _safeMint(collector, newTokenId);
        _tokenURIs[newTokenId] = _tokenURI;
        _levels[newTokenId] = this.getRandomNumber(newTokenId);
        _names[newTokenId] = name;

        return newTokenId; // Return the newly minted token ID
    }

    function getLastTokenId() public view returns (uint256) {
        return _currentTokenId;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return
            string(
                abi.encodePacked(
                    _tokenURIs[tokenId],
                    Strings.toString(tokenId),
                    ".json"
                )
            );
    }
}
