import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

// contract label name Token.
let tokenContractLabelString: string = 'Token';

// account that signs deploy txs
let contractCreatorOwner: SignerWithAddress;

let contractCreatorAccount: SignerWithAddress;

describe('Token', () => {
  before(async () => {
    const [owners, ...accounts] = await ethers.getSigners();
    contractCreatorOwner = owners;
  });

  it.only('Should create a new token', async function() {
    const Token = await ethers.getContractFactory(tokenContractLabelString);
    const token = await Token.deploy('GHOST', 'GDai');

    expect(await token.name).to.equal('GHOST');
    expect(await token.symbol).to.equal('GDai');
    expect(await token.owner.address).to.equal(contractCreatorOwner);
  });

  // it('Should create a new token', async function() {
  //   const Token = await ethers.getContractFactory(tokenContractLabelString);
  //   const token = await Token.deploy('GHOST', 'GDai');

  //   console.log(token);
  //   expect(await token.name()).to.equal('GHOST');
  //   expect(await token.symbol).to.equal('GDai');
  // });

  it('Should assign the total supply of tokens to the owner', async function() {
    const Token = await ethers.getContractFactory(tokenContractLabelString);
    const token = await Token.deploy();

    const ownerBalance = await token.balanceOf(contractCreatorOwner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it('', async function() {});
});
