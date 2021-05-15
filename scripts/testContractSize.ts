import { ethers } from "hardhat";

const ERC20NAME = "Potato";
const ERC20Symbol = "Potato";

async function main() {
  const [
    MyERC20HolderContractFactory,
    MyERC20HolderLiteContractFactory,
    ERC20FactoryContractFactory,
  ] = await Promise.all([
    ethers.getContractFactory("MyERC20Holder"),
    ethers.getContractFactory("MyERC20HolderLite"),
    ethers.getContractFactory("ERC20Factory"),
  ]);
  const ERC20FactoryContract = await ERC20FactoryContractFactory.deploy();
  await ERC20FactoryContract.deployed();
  const [MyERC20HolderContract, MyERC20HolderLiteContract] = await Promise.all([
    MyERC20HolderContractFactory.deploy(ERC20NAME, ERC20Symbol),
    MyERC20HolderLiteContractFactory.deploy(ERC20FactoryContract.address, ERC20NAME, ERC20Symbol),
  ]);
  await Promise.all([
    MyERC20HolderContract.deployed(),
    MyERC20HolderLiteContract.deployed(),
  ]);
  console.log({
    MyERC20HolderContractTxData: MyERC20HolderContract.deployTransaction.data,
    MyERC20HolderLiteTxData: MyERC20HolderLiteContract.deployTransaction.data,
    MyERC20HolderContractTxDataSize:
      MyERC20HolderContract.deployTransaction.data.length,
    MyERC20HolderLiteTxDataSize:
      MyERC20HolderLiteContract.deployTransaction.data.length,
  });
  const deployHeavyTx = await MyERC20HolderContract.deployMyERC20();
  const deployLiteTx = await MyERC20HolderLiteContract.deployMyERC20();
  console.log({
    deployHeavyTxData: deployHeavyTx.data,
    deployLiteTxData: deployLiteTx.data,
    deployHeavyTxDataSize: deployHeavyTx.data.length,
    deployLiteTxDataSize: deployLiteTx.data.length,
  });
  console.log(ethers.utils.formatEther(await MyERC20HolderContract.balanceOfMyER20()));
  console.log(ethers.utils.formatEther(await MyERC20HolderLiteContract.balanceOfMyER20()));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
