import { ethers } from "hardhat";

const PROPOSALS = ["Potato", "Popcorn", "Paprika", "Papaya"];

async function main() {
  const ownerAddress = (await ethers.getSigners())[0].address;
  let proposalsArray: string[] = [];
  PROPOSALS.forEach((element) => {
    proposalsArray.push(ethers.utils.formatBytes32String(element));
  });
  const ballotContractFactory = await ethers.getContractFactory(
    "BallotModified"
  );
  const ballotContract = await ballotContractFactory.deploy(proposalsArray);
  const votingTokenAddress = await ballotContract.votingTokenAddress();
  console.log(votingTokenAddress);
  const votingTokenContractFactory = await ethers.getContractFactory("ERC20");
  const votingTokenContract =
    votingTokenContractFactory.attach(votingTokenAddress);
  console.log(
    "Voting token balance: " +
      ethers.utils.formatEther(
        await votingTokenContract.balanceOf(ownerAddress)
      )
  );
  console.log(
    "Total votes: " +
      ethers.utils.formatEther(
        await votingTokenContract.balanceOf(ballotContract.address)
      )
  );
  await ballotContract.giveRightToVote(ownerAddress);
  await votingTokenContract.approve(ballotContract.address, await ballotContract.VOTE_UNITS());
  console.log(
    "Voting token balance: " +
      ethers.utils.formatEther(
        await votingTokenContract.balanceOf(ownerAddress)
      )
  );
  await ballotContract.vote(ethers.BigNumber.from(1));
  console.log(
    "Total votes: " +
      ethers.utils.formatEther(
        await votingTokenContract.balanceOf(ballotContract.address)
      )
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
