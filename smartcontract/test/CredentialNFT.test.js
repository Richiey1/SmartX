const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CredentialNFT", function () {
  let credential;
  let owner;
  let minter;
  let worker;

  beforeEach(async function () {
    [owner, minter, worker] = await ethers.getSigners();
    
    const CredentialNFT = await ethers.getContractFactory("CredentialNFT");
    credential = await CredentialNFT.deploy();
    await credential.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await credential.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await credential.name()).to.equal("GigID Credential");
      expect(await credential.symbol()).to.equal("GIGID");
    });
  });

  describe("Credential Minting", function () {
    it("Should mint credential to worker", async function () {
      const totalIncome = ethers.parseEther("50000");
      const periodStart = Math.floor(Date.now() / 1000) - 31536000;
      const periodEnd = Math.floor(Date.now() / 1000);
      const category = "Annual Income 2025";

      await expect(
        credential.mintCredential(worker.address, totalIncome, periodStart, periodEnd, category)
      )
        .to.emit(credential, "CredentialMinted")
        .withArgs(worker.address, 0, category);

      expect(await credential.ownerOf(0)).to.equal(worker.address);
      expect(await credential.balanceOf(worker.address)).to.equal(1);
    });

    it("Should store credential data correctly", async function () {
      const totalIncome = ethers.parseEther("50000");
      const periodStart = 1700000000;
      const periodEnd = 1730000000;
      const category = "Annual Income 2025";

      await credential.mintCredential(worker.address, totalIncome, periodStart, periodEnd, category);

      const cred = await credential.credentials(0);
      expect(cred.totalIncome).to.equal(totalIncome);
      expect(cred.periodStart).to.equal(periodStart);
      expect(cred.periodEnd).to.equal(periodEnd);
      expect(cred.category).to.equal(category);
    });

    it("Should increment token ID for each mint", async function () {
      await credential.mintCredential(worker.address, ethers.parseEther("1000"), 0, 0, "Test 1");
      await credential.mintCredential(worker.address, ethers.parseEther("2000"), 0, 0, "Test 2");

      expect(await credential.ownerOf(0)).to.equal(worker.address);
      expect(await credential.ownerOf(1)).to.equal(worker.address);
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        credential.connect(minter).mintCredential(
          worker.address,
          ethers.parseEther("1000"),
          0,
          0,
          "Test"
        )
      ).to.be.revertedWithCustomError(credential, "OwnableUnauthorizedAccount");
    });
  });

  describe("Soulbound (Non-Transferable)", function () {
    beforeEach(async function () {
      await credential.mintCredential(
        worker.address,
        ethers.parseEther("50000"),
        0,
        0,
        "Annual Income 2025"
      );
    });

    it("Should prevent transferFrom", async function () {
      await expect(
        credential.connect(worker).transferFrom(worker.address, minter.address, 0)
      ).to.be.revertedWith("GIGID: Non-transferable credential");
    });

    it("Should prevent safeTransferFrom", async function () {
      await expect(
        credential.connect(worker)["safeTransferFrom(address,address,uint256)"](
          worker.address,
          minter.address,
          0
        )
      ).to.be.revertedWith("GIGID: Non-transferable credential");
    });

    it("Should still allow minting (from != address(0))", async function () {
      await expect(
        credential.mintCredential(minter.address, ethers.parseEther("1000"), 0, 0, "Test")
      ).to.not.be.reverted;
    });
  });

  describe("Enumerable", function () {
    it("Should enumerate tokens for worker", async function () {
      await credential.mintCredential(worker.address, ethers.parseEther("1000"), 0, 0, "Test 1");
      await credential.mintCredential(worker.address, ethers.parseEther("2000"), 0, 0, "Test 2");

      expect(await credential.tokenOfOwnerByIndex(worker.address, 0)).to.equal(0);
      expect(await credential.tokenOfOwnerByIndex(worker.address, 1)).to.equal(1);
    });

    it("Should return total supply", async function () {
      await credential.mintCredential(worker.address, ethers.parseEther("1000"), 0, 0, "Test 1");
      await credential.mintCredential(minter.address, ethers.parseEther("2000"), 0, 0, "Test 2");

      expect(await credential.totalSupply()).to.equal(2);
    });
  });
});