import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@material-ui/core';
import useStyle from './index.style';
import hooks from '../../hooks/walletConnect';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import FormBox from '../../components/FormBox';
import { NumericalInput } from '../../components/InputMask';
import { GhostIcon, GdaiIcon } from '../../components/Icons';
import { useMinter, useERC20 } from '../../hooks/useContract';
import useOnlyDigitField from '../../hooks/useOnlyDigitField';
import { useDispatch, useSelector } from '../../redux/hooks';
import {
  approve,
  mint,
  balanceOf,
  maximumByCollateral,
  maximumByDebt,
  positionExposeData,
  simulateMint,
} from '../../utils/calls';
import {
  setTxSucces,
  setStatus,
  setCRatioSimulateMint,
} from '../../redux/app/actions';
import ConnectWallet from '../../components/Button/ConnectWallet';
import { gDaiAddress, ghoAddress, minterAddress } from '../../utils/constants';
import {
  bigNumberToFloat,
  bigNumberToString,
  formatBalance,
  stringToBigNumber,
} from '../../utils/StringUtils';

interface Props {
  title?: string;
}

const MintPage = ({ title }: Props) => {
  const classes = useStyle();
  const minterContract = useMinter();
  const ghoContract = useERC20(ghoAddress);
  const gDaiContract = useERC20(gDaiAddress);

  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.wallet);

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const {
    reset: resetGhoField,
    valid: ghoFieldValid,
    setValue: setGhoValue,
    ...ghoField
  } = useOnlyDigitField('tel');
  const {
    reset: resetGdaiField,
    valid: gdaiFieldValid,
    setValue: setGdaiValue,
    ...gdaiField
  } = useOnlyDigitField('tel');

  async function handleMint() {
    if (btnDisabled || ghoField.value === '' || gdaiField.value === '') return;

    setRedirect(true);
    dispatch(setStatus('pending'));
    dispatch(setTxSucces(false));
    await approve(
      ghoContract,
      account as string,
      minterAddress,
      ghoField.value
    );
    await mint(
      minterContract,
      gDaiAddress,
      ghoField.value,
      gdaiField.value,
      account as string
    );
    resetGhoField();
    resetGdaiField();
    setTimeout(() => {
      dispatch(setStatus('success'));
      dispatch(setTxSucces(true));
    }, 5000);
  }

  function setValues(ghoValue: string, gdaiValue: string) {
    setGhoValue(ghoValue);
    setGdaiValue(gdaiValue);
  }

  async function handleMaxGHO() {
    dispatch(setStatus('pending'));
    let balanceValue = await balanceOf(ghoContract, account as string);
    await maximumCollateralValue(bigNumberToString(balanceValue));
  }

  async function handleMaxDAI() {
    dispatch(setStatus('pending'));
    let balanceGdaiValue = bigNumberToString(
      await balanceOf(gDaiContract, account as string)
    );

    if (balanceGdaiValue === '0.0') {
      handleMaxGHO();
      return;
    }

    await maximumDebtValue(balanceGdaiValue);
  }

  async function changeMaxGho() {
    if (ghoField.value === '' || gdaiField.value !== '') return;
    dispatch(setStatus('pending'));
    await maximumCollateralValue(ghoField.value);
  }

  async function changeMaxGdai() {
    if (gdaiField.value === '' || ghoField.value !== '') return;
    dispatch(setStatus('pending'));
    await maximumDebtValue(gdaiField.value);
  }

  async function maximumCollateralValue(value: string) {
    try {
      let maxValue = await maximumByCollateral(
        minterContract,
        gDaiAddress,
        account as string,
        value
      );
      setValues(value, bigNumberToString(maxValue));
    } catch (error) {
      dispatch(setStatus('error'));
      console.error(error.message);
    }
  }

  async function maximumDebtValue(value: string) {
    try {
      let maxGhoValue = await maximumByDebt(
        minterContract,
        gDaiAddress,
        account as string,
        value
      );

      setValues(bigNumberToString(maxGhoValue), value);
    } catch (error) {
      dispatch(setStatus('error'));
      console.error(error.message);
    }
  }

  useEffect(() => {
    setRedirectHome(account === null);
    dispatch(setStatus('pending'));
    dispatch(setCRatioSimulateMint('0', '0', '0'));
    setBtnDisabled(true);

    async function fetchData() {
      if (ghoField.value === '' || gdaiField.value === '') return;

      try {
        const { cRatio, collateralBalance, synthDebt } =
          await positionExposeData(
            minterContract,
            gDaiAddress,
            account as string,
            parseFloat(ghoField.value).toFixed(2).toString(),
            parseFloat(gdaiField.value).toFixed(2).toString()
          );

        let ratio = bigNumberToFloat(cRatio) * 100;
        setBtnDisabled(ratio < 900);
        dispatch(
          setCRatioSimulateMint(
            ratio.toString(),
            bigNumberToString(collateralBalance).toString(),
            bigNumberToString(synthDebt).toString()
          )
        );
      } catch (error) {
        setBtnDisabled(true);
        dispatch(setStatus('error'));
        dispatch(setCRatioSimulateMint('0', '0', '0'));
      }
    }

    const requestId = setTimeout(() => {
      changeMaxGdai();
      changeMaxGho();
      fetchData();
      dispatch(setStatus('success'));
    }, 3000);

    return () => {
      clearTimeout(requestId);
    };
  }, [
    account,
    minterContract,
    ghoField.value,
    gdaiField.value,
    gdaiFieldValid,
    ghoFieldValid,
    dispatch,
  ]);

  return (
    <FormBox
      title={title || ''}
      titleButton="Mint your gDai"
      onClick={handleMint}
      disableButton={
        btnDisabled || ghoField.value === '' || gdaiField.value === ''
      }
    >
      <InputContainer>
        <GdaiIcon />
        <span className={classes.labelInput}>gDAI</span>

        <NumericalInput className={classes.input} id="gdai" {...gdaiField} />

        <div>
          <ButtonForm
            text="MAX"
            className={classes.buttonMax}
            onClick={handleMaxDAI}
          />
        </div>
      </InputContainer>
      <InputContainer>
        <GhostIcon />
        <span className={classes.labelInput}>GHO</span>

        <NumericalInput className={classes.input} id="gho" {...ghoField} />

        <div>
          <ButtonForm
            text="MAX"
            className={classes.buttonMax}
            onClick={handleMaxGHO}
          />
        </div>
      </InputContainer>

      <span className={classes.labelGas}>Gas Fee $0.00/0 GWEI</span>
    </FormBox>
  );
};

export default MintPage;
