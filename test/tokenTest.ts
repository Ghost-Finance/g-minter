import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { parseEther } from 'ethers/lib/utils';

// contract label name Token.
let tokenContractLabelString: string = 'Token';
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

      const token = await Token.deploy('GHOST', 'GDai');

      expect(await token.owner()).to.equal(contractCreatorOwner.address);
    });

    it('Should create a new token', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);

      const token = await Token.deploy('GHOST', 'GDai');

      expect(await token.name()).to.equal('GHOST');
      expect(await token.symbol()).to.equal('GDai');
    });

    it('Should assign the total supply of tokens to the owner', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);
      const token = await Token.deploy('GHOST', 'GDAI');

      const ownerBalance = await token.balanceOf(contractCreatorOwner.address);
      expect(await token.tokenSupply()).to.equal(ownerBalance);
    });
  });

  describe('Mintable', async function() {
    it('Shoul return error if sender is not the contract owner', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);
      const token = await Token.deploy('GHOST', 'GDAI');

      await expect(
        token
          .connect(contractAccounts[0])
          .mint(contractAccounts[1].address, BigNumber.from(parseEther('100')))
      ).to.be.revertedWith('revert');
    });

    it('Shoul return success to mint a token', async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);
      const token = await Token.deploy('GHOST', 'GDAI');

      await token.mint(
        contractCreatorOwner.address,
        BigNumber.from(parseEther('100'))
      );

      const ownerBalance = await token.balanceOf(contractCreatorOwner.address);
      expect(await token.tokenSupply()).to.equal(ownerBalance.toString());
    });
  });

  describe('Transferable', async function() {
    let token;

    beforeEach(async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);

      token = await Token.deploy('GHOST', 'GDAI');
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
      const ownerBalanceOf = await token.balanceOf(owner);

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
