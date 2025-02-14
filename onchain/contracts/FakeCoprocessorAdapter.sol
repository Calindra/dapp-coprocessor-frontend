// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INFTPlayers {
    function addXp(uint256 tokenId, uint256 amount) external;
}

contract FakeCoprocessorAdapter {
    INFTPlayers public nftContract;

    event ResultReceived(bytes32 payloadHash, bytes output);

    /**
     * protect it in the future
     */
    function setNFTPlayersContract(address nftAddress) public {
        nftContract = INFTPlayers(nftAddress);
    }

    function handleNotice(
        bytes32 payloadHash,
        bytes memory notice
    ) public {
        (uint256[] memory tokenIds, uint256[] memory xpAmounts) = abi.decode(
            notice,
            (uint256[], uint256[])
        );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            nftContract.addXp(tokenIds[i], xpAmounts[i]);
        }
        emit ResultReceived(payloadHash, notice);
    }
}
