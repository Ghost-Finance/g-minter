import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

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

  describe('Transferable', async function() {
    let token;

    beforeEach(async function() {
      const Token = await ethers.getContractFactory(tokenContractLabelString);

      token = await Token.deploy('GHOST', 'GDAI');
    });

    it('Should transfer tokens between accounts', async function() {
      // Tranfer 50 to one accountOne
      await token.transfer(contractAccounts[0].address, 50);
      const addressOneBalance = await token.balanceOf(
        contractAccounts[0].address
      );
      expect(addressOneBalance).to.equal(50);

      // Transfer the amount accountOne to accountTwo
      await token
        .connect(contractAccounts[0].address)
        .transfer(contractAccounts[1].address, 50);
      const addressTwoBalance = await token.balanceOf(
        contractAccounts[1].address
      );

      // Compare the final result
      expect(addressOneBalance).to.equal(0);
      expect(addressTwoBalance).to.equal(50);
    });
  });
});
