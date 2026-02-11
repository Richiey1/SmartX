import { expect } from "chai";
import { ethers } from "hardhat";
import { IncomeRegistry, CredentialNFT } from "../typechain-types";

describe("GigID Smart Contracts", () => {
  let incomeRegistry: IncomeRegistry;
  let credentialNFT: CredentialNFT;
  let owner: any;
  let worker: any;
  let verifier: any;
  let unauthorized: any;

  beforeEach(async () => {
    // Get test signers
    [owner, worker, verifier, unauthorized] = await ethers.getSigners();

    // Deploy IncomeRegistry
    const IncomeRegistryFactory = await ethers.getContractFactory("IncomeRegistry");
    incomeRegistry = await IncomeRegistryFactory.deploy();
    await incomeRegistry.waitForDeployment();

    // Deploy CredentialNFT
    const CredentialNFTFactory = await ethers.getContractFactory("CredentialNFT");
    credentialNFT = await CredentialNFTFactory.deploy();
    await credentialNFT.waitForDeployment();

    // Authorize verifier
    await incomeRegistry.connect(owner).setVerifierStatus(verifier.address, true);
  });

  describe("IncomeRegistry", () => {
    describe("Deployment", () => {
      it("Should deploy with correct owner", async () => {
        expect(await incomeRegistry.owner()).to.equal(owner.address);
      });

      it("Should authorize owner as verifier by default", async () => {
        expect(await incomeRegistry.authorizedVerifiers(owner.address)).to.be.true;
      });
    });

    describe("Verifier Management", () => {
      it("Should allow owner to add verifier", async () => {
        await incomeRegistry.connect(owner).setVerifierStatus(unauthorized.address, true);
        expect(await incomeRegistry.authorizedVerifiers(unauthorized.address)).to.be.true;
      });

      it("Should allow owner to remove verifier", async () => {
        await incomeRegistry.connect(owner).setVerifierStatus(verifier.address, false);
        expect(await incomeRegistry.authorizedVerifiers(verifier.address)).to.be.false;
      });

      it("Should emit VerifierStatusChanged event", async () => {
        await expect(incomeRegistry.connect(owner).setVerifierStatus(unauthorized.address, true))
          .to.emit(incomeRegistry, "VerifierStatusChanged")
          .withArgs(unauthorized.address, true);
      });

      it("Should not allow non-owner to manage verifiers", async () => {
        await expect(
          incomeRegistry.connect(unauthorized).setVerifierStatus(worker.address, true)
        ).to.be.revertedWithCustomError(incomeRegistry, "OwnableUnauthorizedAccount");
      });
    });

    describe("recordIncome", () => {
      const amount = ethers.parseEther("1000");
      const source = "Uber";
      const attestationId = ethers.id("test-attestation");

      it("Should record income correctly", async () => {
        await incomeRegistry
          .connect(verifier)
          .recordIncome(worker.address, amount, source, attestationId);

        const incomes = await incomeRegistry.getWorkerIncomes(worker.address);
        expect(incomes.length).to.equal(1);
        expect(incomes[0].amount).to.equal(amount);
        expect(incomes[0].source).to.equal(source);
        expect(incomes[0].verified).to.be.true;
      });

      it("Should emit IncomeRecorded event", async () => {
        await expect(
          incomeRegistry.connect(verifier).recordIncome(worker.address, amount, source, attestationId)
        )
          .to.emit(incomeRegistry, "IncomeRecorded")
          .withArgs(worker.address, amount, source, attestationId);
      });

      it("Should reject invalid worker address", async () => {
        await expect(
          incomeRegistry.connect(verifier).recordIncome(ethers.ZeroAddress, amount, source, attestationId)
        ).to.be.revertedWith("Invalid worker address");
      });

      it("Should reject zero amount", async () => {
        await expect(
          incomeRegistry.connect(verifier).recordIncome(worker.address, 0, source, attestationId)
        ).to.be.revertedWith("Amount must be greater than zero");
      });

      it("Should reject from unauthorized address", async () => {
        await expect(
          incomeRegistry.connect(unauthorized).recordIncome(worker.address, amount, source, attestationId)
        ).to.be.revertedWith("Not authorized");
      });

      it("Should allow multiple records per worker", async () => {
        const attestationId2 = ethers.id("test-attestation-2");
        await incomeRegistry
          .connect(verifier)
          .recordIncome(worker.address, amount, "Upwork", attestationId);
        await incomeRegistry
          .connect(verifier)
          .recordIncome(worker.address, amount, "Fiverr", attestationId2);

        const incomes = await incomeRegistry.getWorkerIncomes(worker.address);
        expect(incomes.length).to.equal(2);
      });

      it("Should store correct timestamp", async () => {
        const blockBefore = await ethers.provider.getBlock("latest");
        await incomeRegistry
          .connect(verifier)
          .recordIncome(worker.address, amount, source, attestationId);
        const blockAfter = await ethers.provider.getBlock("latest");

        const incomes = await incomeRegistry.getWorkerIncomes(worker.address);
        expect(incomes[0].timestamp).to.be.gte(blockBefore!.timestamp);
        expect(incomes[0].timestamp).to.be.lte(blockAfter!.timestamp);
      });
    });

    describe("getWorkerIncomes", () => {
      it("Should return empty array for worker with no income", async () => {
        const incomes = await incomeRegistry.getWorkerIncomes(worker.address);
        expect(incomes.length).to.equal(0);
      });

      it("Should return all records for a worker", async () => {
        const amount1 = ethers.parseEther("1000");
        const amount2 = ethers.parseEther("2000");
        const attestationId1 = ethers.id("test-1");
        const attestationId2 = ethers.id("test-2");

        await incomeRegistry.connect(verifier).recordIncome(worker.address, amount1, "Uber", attestationId1);
        await incomeRegistry.connect(verifier).recordIncome(worker.address, amount2, "Upwork", attestationId2);

        const incomes = await incomeRegistry.getWorkerIncomes(worker.address);
        expect(incomes.length).to.equal(2);
        expect(incomes[0].amount).to.equal(amount1);
        expect(incomes[1].amount).to.equal(amount2);
      });
    });

    describe("getIncomeCount", () => {
      it("Should return correct count", async () => {
        const amount = ethers.parseEther("1000");
        const attestationId1 = ethers.id("test-1");
        const attestationId2 = ethers.id("test-2");

        expect(await incomeRegistry.getIncomeCount(worker.address)).to.equal(0);

        await incomeRegistry.connect(verifier).recordIncome(worker.address, amount, "Uber", attestationId1);
        expect(await incomeRegistry.getIncomeCount(worker.address)).to.equal(1);

        await incomeRegistry.connect(verifier).recordIncome(worker.address, amount, "Upwork", attestationId2);
        expect(await incomeRegistry.getIncomeCount(worker.address)).to.equal(2);
      });
    });
  });

  describe("CredentialNFT", () => {
    describe("Deployment", () => {
      it("Should deploy with correct name and symbol", async () => {
        expect(await credentialNFT.name()).to.equal("GigID Credential");
        expect(await credentialNFT.symbol()).to.equal("GIGID");
      });

      it("Should have correct owner", async () => {
        expect(await credentialNFT.owner()).to.equal(owner.address);
      });

      it("Should start with token ID 0", async () => {
        await credentialNFT.connect(owner).mintCredential(
          worker.address,
          ethers.parseEther("50000"),
          Math.floor(Date.now() / 1000),
          Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
          "Annual Income 2025"
        );
        expect(await credentialNFT.tokenByIndex(0)).to.equal(0n);
      });
    });

    describe("mintCredential", () => {
      const totalIncome = ethers.parseEther("50000");
      const periodStart = Math.floor(Date.now() / 1000);
      const periodEnd = periodStart + 365 * 24 * 60 * 60;
      const category = "Annual Income 2025";

      it("Should mint credential with correct data", async () => {
        await credentialNFT.connect(owner).mintCredential(
          worker.address,
          totalIncome,
          periodStart,
          periodEnd,
          category
        );

        const credential = await credentialNFT.credentials(0);
        expect(credential.totalIncome).to.equal(totalIncome);
        expect(credential.periodStart).to.equal(periodStart);
        expect(credential.periodEnd).to.equal(periodEnd);
        expect(credential.category).to.equal(category);
      });

      it("Should mint to correct worker", async () => {
        await credentialNFT.connect(owner).mintCredential(
          worker.address,
          totalIncome,
          periodStart,
          periodEnd,
          category
        );

        expect(await credentialNFT.ownerOf(0)).to.equal(worker.address);
      });

      it("Should return correct token ID", async () => {
        const tx = await credentialNFT.connect(owner).mintCredential(
          worker.address,
          totalIncome,
          periodStart,
          periodEnd,
          category
        );
        const receipt = await tx.wait();
        
        const event = receipt?.logs
          .map(log => {
            try {
              return credentialNFT.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find(event => event?.name === "CredentialMinted");

        expect(event?.args[1]).to.equal(0);
      });

      it("Should emit CredentialMinted event", async () => {
        await expect(
          credentialNFT.connect(owner).mintCredential(
            worker.address,
            totalIncome,
            periodStart,
            periodEnd,
            category
          )
        )
          .to.emit(credentialNFT, "CredentialMinted")
          .withArgs(worker.address, 0, category);
      });

      it("Should reject from non-owner", async () => {
        await expect(
          credentialNFT.connect(worker).mintCredential(
            worker.address,
            totalIncome,
            periodStart,
            periodEnd,
            category
          )
        ).to.be.revertedWithCustomError(credentialNFT, "OwnableUnauthorizedAccount");
      });

      it("Should increment token ID", async () => {
        await credentialNFT.connect(owner).mintCredential(
          worker.address,
          totalIncome,
          periodStart,
          periodEnd,
          "Credential 1"
        );
        await credentialNFT.connect(owner).mintCredential(
          worker.address,
          totalIncome,
          periodStart,
          periodEnd,
          "Credential 2"
        );

        expect(await credentialNFT.ownerOf(0)).to.equal(worker.address);
        expect(await credentialNFT.ownerOf(1)).to.equal(worker.address);
      });
    });

    describe("Soulbound Functionality", () => {
      const totalIncome = ethers.parseEther("50000");
      const periodStart = Math.floor(Date.now() / 1000);
      const periodEnd = periodStart + 365 * 24 * 60 * 60;
      const category = "Annual Income 2025";

      beforeEach(async () => {
        await credentialNFT.connect(owner).mintCredential(
          worker.address,
          totalIncome,
          periodStart,
          periodEnd,
          category
        );
      });

      it("Should prevent transfer of credential", async () => {
        await expect(
          credentialNFT.connect(worker).transferFrom(worker.address, unauthorized.address, 0)
        ).to.be.revertedWith("GIGID: Non-transferable credential");
      });

      it("Should prevent safeTransferFrom of credential", async () => {
        await expect(
          credentialNFT.connect(worker).safeTransferFrom(worker.address, unauthorized.address, 0)
        ).to.be.revertedWith("GIGID: Non-transferable credential");
      });

      it("Should prevent approval for transfer", async () => {
        // Approval might succeed, but transfer should fail
        await credentialNFT.connect(worker).approve(unauthorized.address, 0);
        
        await expect(
          credentialNFT.connect(unauthorized).transferFrom(worker.address, unauthorized.address, 0)
        ).to.be.revertedWith("GIGID: Non-transferable credential");
      });

      it("Should allow owner to still hold credential", async () => {
        expect(await credentialNFT.ownerOf(0)).to.equal(worker.address);
        expect(await credentialNFT.balanceOf(worker.address)).to.equal(1);
      });
    });

    describe("Enumerable Functions", () => {
      const totalIncome = ethers.parseEther("50000");
      const periodStart = Math.floor(Date.now() / 1000);
      const periodEnd = periodStart + 365 * 24 * 60 * 60;

      beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
          await credentialNFT.connect(owner).mintCredential(
            worker.address,
            totalIncome,
            periodStart,
            periodEnd,
            `Credential ${i}`
          );
        }
      });

      it("Should return correct total supply", async () => {
        expect(await credentialNFT.totalSupply()).to.equal(3);
      });

      it("Should return tokens by index", async () => {
        expect(await credentialNFT.tokenByIndex(0)).to.equal(0);
        expect(await credentialNFT.tokenByIndex(1)).to.equal(1);
        expect(await credentialNFT.tokenByIndex(2)).to.equal(2);
      });

      it("Should return correct token of owner by index", async () => {
        expect(await credentialNFT.tokenOfOwnerByIndex(worker.address, 0)).to.equal(0);
        expect(await credentialNFT.tokenOfOwnerByIndex(worker.address, 1)).to.equal(1);
        expect(await credentialNFT.tokenOfOwnerByIndex(worker.address, 2)).to.equal(2);
      });

      it("Should return correct balance", async () => {
        expect(await credentialNFT.balanceOf(worker.address)).to.equal(3);
      });
    });
  });

  describe("Integration Tests", () => {
    it("Should support complete workflow: record income then mint credential", async () => {
      // Record income
      const amount = ethers.parseEther("5000");
      const attestationId = ethers.id("test-attestation");
      await incomeRegistry.connect(verifier).recordIncome(worker.address, amount, "Uber", attestationId);

      // Verify income was recorded
      const incomes = await incomeRegistry.getWorkerIncomes(worker.address);
      expect(incomes.length).to.equal(1);
      expect(incomes[0].amount).to.equal(amount);

      // Mint credential based on recorded income
      const periodStart = Math.floor(Date.now() / 1000);
      const periodEnd = periodStart + 30 * 24 * 60 * 60;
      await credentialNFT.connect(owner).mintCredential(
        worker.address,
        incomes[0].amount,
        periodStart,
        periodEnd,
        "Monthly Income Certificate"
      );

      // Verify credential was minted
      expect(await credentialNFT.ownerOf(0)).to.equal(worker.address);
      const credential = await credentialNFT.credentials(0);
      expect(credential.totalIncome).to.equal(amount);
    });

    it("Should support multiple workers with separate records", async () => {
      const amount = ethers.parseEther("5000");
      const attestationId1 = ethers.id("test-1");
      const attestationId2 = ethers.id("test-2");

      // Record income for two workers
      await incomeRegistry.connect(verifier).recordIncome(worker.address, amount, "Uber", attestationId1);
      await incomeRegistry.connect(verifier).recordIncome(unauthorized.address, amount, "Upwork", attestationId2);

      // Verify separate records
      const incomes1 = await incomeRegistry.getWorkerIncomes(worker.address);
      const incomes2 = await incomeRegistry.getWorkerIncomes(unauthorized.address);

      expect(incomes1.length).to.equal(1);
      expect(incomes2.length).to.equal(1);
      expect(incomes1[0].source).to.equal("Uber");
      expect(incomes2[0].source).to.equal("Upwork");
    });
  });
});
