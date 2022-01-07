import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import GhostIcon from '../../components/Icons/GhoIcon';
import { useMinter, useERC20 } from '../../hooks/useContract';
import { useDispatch, useSelector } from '../../redux/hooks';
import { gDaiAddress } from '../../utils/constants';
import { burn } from '../../utils/calls';
import { setTxSucces, setStatus } from '../../redux/app/actions';
import useStyle from '../style';

const BurnPage = () => {
  const classes = useStyle();
  const minterContract = useMinter();
  const gDaiContract = useERC20(gDaiAddress);

  const dispatch = useDispatch();
  const { account } = useSelector(state => state.wallet);

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [gdaiValue, setGdaiValue] = useState('');

  async function handleBurn() {
    // if (btnDisabled) return;

    setRedirect(true);
    dispatch(setStatus('pending'));
    dispatch(setTxSucces(false));
    await burn(minterContract, gDaiAddress, gdaiValue, account as string);

    setTimeout(() => {
      dispatch(setStatus('success'));
      dispatch(setTxSucces(true));
    }, 5000);
  }

  function stateDisableButton() {
    if (parseInt(gdaiValue || '0') === 0) {
      // setBtnDisabled(true);
      return true;
    }

    // setBtnDisabled(false);
    return false;
  }

  return (
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
            onChange={e => {
              setGdaiValue(e.target.value.trim());
              setTimeout(() => stateDisableButton, 3000);
            }}
          />

          <div>
            <ButtonForm
              text="MAX"
              className={classes.buttonMax}
              // onClick={handleMaxDAI}
            />
          </div>
        </InputContainer>

        <span className={classes.labelGas}>Gas Fee $0.00/0 GWEI</span>

        <div>
          <ButtonForm
            text="Burn gDAI"
            // className={btnDisabled ? classes.disabled : classes.active}
            className={classes.active}
            onClick={handleBurn}
            // disabled={btnDisabled}
          />
        </div>
      </div>
      <div className={classes.active}>&nbsp;</div>
    </Box>
  );
};

export default BurnPage;
