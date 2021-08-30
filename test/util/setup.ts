import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { parseEther } from 'ethers/lib/utils';

let minterContractLabelString: string = 'Minter';
let tokenContractLabelString: string = 'Token';
let feedContractLabelString: string = 'Feed';
let auctionHouseContractLabelString: string = 'AuctionHouse';

let contractCreatorOwner: SignerWithAddress;
let contractAccounts: SignerWithAddress[];

const amount = BigNumber.from(parseEther('10'));

const setup = async () => {
  let Token, Feed, Minter, AuctionHouse, minter, token, feed, auctionHouse;

  const [owners, ...accounts] = await ethers.getSigners();
  contractCreatorOwner = owners;
  contractAccounts = accounts;

  // Declare contracts
  Token = await ethers.getContractFactory(tokenContractLabelString);
  Feed = await ethers.getContractFactory(feedContractLabelString);
  AuctionHouse = await ethers.getContractFactory(
    auctionHouseContractLabelString
  );
  Minter = await ethers.getContractFactory(minterContractLabelString);

  token = await Token.deploy('erc20 coin', 'Token');
  feed = await Feed.deploy(parseEther('10'), 'Feed Token');
  auctionHouse = await AuctionHouse.deploy();
  minter = await Minter.deploy(
    token.address,
    feed.address,
    auctionHouse.address
  );

  await token.approve(minter.address, amount);
  await token.mint(contractCreatorOwner.address, amount);

  return {
    contractAccounts,
    contractCreatorOwner,
    Token,
    Feed,
    Minter,
    AuctionHouse,
    minter,
    token,
    feed,
    auctionHouse,
  };
};

export default setup;
