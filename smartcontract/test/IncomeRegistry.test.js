const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IncomeRegistry", function () {
  let registry;
  let owner;
  let verifier;
  let worker;

  beforeEach(async function () {
    [owner, verifier, worker] = await ethers.getSigners();
    
    const IncomeRegistry = await ethers.getContractFactory("IncomeRegistry");
    registry = await IncomeRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should authorize the owner as a verifier", async function () {
      expect(await registry.authorizedVerifiers(owner.address)).to.be.true;
    });
  });

  describe("Verifier Management", function () {
    it("Should allow owner to add verifiers", async function () {
      await registry.setVerifierStatus(verifier.address, true);
      expect(await registry.authorizedVerifiers(verifier.address)).to.be.true;
    });

    it("Should allow owner to remove verifiers", async function () {
      await registry.setVerifierStatus(verifier.address, true);
      await registry.setVerifierStatus(verifier.address, false);
      expect(await registry.authorizedVerifiers(verifier.address)).to.be.false;
    });

    it("Should emit VerifierStatusChanged event", async function () {
      await expect(registry.setVerifierStatus(verifier.address, true))
        .to.emit(registry, "VerifierStatusChanged")
        .withArgs(verifier.address, true);
    });

    it("Should revert if non-owner tries to add verifiers", async function () {
      await expect(
        registry.connect(verifier).setVerifierStatus(worker.address, true)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Income Recording", function () {
    beforeEach(async function () {
      await registry.setVerifierStatus(verifier.address, true);
    });

    it("Should record income for a worker", async function () {
      const amount = ethers.parseEther("1000");
      const source = "Uber";
      const attestationId = ethers.id("test-attestation");

      await expect(
        registry.connect(verifier).recordIncome(worker.address, amount, source, attestationId)
      )
        .to.emit(registry, "IncomeRecorded")
        .withArgs(worker.address, amount, source, attestationId);

      const incomes = await registry.getWorkerIncomes(worker.address);
      expect(incomes.length).to.equal(1);
      expect(incomes[0].amount).to.equal(amount);
      expect(incomes[0].source).to.equal(source);
      expect(incomes[0].verified).to.be.true;
    });

    it("Should reject zero address as worker", async function () {
      await expect(
        registry.connect(verifier).recordIncome(
          ethers.ZeroAddress,
          ethers.parseEther("100"),
          "Test",
          ethers.id("test")
        )
      ).to.be.revertedWith("Invalid worker address");
    });

    it("Should reject zero amount", async function () {
      await expect(
        registry.connect(verifier).recordIncome(
          worker.address,
          0,
          "Test",
          ethers.id("test")
        )
      ).to.be.revertedWith("Amount must be greater than zero");
    });

    it("Should reject unauthorized callers", async function () {
      await expect(
        registry.connect(worker).recordIncome(
          worker.address,
          ethers.parseEther("100"),
          "Test",
          ethers.id("test")
        )
      ).to.be.revertedWith("Not authorized");
    });

    it("Should return correct income count", async function () {
      await registry.connect(verifier).recordIncome(
        worker.address,
        ethers.parseEther("100"),
        "Uber",
        ethers.id("test1")
      );
      await registry.connect(verifier).recordIncome(
        worker.address,
        ethers.parseEther("200"),
        "Upwork",
        ethers.id("test2")
      );

      expect(await registry.getIncomeCount(worker.address)).to.equal(2);
    });
  });
});