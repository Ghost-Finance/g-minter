import { artifacts, ethers } from 'hardhat';
import { BigNumber, ContractFactory } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { CreateSynthEvent } from '../test/types/types';
import { deployContracts, deployer, saveFrontendFiles } from './utils';

let minterContractLabelString: string = 'Minter';
let tokenContractLabelString: string = 'GTokenERC20';
let feedContractLabelString: string = 'Feed';
let auctionHouseContractLabelString: string = 'AuctionHouse';

const ghoArgs = ['GHO', 'GHO', BigNumber.from(parseEther('200000000.0'))];
const gDaiArgs = [
  'GDAI',
  'GDAI',
  BigNumber.from(parseEther('200000000.0')),
  200,
  300,
];
const feedGhoArgs = [parseEther('1'), 'GHO'];
const feedGdaiArgs = [parseEther('1'), 'GDAI'];

const main = async () => {
  const [owner] = await deployer();

  const ghoToken = await deployContracts(tokenContractLabelString, ...ghoArgs);
  const feedGho = await deployContracts(
    feedContractLabelString,
    ...feedGhoArgs
  );
  const feedGdai = await deployContracts(
    feedContractLabelString,
    ...feedGdaiArgs
  );
  const auctionHouse = await deployContracts(auctionHouseContractLabelString);
  const minter = await deployContracts(
    minterContractLabelString,
    ghoToken.address,
    feedGho.address,
    auctionHouse.address
  );

  // Generate synths
  const synthArgs = [].concat(gDaiArgs, feedGdai.address);
  await minter.connect(owner).createSynth(...synthArgs);

  let createSynthEvent = new Promise<CreateSynthEvent>((resolve, reject) => {
    minter.on('CreateSynth', (address, name, symbol, feed) => {
      resolve({
        address: address,
        name: name,
        symbol: symbol,
        feed: feed,
      });
    });

    setTimeout(() => {
      reject(new Error('timeout'));
    }, 60000);
  });
  const eventCreateSynth = await createSynthEvent;

  console.log(`Feed address contract: ${feedGho.address}`);
  console.log(`Feed 2 address contract: ${feedGdai.address}`);
  console.log(`Token address contract: ${ghoToken.address}`);
  console.log(`AuctionHouse address contract: ${auctionHouse.address}`);
  console.log(`Minter address contract: ${minter.address}`);
  console.log(`GDai address: ${eventCreateSynth.address}`);

  [
    [ghoToken.address, 'GHO', tokenContractLabelString],
    [eventCreateSynth.address, 'GDAI', tokenContractLabelString],
    [
      auctionHouse.address,
      auctionHouseContractLabelString,
      auctionHouseContractLabelString,
    ],
    [minter.address, minterContractLabelString, minterContractLabelString],
    [feedGho.address, 'FeedGho', feedContractLabelString],
    [feedGdai.address, 'FeedGdai', feedContractLabelString],
  ].map((args: any) => saveFrontendFiles(args[0], args[1], args[2]));
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
