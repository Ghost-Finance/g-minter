import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { parseEther } from 'ethers/lib/utils';

// contract label name Token.
let tokenContractLabelString: string = 'GTokenERC20';
// account that signs deploy txs
let contractCreatorOwner: SignerWithAddress;
let contractAccounts: SignerWithAddress[];

describe.only('Token', () => {
  beforeEach(async () => {
    const [owners, ...accounts] = await ethers.getSigners();
    contractCreatorOwner = owners;
    contractAccounts = accounts;
  });

  describe('Deploy', async function() {
    it('Should set the right owner', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);

      const token = await Token.deploy('Ghost Stablecoin', 'GDai');

      expect(await token.owner()).to.equal(contractCreatorOwner.address);
    });

    it('Should create a new token', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);

      const token = await Token.deploy('Ghost Stablecoin', 'GDai');

      expect(await token.name()).to.equal('Ghost Stablecoin');
      expect(await token.symbol()).to.equal('GDai');
    });

    it('Should assign the total supply of tokens to the owner', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);
      const token = await Token.deploy('Ghost Stablecoin', 'GDai');

      const ownerBalance = await token.balanceOf(contractCreatorOwner.address);

      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Mintable', async function() {
    it('Should return error if sender is not the contract owner', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);
      const token = await Token.deploy('Ghost Stablecoin', 'GDai');

      await expect(
        token
          .connect(contractAccounts[0])
          .mint(contractAccounts[1].address, BigNumber.from(parseEther('100')))
      ).to.be.revertedWith('revert');
    });

    it('Should return success to mint a token', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);
      const token = await Token.deploy('Ghost Stablecoin', 'GDai');

      await token.mint(
        contractCreatorOwner.address,
        BigNumber.from(parseEther('100'))
      );

      const ownerBalance = await token.balanceOf(contractCreatorOwner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance.toString());
    });
  });

  describe('Approval', async function() {
    let token;

    beforeEach(async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);

      token = await Token.deploy('Ghost Stablecoin', 'GDai');
      await token.mint(
        contractCreatorOwner.address,
        BigNumber.from(parseEther('100'))
      );
    });

    it('Should allowances account to approve value', async function() {
      const accountOne = contractAccounts[0].address;

      await token.approve(accountOne, 50);
      const addressOneAllowance = await token.allowance(
        contractCreatorOwner.address,
        accountOne
      );

      expect(addressOneAllowance.toNumber()).to.equal(50);
    });
  });

  describe('Transferable', async function() {
    let token;

    beforeEach(async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);

      token = await Token.deploy('Ghost Stablecoin', 'GDai');
      await token.mint(
        contractCreatorOwner.address,
        BigNumber.from(parseEther('100'))
      );
    });

    it('Should transfer tokens between accounts', async function() {
      const accountOne = contractAccounts[0].address;
      const accountTwo = contractAccounts[1].address;

      // Tranfer 50 to accountOne
      await token.transfer(accountOne, 50);
      const addressOneBalance = await token.balanceOf(accountOne);

      expect(addressOneBalance.toNumber()).to.equal(50);

      // Transfer the amount accountOne to accountTwo
      await token.connect(contractAccounts[0]).transfer(accountTwo, 50);
      const addressTwoBalance = await token.balanceOf(accountTwo);

      expect(addressTwoBalance.toNumber()).to.equal(50);
    });

    it('Should return error if sender has not enough founds', async function() {
      const accountOne = contractAccounts[0];
      const accountTwo = contractAccounts[1];

      await expect(
        token.connect(accountOne).transfer(accountTwo.address, 50)
      ).to.be.revertedWith('revert');
    });

    it('Should update balanceOf of all accounts', async function() {
      const owner = contractCreatorOwner.address;
      const accountOne = contractAccounts[0].address;
      const accountTwo = contractAccounts[1].address;

      await token.transfer(accountOne, 100);
      await token.transfer(accountTwo, 30);

      const finalOwnerBalanceOf = await token.balanceOf(owner);
      expect(finalOwnerBalanceOf.toString()).to.equal('99999999999999999870');

      const finalAccountOneBalanceOf = await token.balanceOf(accountOne);
      expect(finalAccountOneBalanceOf.toNumber()).to.equal(100);

      const finalAccountTwoBalanceOf = await token.balanceOf(accountTwo);
      expect(finalAccountTwoBalanceOf.toNumber()).to.equal(30);
    });
  });
});
