import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import useStyle from './style';
import hooks from '../../hooks/walletConnect';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import { GhostIcon } from '../../components/Icons';
import { useMinter } from '../../hooks/useContract';
import { useDispatch, useSelector } from '../../redux/hooks';
import { mint, depositCollateral, cMaxDai, cMaxGho } from '../../utils/calls';
import { setTxSucces } from '../../redux/app/actions';
import ConnectWallet from '../../components/Button/ConnectWallet';

const MintPage = () => {
  const classes = useStyle();
  const minterContract = useMinter();
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet);
  const { account } = wallet;

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [gdaiValue, setGdaiValue] = useState('');
  const [ghoValue, setGhoValue] = useState('');

  async function handleMint() {
    if (validateForm()) {
      setRedirect(true);
      dispatch(setTxSucces(false));
      // await depositCollateral('token', ghoValue, minterContract, account as string);
      // await mint('token', gdaiValue, minterContract, account as string);
      setTimeout(() => dispatch(setTxSucces(true)), 5000);
      setTimeout(() => setRedirectHome(true), 6000);
    }
  }

  async function handleMaxDAI() {
    let res = await cMaxDai(
      'token',
      ghoValue,
      minterContract,
      account as string
    );
    setGdaiValue(res);
  }

  async function handleMaxGHO() {
    let res = await cMaxGho(
      'token',
      ghoValue,
      minterContract,
      account as string
    );
    setGhoValue(res);
  }

  function validateForm() {
    if (gdaiValue === '0' || ghoValue === '0') {
      return true;
    }
    return true;
  }

  function stateColorButton() {
    if (gdaiValue !== '' && ghoValue !== '') {
      return true;
    }
    return false;
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
        <div
          style={{
            display: 'flex',
            width: '63%',
            justifyContent: 'space-between',
          }}
        >
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
                    onChange={e => setGdaiValue(e.target.value)}
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
                    onChange={e => setGhoValue(e.target.value)}
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
