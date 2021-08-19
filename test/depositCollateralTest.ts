import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { parseEther } from 'ethers/lib/utils';

// contract label name Minter.
let minterContractLabelString: string = 'Minter';
let tokenContractLabelString: string = 'Token';
let feedContractLabelString: string = 'Feed';
let auctionHouseContractLabelString: string = 'AuctionHouse';

// account that signs deploy txs
let contractCreatorOwner: SignerWithAddress;
let contractAccounts: SignerWithAddress[];

describe('Minter', async function() {
  let owners, accounts, minter, token, feed, auctionHouse;

  beforeEach(async () => {
    const [owners, ...accounts] = await ethers.getSigners();
    contractCreatorOwner = owners;
    contractAccounts = accounts;

    // Declare contracts
    const Token = await ethers.getContractFactory(tokenContractLabelString);
    const Feed = await ethers.getContractFactory(feedContractLabelString);
    const AuctionHouse = await ethers.getContractFactory(
      auctionHouseContractLabelString
    );
    const Minter = await ethers.getContractFactory(minterContractLabelString);

    // Deploy contracts
    token = await Token.deploy('Ghost coin', 'GHO');
    feed = await Feed.deploy('1000000000000000000', 'Feed GHO');
    auctionHouse = await AuctionHouse.deploy();
    minter = await Minter.deploy(
      token.address,
      feed.address,
      auctionHouse.address
    );
  });
});
