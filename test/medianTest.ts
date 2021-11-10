import { ethers } from 'hardhat';
import { expect } from 'chai';
import { set, reset } from 'mockdate';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { signerMessage } from './util/FeedSigners';

let medianContractLabel: string = 'MedianSpacex';

describe('#MedianSpacex', async function() {
  let Median,
    median,
    owner,
    accountOne,
    accountTwo,
    accountThree,
    accounts,
    others,
    provider,
    wallet,
    walletTwo,
    walletThree;

  const date = new Date('2020-10-19T09:00:11.451Z');

  const url = 'http://localhost:8545';

  beforeEach(async function() {
    set(date);
    [owner, ...accounts] = await ethers.getSigners();
    [accountOne, accountTwo, accountThree, ...others] = accounts;

    Median = await ethers.getContractFactory(medianContractLabel);
    median = await Median.deploy();

    provider = ethers.getDefaultProvider(url);
    let mnemonic =
      'radar blur cabbage chef fix engine embark joy scheme fiction master release';
    wallet = ethers.Wallet.fromMnemonic(mnemonic);
    let mnemonicTwo =
      'west view blame skirt entry fashion oxygen area pistol kitten pride august';
    walletTwo = ethers.Wallet.fromMnemonic(mnemonicTwo);
    let mnemonicThree =
      'soft magnet brick indoor turkey twin unknown base fee summer motor birth';
    walletThree = ethers.Wallet.fromMnemonic(mnemonicThree);
  });

  afterEach(async function() {
    reset();
  });

  it('#addOracle validate only owner can add a new oracle', async function() {
    try {
      await median.connect(accountOne).addOracle(wallet.address);
    } catch (error) {
      expect(error.message).to.match(/caller is not the owner/);
    }
  });

  it('#addOracle should return success add a new new oracle', async function() {
    await median.addOracle(wallet.address);

    expect(await median.oracle(wallet.address)).to.be.equal(1);
  });

  it('#poke validates if answers are blank', async function() {
    try {
      await median.poke([]);
    } catch (error) {
      expect(error.message).to.match(/Invalid number of answers of Oracles/);
    }
  });

  it('#poke validates if the number of answers excited the limit', async function() {
    const timestamp = date.getTime();
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });

    try {
      await median.poke(
        Array(4).fill({
          value: BigNumber.from(parseEther('11')),
          timestamp: timestamp.toString(),
          v: sigOne.v,
          r: sigOne.r,
          s: sigOne.s,
        })
      );
    } catch (error) {
      expect(error.message).to.match(/Invalid number of answers of Oracles/);
    }
  });

  it('#poke validates if answers is shorted than permitted', async function() {
    const timestamp = date.getTime();
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });

    try {
      await median.poke([
        {
          value: BigNumber.from(parseEther('11')),
          timestamp: timestamp.toString(),
          v: sigOne.v,
          r: sigOne.r,
          s: sigOne.s,
        },
      ]);
    } catch (error) {
      expect(error.message).to.match(/Invalid number of answers of Oracles/);
    }
  });

  it('#poke validates signer is a permitted oracle', async function() {
    [wallet.address, walletTwo.address].map(
      async address => await median.addOracle(address)
    );

    const timestamp = date.getTime();
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigTwo = await signerMessage(walletTwo, {
      value: BigNumber.from(parseEther('12')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigThree = await signerMessage(walletThree, {
      value: BigNumber.from(parseEther('13')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const feedData = [
      {
        value: BigNumber.from(parseEther('11')),
        timestamp: timestamp.toString(),
        v: sigOne.v,
        r: sigOne.r,
        s: sigOne.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
      {
        value: BigNumber.from(parseEther('13')),
        timestamp: timestamp.toString(),
        v: sigThree.v,
        r: sigThree.r,
        s: sigThree.s,
      },
    ];

    try {
      await median.poke(feedData);
    } catch (error) {
      expect(error.message).to.match(/Not authorized oracle signer/);
    }
  });

  it('#poke validates if oracle send a duplicate data', async function() {
    [wallet.address, walletTwo.address].map(
      async address => await median.addOracle(address)
    );

    const timestamp = date.getTime();
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigTwo = await signerMessage(walletTwo, {
      value: BigNumber.from(parseEther('12')),
      timestamp: timestamp,
      type: 'SPACEX',
    });

    const feedData = [
      {
        value: BigNumber.from(parseEther('11')),
        timestamp: timestamp.toString(),
        v: sigOne.v,
        r: sigOne.r,
        s: sigOne.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
    ];

    try {
      await median.poke(feedData);
    } catch (error) {
      expect(error.message).to.match(/Signer oracle already sended/);
    }
  });

  it('#poke validates if oracle message was expired at', async function() {
    [wallet.address, walletTwo.address, walletThree.address].map(
      async address => await median.addOracle(address)
    );

    let newDate = new Date();
    const timestamp = newDate.setTime(newDate.getTime() - 24 * 60 * 60 * 1000);
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigTwo = await signerMessage(walletTwo, {
      value: BigNumber.from(parseEther('12')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigThree = await signerMessage(walletThree, {
      value: BigNumber.from(parseEther('13')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const feedData = [
      {
        value: BigNumber.from(parseEther('11')),
        timestamp: timestamp.toString(),
        v: sigOne.v,
        r: sigOne.r,
        s: sigOne.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
      {
        value: BigNumber.from(parseEther('13')),
        timestamp: timestamp.toString(),
        v: sigThree.v,
        r: sigThree.r,
        s: sigThree.s,
      },
    ];

    try {
      await median.poke(feedData);
    } catch (error) {
      console.log(error.message);
      expect(error.message).to.match(/Signer oracle message expired/);
    }
  });

  it('#poke validates if data is in desc order', async function() {
    [wallet.address, walletTwo.address, walletThree.address].map(
      async address => await median.addOracle(address)
    );
    const timestamp = date.getTime();
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigTwo = await signerMessage(walletTwo, {
      value: BigNumber.from(parseEther('13')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigThree = await signerMessage(walletThree, {
      value: BigNumber.from(parseEther('12')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const feedData = [
      {
        value: BigNumber.from(parseEther('11')),
        timestamp: timestamp.toString(),
        v: sigOne.v,
        r: sigOne.r,
        s: sigOne.s,
      },
      {
        value: BigNumber.from(parseEther('13')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigThree.v,
        r: sigThree.r,
        s: sigThree.s,
      },
    ];

    try {
      await median.poke(feedData);
    } catch (error) {
      expect(error.message).to.match(/Message is not in the order/);
    }
  });

  it('#poke should return success when data is correct', async function() {
    [wallet.address, walletTwo.address, walletThree.address].map(
      async address => await median.addOracle(address)
    );
    const timestamp = date.getTime();
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigTwo = await signerMessage(walletTwo, {
      value: BigNumber.from(parseEther('12')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigThree = await signerMessage(walletThree, {
      value: BigNumber.from(parseEther('13')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const feedData = [
      {
        value: BigNumber.from(parseEther('11')),
        timestamp: timestamp.toString(),
        v: sigOne.v,
        r: sigOne.r,
        s: sigOne.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
      {
        value: BigNumber.from(parseEther('13')),
        timestamp: timestamp.toString(),
        v: sigThree.v,
        r: sigThree.r,
        s: sigThree.s,
      },
    ];

    const poke = await median.poke(feedData);
    const receipt = await poke.wait();
    // const block = await median.provider.getBlock(receipt.blockHash);

    const { args } = receipt.events[0];
    expect(feedData[1].value.toString()).to.be.equal(args.val.toString());
    // expect(block.timestamp).to.be.equal(args.age.toNumber());
  });

  it('#recovery Should return signer addreess', async function() {
    const timestamp = date.getTime();
    const hash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'bytes32'],
        [
          BigNumber.from(parseEther('12')),
          timestamp.toString(),
          ethers.utils.formatBytes32String('SPACEX'),
        ]
      )
    );
    const signature = await wallet.signMessage(ethers.utils.arrayify(hash));
    const sig = ethers.utils.splitSignature(signature);
    console.log(sig.v, sig.r, sig.s);

    const signatureAccountOne = await median.recover(
      BigNumber.from(parseEther('12')),
      timestamp.toString(),
      sig.v,
      sig.r,
      sig.s
    );

    expect(wallet.address).to.be.equal(signatureAccountOne);
  });

  it('#read validates oracle is permitted to read', async function() {
    try {
      await median.connect(accountOne).read();
    } catch (error) {
      expect(error.message).to.match(/Contract not permitted to read/);
    }
  });

  it('#read validates if price is not bigger than zero', async function() {
    await median.addContract(accountOne.address);

    try {
      await median.connect(accountOne).read();
    } catch (error) {
      expect(error.message).to.match(/Invalid price to read/);
    }
  });

  it('#read Should return price when price is bigger than zero', async function() {
    await median.addContract(accountOne.address);
    [wallet.address, walletTwo.address, walletThree.address].map(
      async address => await median.addOracle(address)
    );
    const timestamp = date.getTime();
    const sigOne = await signerMessage(wallet, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigTwo = await signerMessage(walletTwo, {
      value: BigNumber.from(parseEther('12')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigThree = await signerMessage(walletThree, {
      value: BigNumber.from(parseEther('13')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const feedData = [
      {
        value: BigNumber.from(parseEther('11')),
        timestamp: timestamp.toString(),
        v: sigOne.v,
        r: sigOne.r,
        s: sigOne.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
      {
        value: BigNumber.from(parseEther('13')),
        timestamp: timestamp.toString(),
        v: sigThree.v,
        r: sigThree.r,
        s: sigThree.s,
      },
    ];

    await median.poke(feedData);
    const price = await median.connect(accountOne).read();

    expect(price.toString()).to.be.equal(BigNumber.from(parseEther('12')));
  });
});
