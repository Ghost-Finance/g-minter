import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import BigNumber from 'bignumber.js';
import useStyle from './index.style';
import hooks from '../../hooks/walletConnect';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
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
import { bigNumberToFloat, bigNumberToString } from '../../utils/StringUtils';

const MintPage = () => {
  let gdaiTarget: string = 'gdai';
  let ghoTarget: string = 'gho';
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
  } = useOnlyDigitField('text');
  const {
    reset: resetGdaiField,
    valid: gdaiFieldValid,
    setValue: setGdaiValue,
    ...gdaiField
  } = useOnlyDigitField('text');

  console.log(`GHO value: ${ghoField.value}`);
  console.log(`GDAI value: ${gdaiField.value}`);
  console.log(`GHO vali ${gdaiFieldValid}`);
  console.log(`GDAI vali ${ghoFieldValid}`);

  async function handleMint() {
    if (!(gdaiFieldValid && ghoFieldValid)) return;

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

  async function handleMaxGHO(e: any) {
    e.preventDefault();
    let balanceValue = await balanceOf(ghoContract, account as string);
    let value = ghoField.value
      ? ghoField.value
      : bigNumberToString(balanceValue);
    try {
      let maxGdaiValue = await maximumByCollateral(
        minterContract,
        gDaiAddress,
        account as string,
        value
      );
      setValues(value, bigNumberToString(maxGdaiValue));
    } catch (error) {}
  }

  async function handleMaxDAI(e: any) {
    e.preventDefault();
    let balanceValue = await balanceOf(gDaiContract, account as string);

    let value = gdaiField.value
      ? gdaiField.value
      : bigNumberToString(balanceValue).toString();
    try {
      let maxGhoValue = await maximumByDebt(
        minterContract,
        gDaiAddress,
        account as string,
        value
      );

      setValues(bigNumberToString(maxGhoValue), value);
    } catch (error) {}
  }

  useEffect(() => {
    dispatch(setStatus('pending'));
    dispatch(setCRatioSimulateMint('0', '0', '0'));

    async function fetchData() {
      if (!(gdaiFieldValid && ghoFieldValid)) return;
      try {
        const { cRatio, collateralBalance, synthDebt } =
          await positionExposeData(
            minterContract,
            gDaiAddress,
            account as string,
            ghoField.value,
            gdaiField.value
          );

        setBtnDisabled(true);
        dispatch(
          setCRatioSimulateMint(
            (bigNumberToFloat(cRatio) * 100).toString(),
            bigNumberToFloat(collateralBalance).toString(),
            bigNumberToFloat(synthDebt).toString()
          )
        );
      } catch (error) {
        console.log(error);
        setBtnDisabled(false);
        dispatch(setCRatioSimulateMint('0', '0', '0'));
      }
    }

    fetchData();
    dispatch(setStatus('success'));
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

                  <input className={classes.input} id="gdai" {...gdaiField} />

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

                  <input className={classes.input} id="gho" {...ghoField} />

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
                      !btnDisabled ? classes.buttonMint : classes.buttonMintGrey
                    }
                    onClick={handleMint}
                    disabled={btnDisabled}
                  />
                </div>
              </div>
            </Box>
            <div
              className={
                !btnDisabled ? classes.bottomBox : classes.bottomBoxGrey
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
