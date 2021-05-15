import { ethers } from "hardhat";

const STORE_VALUE = "Potato";

async function main() {
  const [TestStoreStringContractFactory, TestStoreBytesContractFactory] =
    await Promise.all([
      ethers.getContractFactory("TestStoreString"),
      ethers.getContractFactory("TestStoreBytes"),
    ]);
  const [TestStoreStringContract, TestStoreBytesContract] = await Promise.all([
    TestStoreStringContractFactory.deploy(),
    TestStoreBytesContractFactory.deploy(),
  ]);
  await Promise.all([
    TestStoreStringContract.deployed(),
    TestStoreBytesContract.deployed(),
  ]);
  console.log({
    storeStringContractTxData: TestStoreStringContract.deployTransaction.data,
    storeBytesContractTxData: TestStoreBytesContract.deployTransaction.data,
    storeStringContractTxDataSize: TestStoreStringContract.deployTransaction.data.length,
    storeBytesContractTxDataSize: TestStoreBytesContract.deployTransaction.data.length,
  });
  const storeStringTx = await TestStoreStringContract.storeValue(STORE_VALUE);
  const storeBytesTx = await TestStoreBytesContract.storeValue(
    ethers.utils.formatBytes32String(STORE_VALUE)
  );
  console.log({
    storeStringTxData: storeStringTx.data,
    storeBytesTxData: storeBytesTx.data,
    storeStringTxDataSize: storeStringTx.data.length,
    storeBytesTxDataSize: storeBytesTx.data.length,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
