import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import BigNumber from 'bignumber.js';
import useStyle from './index.style';
import hooks from '../../hooks/walletConnect';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import { NumericalInput } from '../../components/InputMask';
import { GhostIcon } from '../../components/Icons';
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

const MintPage = () => {
  const classes = useStyle();
  const minterContract = useMinter();
  const ghoContract = useERC20(ghoAddress);
  const gDaiContract = useERC20(gDaiAddress);

  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.wallet);
  const { cRatioSimulateMintValue } = useSelector((state) => state.app);

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

  function dispatchLoading(key: string) {
    dispatch(setStatus(key));
  }

  async function handleMint() {
    if (btnDisabled || ghoField.value === '' || gdaiField.value === '') return;

    setRedirect(true);
    await approve(
      ghoContract,
      account as string,
      minterAddress,
      ghoField.value
    )(dispatchLoading);

    await mint(
      minterContract,
      gDaiAddress,
      ghoField.value,
      gdaiField.value,
      account as string
    )(dispatchLoading);

    resetGhoField();
    resetGdaiField();
  }

  function setValues(ghoValue: string, gdaiValue: string) {
    setGhoValue(ghoValue);
    setGdaiValue(gdaiValue);
  }

  async function handleMaxGHO() {
    dispatchLoading('pending');
    let balanceValue = await balanceOf(ghoContract, account as string);
    await maximumCollateralValue(bigNumberToString(balanceValue));
  }

  async function handleMaxDAI() {
    dispatchLoading('pending');
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
    dispatchLoading('pending');
    await maximumCollateralValue(ghoField.value);
  }

  async function changeMaxGdai() {
    if (gdaiField.value === '' || ghoField.value !== '') return;
    dispatchLoading('pending');
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
      dispatchLoading('error');
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
      dispatchLoading('error');
      console.error(error.message);
    }
  }

  useEffect(() => {
    setRedirectHome(account === null);
    dispatchLoading('pending');
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
        debugger;
        dispatchLoading('success');
      } catch (error) {
        setBtnDisabled(true);
        dispatchLoading('error');
        dispatch(setCRatioSimulateMint('0', '0', '0'));
      }
    }

    const requestId = setTimeout(() => {
      changeMaxGdai();
      changeMaxGho();
      fetchData();
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
  ]);

  return (
    <div className="modal side-left">
      {redirect ? (
        <Redirect
          to={{
            pathname: '/alert',
          }}
        />
      ) : null}

      {redirectHome ? (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      ) : null}

      <Grid container direction="column" className={classes.root}>
        <div className={classes.containerTop}>
          <Grid item>
            <Link to="/" className={classes.link}>
              <ButtonForm text="Cancel" className={classes.buttonCancel} />
            </Link>
          </Grid>

          <Grid item>
            <ConnectWallet />
          </Grid>
        </div>

        <Grid className={classes.paperContent} item>
          <div className={classes.cardForm}>
            <div className={classes.topBox}>&nbsp;</div>

            <Box className={classes.contentCard}>
              <div className={classes.container}>
                <h1 className={classes.title}>
                  Mint <br /> your gDAI
                </h1>

                <InputContainer>
                  <GhostIcon />
                  <span className={classes.labelInput}>gDAI</span>

                  <NumericalInput
                    className={classes.input}
                    id="gdai"
                    {...gdaiField}
                  />

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

                  <NumericalInput
                    className={classes.input}
                    id="gho"
                    {...ghoField}
                  />

                  <div>
                    <ButtonForm
                      text="MAX"
                      className={classes.buttonMax}
                      onClick={handleMaxGHO}
                    />
                  </div>
                </InputContainer>

                <span className={classes.labelGas}>Gas Fee $0.00/0 GWEI</span>

                <div>
                  <ButtonForm
                    text="Mint gDAI"
                    className={
                      btnDisabled ||
                      ghoField.value === '' ||
                      gdaiField.value === ''
                        ? classes.buttonMintGrey
                        : classes.buttonMint
                    }
                    onClick={() => {
                      dispatchLoading('idle');
                      handleMint();
                    }}
                    disabled={
                      btnDisabled ||
                      ghoField.value === '' ||
                      gdaiField.value === ''
                    }
                  />
                </div>
              </div>
            </Box>
            <div
              className={
                btnDisabled || ghoField.value === '' || gdaiField.value === ''
                  ? classes.bottomBoxGrey
                  : classes.bottomBox
              }
            >
              &nbsp;
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MintPage;
