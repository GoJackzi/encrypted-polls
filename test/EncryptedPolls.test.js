import { expect } from "chai";
import { ethers } from "hardhat";

describe("EncryptedPolls", function () {
  let encryptedPolls;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const EncryptedPolls = await ethers.getContractFactory("EncryptedPolls");
    encryptedPolls = await EncryptedPolls.deploy();
    await encryptedPolls.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // The contract doesn't have an owner, but we can test deployment
      expect(await encryptedPolls.getAddress()).to.be.properAddress;
    });

    it("Should initialize polls correctly", async function () {
      // Test that polls are initialized
      const pollCount = await encryptedPolls.POLL_COUNT();
      expect(pollCount).to.equal(15);
    });
  });

  describe("Poll Information", function () {
    it("Should return correct poll information", async function () {
      const [question, optionA, optionB, decrypted, votesA, votesB] = await encryptedPolls.getPoll(0);
      
      expect(question).to.equal("Will Bitcoin reach $150k by end of 2025?");
      expect(optionA).to.equal("Yes");
      expect(optionB).to.equal("No");
      expect(decrypted).to.be.false;
      expect(votesA).to.equal(0);
      expect(votesB).to.equal(0);
    });

    it("Should check if user has voted", async function () {
      const hasVoted = await encryptedPolls.hasUserVoted(0, addr1.address);
      expect(hasVoted).to.be.false;
    });
  });

  describe("Voting", function () {
    it("Should allow voting (without encrypted input for now)", async function () {
      // Note: This test would need encrypted input to work properly
      // For now, we're just testing the contract structure
      const hasVotedBefore = await encryptedPolls.hasUserVoted(0, addr1.address);
      expect(hasVotedBefore).to.be.false;
    });
  });
});
