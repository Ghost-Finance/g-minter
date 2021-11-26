import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

interface Message {
  value: BigNumber;
  age: Number;
  type: string;
}

export const messageConvertToKecak256 = ({ value, age, type }: Message) =>
  ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'uint256', 'bytes32'],
      [value, age, ethers.utils.formatBytes32String(type)]
    )
  );

export const signerMessage = async (
  account: SignerWithAddress,
  { value, age, type }: Message
) => {
  const hash = messageConvertToKecak256({ value, age, type });
  const signer = await account.signMessage(ethers.utils.arrayify(hash));

  return ethers.utils.splitSignature(signer);
};

// const hash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256', 'bytes32'],['74', new Date().getTime(), ethers.utils.formatBytes32String('GSPACEX')]));
// const signer = await one.signMessage(ethers.utils.arrayify(hash));
// const sig = ethers.utils.splitSignature(signer);
