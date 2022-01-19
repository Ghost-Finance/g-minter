import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box } from '@material-ui/core';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import GhostIcon from '../../components/Icons/GhoIcon';
import { useMinter, useERC20 } from '../../hooks/useContract';
import { useDispatch, useSelector } from '../../redux/hooks';
import { gDaiAddress, minterAddress } from '../../utils/constants';
import { balanceOf, burn, approve } from '../../utils/calls';
import { setTxSucces, setStatus } from '../../redux/app/actions';
import { bigNumberToFloat } from '../../utils/StringUtils';
import useStyle from '../style';

const BurnPage = () => {
  const classes = useStyle();
  const minterContract = useMinter();
  const gDaiContract = useERC20(gDaiAddress);
  const [availableBtn, setAvailableBtn] = useState(false);

  const { account } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [gdaiValue, setGdaiValue] = useState('');

  async function handleBurn() {
    if (!availableBtn) return;

    setRedirect(true);
    dispatch(setStatus('pending'));
    dispatch(setTxSucces(false));
    await approve(gDaiContract, account as string, minterAddress, gdaiValue);
    await burn(minterContract, gDaiAddress, gdaiValue, account as string);

    setTimeout(() => {
      dispatch(setStatus('success'));
      dispatch(setTxSucces(true));
    }, 5000);
  }

  async function handleMaxDAI(e: any) {
    e.preventDefault();
    let value = await balanceOf(gDaiContract, account as string);

    setGdaiValue(bigNumberToFloat(value).toString());
  }

  useEffect(() => {
    setAvailableBtn(!(parseInt(gdaiValue || '0') === 0));
  }, [gdaiValue]);

  return (
    <>
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
      <Box className={classes.contentCard}>
        <div className={classes.container}>
          <h1 className={classes.title}>
            Burn <br /> your gDAI
          </h1>

          <InputContainer>
            <GhostIcon />
            <span className={classes.labelInput}>gDAI</span>

            <input
              className={classes.input}
              type="text"
              value={gdaiValue}
              onChange={(e) => {
                setGdaiValue(e.target.value.trim());
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

          <span className={classes.labelGas}>Gas Fee $0.00/0 GWEI</span>

          <div>
            <ButtonForm
              text="Burn gDAI"
              className={availableBtn ? classes.active : classes.disabled}
              onClick={handleBurn}
              disabled={!availableBtn}
            />
          </div>
        </div>
        <div className={classes.active}>&nbsp;</div>
      </Box>
    </>
  );
};

export default BurnPage;
