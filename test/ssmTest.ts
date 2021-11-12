import { ethers, network } from 'hardhat';
import { expect } from 'chai';
import { set, reset } from 'mockdate';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { checkAddPriceEvent, checkChangeEvent } from './util/CheckEvent';

let ssmContractLabel: string = 'Ssm';
let gValueTestContractLabel = 'GValueTest';

// const date = new Date('2020-10-19T09:00:11.451Z');

describe('SSM', async function() {
  let Ssm, GValue, ssm, gValue, owner, accountOne, accounts, others;

  beforeEach(async function() {
    // set(date);
    [owner, ...accounts] = await ethers.getSigners();
    [accountOne, ...others] = accounts;

    Ssm = await ethers.getContractFactory(ssmContractLabel);
    GValue = await ethers.getContractFactory(gValueTestContractLabel);

    gValue = await GValue.deploy();
    ssm = await Ssm.deploy(gValue.address);

    await ssm.grantRole(await ssm.READER_ROLE(), accountOne.address);
  });

  it('#change validates account has the admin role', async function() {
    let account = others[0].address;

    try {
      await ssm.connect(accountOne).change(account);
    } catch (error) {
      expect(error.message).to.match(
        /0x0000000000000000000000000000000000000000000000000000000000000000/
      );
    }
  });

  it('#change Should return success if the admin change medianizer contract', async function() {
    const address = others[0].address;

    ssm.change(address).then(_ =>
      checkChangeEvent(ssm, owner.address, address).then(data => {
        expect(data).to.be.true;
      })
    );
  });

  it('#poke validates if can execute with the method was stopped', async function() {
    await ssm.void();

    try {
      await gValue.poke(BigNumber.from(parseEther('3')));
      await ssm.connect(accountOne).poke();
    } catch (error) {
      expect(error.message).to.match(/Method stopped for ADMIN_ROLE/);
    }
  });

  it('#poke validates one hour pass before add a new price', async function() {
    await gValue.poke(BigNumber.from(parseEther('3')));
    await ssm.connect(accountOne).poke();
    const [nextPrice, valid] = await ssm.connect(accountOne).peep();
    expect(nextPrice.toString()).to.be.equal(BigNumber.from(parseEther('3')));
    expect(valid).to.be.true;

    // Save new price
    await gValue.poke(BigNumber.from(parseEther('2')));
    try {
      await ssm.connect(accountOne).poke();
    } catch (error) {
      expect(error.message).to.match(/Waiting for one hour/);
    }
  });

  it('#poke validates when try to save price before ', async function() {});

  it('#poke Should return success when one hour pass to add next price', async function() {
    await gValue.poke(BigNumber.from(parseEther('3')));
    ssm
      .connect(accountOne)
      .poke()
      .then(_ => {
        checkAddPriceEvent(
          ssm,
          accountOne.address,
          BigNumber.from(parseEther('3'))
        ).then(isValid => expect(isValid).to.be.true);
      })
      .catch(error => new Error(error.message));

    const [nextPrice, valid] = await ssm.connect(accountOne).peep();
    expect(nextPrice.toString()).to.be.equal(BigNumber.from(parseEther('3')));
    expect(valid).to.be.true;

    // Update timestamp in block
    await gValue.poke(BigNumber.from(parseEther('2')));
    console.log((await ssm.zzz()).toNumber());
    await network.provider.send('evm_increaseTime', [
      (await ssm.zzz()).toNumber() + 3600,
    ]);
    await ssm.connect(accountOne).poke();
    ssm
      .connect(accountOne)
      .poke()
      .then(_ => {
        checkAddPriceEvent(
          ssm,
          accountOne.address,
          BigNumber.from(parseEther('3'))
        ).then(isValid => expect(isValid).to.be.true);
      })
      .catch(error => new Error(error.message));

    const [nextPriceTwo, validTwo] = await ssm.connect(accountOne).peep();
    expect(nextPriceTwo.toString()).to.be.equal(
      BigNumber.from(parseEther('2'))
    );
    expect(validTwo).to.be.true;

    const [currentPrice, validThree] = await ssm.connect(accountOne).peek();
    expect(currentPrice.toString()).to.be.equal(
      BigNumber.from(parseEther('3'))
    );
    expect(validThree).to.be.true;
  });
});
