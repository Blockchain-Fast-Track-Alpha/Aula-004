import { ethers } from "hardhat";

const ERC20NAME = "Potato";
const ERC20Symbol = "POT";

async function main() {
  const addr = await ethers.getSigners();
  const ownerAddr = await addr[0].getAddress();
  const MyERC20HolderContractFactory = await ethers.getContractFactory(
    "MyERC20Holder"
  );
  const ERC20ContractFactory = await ethers.getContractFactory(
    "ERC20"
  );
  const MyERC20HolderContract = await MyERC20HolderContractFactory.deploy(
    ERC20NAME,
    ERC20Symbol
  );
  await MyERC20HolderContract.deployed();
  console.log(MyERC20HolderContract.deployTransaction.data);
  console.log(MyERC20HolderContract.deployTransaction.data.length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
