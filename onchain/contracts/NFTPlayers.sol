// contracts/NonFunToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTPlayers is ERC721, Ownable {
    // Constructor will be called on contract creation
    constructor() ERC721("NFTPlayers", "NONFUN") {}

    address private authority;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint8) private _levels;

    function getRandomNumber(uint256 tokenId) external view returns (uint8) {
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(tokenId, block.number, msg.sender)
            )
        );
        return uint8((randomHash % 5) + 1); // Ensures a number between 1 and 5
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

    function mintNFT(
        address collector,
        uint256 tokenId,
        string memory _tokenURI
    ) public {
        require(
            authority == msg.sender || owner() == msg.sender,
            "Only the authority can mint NFTs"
        );
        _safeMint(collector, tokenId);
        _tokenURIs[tokenId] = _tokenURI;
        _levels[tokenId] = this.getRandomNumber(tokenId);
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
