import { artifacts, ethers } from 'hardhat';
import { BigNumber, ContractFactory } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { formatEther } from 'ethers/lib/utils';

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
  const [deployer, testUser] = await ethers.getSigners();

  console.log('Account 0 Deployer Address:', deployer.address);
  console.log(
    'Account 0 Deployer balance:',
    formatEther(await deployer.getBalance())
  );

  console.log('Account 1 user address:', testUser.address);

  // Deploy Feed contract
  const GhoToken = await ethers.getContractFactory(tokenContractLabelString);
  const Feed = await ethers.getContractFactory(feedContractLabelString);
  const AuctionHouse = await ethers.getContractFactory(
    auctionHouseContractLabelString
  );
  const Minter = await ethers.getContractFactory(minterContractLabelString);

  const ghoToken = await deployContracts(GhoToken, ...ghoArgs);
  const feedGho = await deployContracts(Feed, ...feedGhoArgs);
  const feedGdai = await deployContracts(Feed, ...feedGdaiArgs);
  const auctionHouse = await deployContracts(AuctionHouse);
  const minter = await deployContracts(
    Minter,
    ghoToken.address,
    feedGho.address,
    auctionHouse.address
  );

  // Generate synths
  const synthArgs = [].concat(gDaiArgs, feedGdai.address);
  await minter.createSynth(...synthArgs);
  console.log(`Minter address contract: ${minter.address}`);
  const gDaiAddress = await minter.getSynth(0);
  // minter
  //   .getSynth(0)
  //   .then(data => (gDaiAddress = data))
  //   .catch(error => console.log(error.message));

  console.log(`Feed address contract: ${feedGho.address}`);
  console.log(`Feed 2 address contract: ${feedGdai.address}`);
  console.log(`Token address contract: ${ghoToken.address}`);
  console.log(`AuctionHouse address contract: ${auctionHouse.address}`);
  console.log(`Minter address contract: ${minter.address}`);
  console.log(`GDai address: ${gDaiAddress}`);

  saveFrontendFiles(
    ghoToken.address,
    gDaiAddress,
    auctionHouse.address,
    minter.address
  );
};

const deployContracts = async (contractFactory: ContractFactory, ...args) => {
  const contract = await contractFactory.deploy(...args);

  return contract;
};

const saveFrontendFiles = (
  ghoContractAddress: string,
  gDaiContractAddress: string,
  auctionHouseContractAddress: string,
  minterContractAddress: string
) => {
  const contractsDir = __dirname + '/../frontend/src/contracts';
  const typechainSrcDir = __dirname + '/../typechain';
  const typechainDestDir = __dirname + '/../frontend/src/typechain';

  // Create target folders if doesn't exists
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  if (!fs.existsSync(typechainDestDir)) {
    fs.mkdirSync(typechainDestDir);
  }

  // Copy contract addresses to /frontend/src/contracts/contract-address.json directory
  fs.writeFileSync(
    contractsDir + '/contract-address.json',
    JSON.stringify(
      {
        GHO: ghoContractAddress,
        GDAI: gDaiContractAddress,
        AuctionHouse: auctionHouseContractAddress,
        Minter: minterContractAddress,
      },
      null,
      2
    )
  );

  // Copy contract abi's to /frontend/src/contracts/* directory
  const ERC20GhoArtifact = artifacts.readArtifactSync(tokenContractLabelString);
  fs.writeFileSync(
    contractsDir + '/GHO.json',
    JSON.stringify(ERC20GhoArtifact, null, 2)
  );

  const ERC20GdaiArtifact = artifacts.readArtifactSync(
    tokenContractLabelString
  );
  fs.writeFileSync(
    contractsDir + '/GDAI.json',
    JSON.stringify(ERC20GdaiArtifact, null, 2)
  );

  const MinterArtifact = artifacts.readArtifactSync(minterContractLabelString);
  fs.writeFileSync(
    contractsDir + '/Minter.json',
    JSON.stringify(MinterArtifact, null, 2)
  );

  const AuctionHouseArtifact = artifacts.readArtifactSync(
    auctionHouseContractLabelString
  );
  fs.writeFileSync(
    contractsDir + '/AuctionHouse.json',
    JSON.stringify(AuctionHouseArtifact, null, 2)
  );

  // Copy typechain to /frontend/src/typechain directory
  fse.copySync(typechainSrcDir, typechainDestDir);

  console.log('Deploy script finished successfully!');
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
