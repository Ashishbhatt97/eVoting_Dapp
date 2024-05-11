import hre from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("eVoting Contract", function () {
  let eVotingContract: any;
  let deployer: HardhatEthersSigner;

  //Deploying Tests
  this.beforeEach(async () => {
    const [owner] = await hre.ethers.getSigners();
    deployer = owner;

    const contract = await hre.ethers.getContractFactory("eVoting");
    eVotingContract = await contract.deploy({ from: deployer });
  });

  it("should deploy with correct owner", async () => {
    const ownerAddress = eVotingContract.deploymentTransaction()?.from;
    expect(ownerAddress).to.equal(deployer.address);
  });

  it("should have initial candidate count and voting count as 0", async () => {
    const candidateCount = await eVotingContract.candidateCount();
    const votingCount = await eVotingContract.votingCounts();

    expect(candidateCount).to.equal(0);
    expect(votingCount).to.equal(0);
  });

  it("Should have maxVote set to 1", async () => {
    const maxVote = await eVotingContract.maxVote();
    expect(maxVote).to.equal(1);
  });

  it("Should only allow owner to add candidates ( onlyOwner modifier)", async () => {
    const [randomUser] = await hre.ethers.getSigners();

    await expect(
      eVotingContract.connect(randomUser).addCandidate("Modi Sahab", "BJP")
    ).to.be.revertedWith("You cannot add Candidate");
  });

  // Adding Candidate Tests
  it("Should successfully add a candidate", async () => {
    const candidateName = "Arvind Kejriwal";
    const party = "AAP";

    await eVotingContract.addCandidate(candidateName, party);

    const lastCandidate = await eVotingContract.activeCandidates(0);
    expect(lastCandidate.candidateName).to.equal(candidateName);
    expect(lastCandidate.party).to.equal(party);
    expect(lastCandidate.candidateNumber).to.equal(1);
  });

  it("Should increment candidate count after adding a candidate", async () => {
    const candidateName = "Arvind Kejriwal";
    const party = "AAP";

    const initialCount = Number(await eVotingContract.candidateCount());
    await eVotingContract.addCandidate(candidateName, party);
    const finalCount = Number(await eVotingContract.candidateCount());

    expect(finalCount).to.equal(initialCount + 1);
  });

  //Voting Tests
  describe("vote", function () {
    it("should only allow one vote per user", async function () {
      await eVotingContract.vote(1);

      await expect(eVotingContract.vote(1)).to.be.revertedWith(
        "You have already Voted!"
      );
    });

    it("should increment the vote count for the candidate", async function () {
      const candidateNumber = 1;
      const initialVoteCount = Number(
        await eVotingContract.votes(candidateNumber)
      );

      await eVotingContract.vote(candidateNumber);

      const newVoteCount = Number(await eVotingContract.votes(candidateNumber));
      expect(newVoteCount).to.equal(initialVoteCount + 1);
    });

    it("should increment the total voting count", async function () {
      const initialVoteCount = Number(await eVotingContract.votingCounts());

      await eVotingContract.vote(1);

      const newVoteCount = Number(await eVotingContract.votingCounts());
      expect(newVoteCount).to.equal(initialVoteCount + 1);
    });
  });
});
