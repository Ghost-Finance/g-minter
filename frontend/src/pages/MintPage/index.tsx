import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
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
  simulateMint,
} from '../../utils/calls';
import { setTxSucces, setCRatioSimulateMint } from '../../redux/app/actions';
import ConnectWallet from '../../components/Button/ConnectWallet';
import { gDaiAddress, ghoAddress, minterAddress } from '../../utils/constants';
import BigNumber from 'bignumber.js';
import { bigNumberToFloat } from '../../utils/StringUtils';

const MintPage = () => {
  const classes = useStyle();
  const minterContract = useMinter();
  const ghoContract = useERC20(ghoAddress);
  const gDaiContract = useERC20(gDaiAddress);

  const dispatch = useDispatch();
  const { account } = useSelector(state => state.wallet);

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [gdaiValue, setGdaiValue] = useState('');
  const [ghoValue, setGhoValue] = useState('');

  async function handleMint() {
    if (validateForm()) {
      setRedirect(true);
      dispatch(setTxSucces(false));
      await approve(ghoContract, account as string, minterAddress, ghoValue);
      await depositCollateral(
        gDaiAddress,
        ghoValue,
        minterContract,
        account as string
      );
      await mint(gDaiAddress, gdaiValue, minterContract, account as string);
      setTimeout(() => dispatch(setTxSucces(true)), 5000);
    }
  }

  async function handleMaxGHO() {
    let res = await balanceOf(ghoContract, account as string);
    setGhoValue(
      new BigNumber(res).dividedBy(new BigNumber(10).pow(18)).toString()
    );
  }

  async function handleMaxDAI() {
    let res = await balanceOf(gDaiContract, account as string);
    setGdaiValue(
      new BigNumber(res).dividedBy(new BigNumber(10).pow(18)).toString()
    );
  }

  function validateForm() {
    if (gdaiValue === '0' || ghoValue === '0') {
      return false;
    }
    return true;
  }

  function stateColorButton() {
    if (gdaiValue !== '' && ghoValue !== '') {
      return true;
    }
    return false;
  }

  async function simulateCRatio(type: string, value: string) {
    let gho = type === 'gho' ? value : ghoValue;
    let gdai = type === '' ? value : gdaiValue;

    debugger;
    let cRatioValue = await simulateMint(
      minterContract,
      gDaiAddress,
      ghoValue ? ghoValue : '0',
      gdaiValue ? ghoValue : '0'
    );
    console.log(cRatioValue);
    dispatch(setCRatioSimulateMint(cRatioValue));
  }

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
                      setGdaiValue(e.target.value);
                      setTimeout(() => {
                        simulateCRatio('gdai', e.target.value);
                      }, 3000);
                    }}
                  />

                  <div onClick={() => handleMaxDAI()}>
                    <ButtonForm text="MAX" className={classes.buttonMax} />
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
                      setGhoValue(e.target.value);
                      setTimeout(() => {
                        simulateCRatio('gho', e.target.value);
                      }, 3000);
                    }}
                  />

                  <div onClick={() => handleMaxGHO()}>
                    <ButtonForm text="MAX" className={classes.buttonMax} />
                  </div>
                </InputContainer>

                <span className={classes.labelGas}>Gas Fee $0.00/0 GWEI</span>

                <div onClick={() => handleMint()}>
                  <ButtonForm
                    text="Mint gDAI"
                    className={
                      stateColorButton()
                        ? classes.buttonMint
                        : classes.buttonMintGrey
                    }
                  />
                </div>
              </div>
            </Box>
            <div
              className={
                stateColorButton() ? classes.bottomBox : classes.bottomBoxGrey
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
