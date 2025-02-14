// scripts/GLDToken_deploy.js
const { ERC721Portal__factory, IERC721__factory, EtherPortal__factory } = require("@cartesi/rollups");
const hre = require("hardhat");

async function main() {

  const provider = ethers.getDefaultProvider("http://localhost:8545");
  const pk = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  const signer = new ethers.Wallet(pk, provider);

  const dappAddress = '0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e'

  const portalAddress = '0xFfdbe43d4c855BF7e0f105c400A50857f53AB044'
  const etherValue = '10000000000000000'
  const portal = EtherPortal__factory.connect(portalAddress, signer)
  const tx = await portal.depositEther(dappAddress, '0x', { value: etherValue })
  await tx.wait()

  for (let collectionIndex = 0; collectionIndex < 16; collectionIndex++) {
    const NonFunToken = await hre.ethers.getContractFactory("NFTPlayers");
    console.log('Deploying NFTPlayers...', collectionIndex);
    const token = await NonFunToken.deploy();

    await token.deployed();
    console.log("NFTPlayers deployed to:", token.address);
    const nonFunToken = await ethers.getContractAt('NFTPlayers', token.address);

    if (collectionIndex > 0) {
      const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
      let tx = await nonFunToken.mintNFTs(address, ["Player 1", "Player 2"], "http://localhost:3000/nft-metadata/");
      await tx.wait();
      const i = 1
      const name = await nonFunToken.getName(`${i}`)
      const level = await nonFunToken.getLevel(`${i}`)
      console.log({ name, level })
    }
    // for (let i = 0; i < 15; i++) {
    //   console.log(`mint ${i}`)
    //   let tx = await nonFunToken.mintNFT(address, "http://localhost:3000/nft-metadata/", `Player ${i}`);
    //   await tx.wait();
    //   const name = await nonFunToken.getName(`${i}`)
    //   const level = await nonFunToken.getLevel(`${i}`)
    //   console.log({ name, level })
    // }
    // const url = await nonFunToken.tokenURI("1")
    // console.log(url)
  }
}

// module.exports = main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


async function depositERC721(dappAddress, erc721address, erc721id, signer) {
  const portalAddress = '0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87'
  const contract = IERC721__factory.connect(erc721address, signer)
  await contract.approve(portalAddress, erc721id)
  const portal = ERC721Portal__factory.connect(portalAddress, signer)
  const tx = await portal.depositERC721Token(erc721address, dappAddress, erc721id, '0x', '0x')
  await tx.wait()
}