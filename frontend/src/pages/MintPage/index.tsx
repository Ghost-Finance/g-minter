import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import BigNumber from 'bignumber.js';
import useStyle from './style';
import hooks from '../../hooks/walletConnect';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import { GhostIcon } from '../../components/Icons';
import { useMinter, useERC20 } from '../../hooks/useContract';
import { useDispatch, useSelector } from '../../redux/hooks';
import {
  approve,
  mint,
  depositCollateral,
  balanceOf,
  maximumByCollateral,
  maximumByDebt,
  simulateMint,
} from '../../utils/calls';
import { setTxSucces, setCRatioSimulateMint } from '../../redux/app/actions';
import ConnectWallet from '../../components/Button/ConnectWallet';
import { gDaiAddress, ghoAddress, minterAddress } from '../../utils/constants';
import {
  bigNumberToFloat,
  bigNumberToString,
  stringToBigNumber,
} from '../../utils/StringUtils';

const MintPage = () => {
  const classes = useStyle();
  const minterContract = useMinter();
  const ghoContract = useERC20(ghoAddress);
  const gDaiContract = useERC20(gDaiAddress);

  const dispatch = useDispatch();
  const { account } = useSelector(state => state.wallet);

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [gdaiValue, setGdaiValue] = useState('');
  const [ghoValue, setGhoValue] = useState('');

  async function handleMint() {
    if (btnDisabled) return;

    setRedirect(true);
    dispatch(setTxSucces(false));
    await approve(ghoContract, account as string, minterAddress, ghoValue);
    await mint(
      minterContract,
      gDaiAddress,
      ghoValue,
      gdaiValue,
      account as string
    );
    setTimeout(() => dispatch(setTxSucces(true)), 5000);
  }

  function setValues(ghoValue: string, gdaiValue: string) {
    setGhoValue(ghoValue);
    setGdaiValue(gdaiValue);
  }

  async function handleMaxGHO(e: any) {
    e.preventDefault();
    let balanceValue = await balanceOf(ghoContract, account as string);
    let value = ghoValue ? ghoValue : balanceValue;
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

    let value = gdaiValue
      ? gdaiValue
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

  function stateDisableButton() {
    if (parseInt(gdaiValue || '0') === 0 || parseInt(ghoValue || '0') === 0) {
      setBtnDisabled(true);
      return true;
    }

    setBtnDisabled(false);
    return false;
  }

  useEffect(() => {
    dispatch(setCRatioSimulateMint('0'));

    const timeout = setTimeout(async () => {
      if (stateDisableButton()) return;

      const cRatio = await simulateMint(
        minterContract,
        gDaiAddress,
        account as string,
        ghoValue ? ghoValue : '0',
        gdaiValue ? gdaiValue : '0'
      );
      dispatch(
        setCRatioSimulateMint((bigNumberToFloat(cRatio) * 100).toString())
      );
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [account, minterContract, ghoValue, gdaiValue, dispatch]);

  return (
    <div className="modal">
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

                  <input
                    className={classes.input}
                    type="text"
                    value={gdaiValue}
                    onChange={e => {
                      setGdaiValue(e.target.value.trim());
                      setTimeout(() => stateDisableButton, 3000);
                    }}
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

                  <input
                    className={classes.input}
                    type="text"
                    value={ghoValue}
                    onChange={e => {
                      setGhoValue(e.target.value.trim());
                      setTimeout(() => stateDisableButton, 3000);
                    }}
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
                      btnDisabled ? classes.buttonMintGrey : classes.buttonMint
                    }
                    onClick={handleMint}
                    disabled={btnDisabled}
                  />
                </div>
              </div>
            </Box>
            <div
              className={
                btnDisabled ? classes.bottomBoxGrey : classes.bottomBox
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
