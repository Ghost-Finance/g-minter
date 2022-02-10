import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import FormBox from '../../components/FormBox';
import InputContainer from '../../components/InputContainer';
import ButtonForm from '../../components/Button/ButtonForm';
import GdaiIcon from '../../components/Icons/GDaiIcon';
import useOnlyDigitField from '../../hooks/useOnlyDigitField';
import { useMinter, useERC20 } from '../../hooks/useContract';
import { useDispatch, useSelector } from '../../redux/hooks';
import { gDaiAddress, minterAddress } from '../../utils/constants';
import { balanceOf, burn, approve, simulateBurn } from '../../utils/calls';
import {
  setTxSucces,
  setStatus,
  setCRatioSimulateBurn,
} from '../../redux/app/actions';
import { bigNumberToFloat } from '../../utils/StringUtils';
import useStyle from '../style';

const BurnPage = () => {
  const classes = useStyle();
  const minterContract = useMinter();
  const gDaiContract = useERC20(gDaiAddress);
  const [availableBtn, setAvailableBtn] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const {
    reset: resetGdaiField,
    valid: gdaiFieldValid,
    value: gdaiValue,
    setValue: setGdaiValue,
  } = useOnlyDigitField('tel');

  const { account } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  async function handleBurn() {
    if (!availableBtn) return;

    setRedirect(true);
    dispatch(setStatus('pending'));
    dispatch(setTxSucces(false));
    await approve(gDaiContract, account as string, minterAddress, gdaiValue);
    await burn(minterContract, gDaiAddress, gdaiValue, account as string);

    resetGdaiField();
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
    setRedirectHome(account === null);
    dispatch(setStatus('pending'));
    dispatch(setCRatioSimulateBurn('0', '0'));
    setBtnDisabled(true);

    async function fetchData() {
      if (gdaiValue === '') return;

      const { cRatio, synthDebt } = await simulateBurn(
        minterContract,
        gDaiAddress,
        account as string,
        gdaiValue ? gdaiValue : '0'
      );

      dispatch(
        setCRatioSimulateBurn(
          (bigNumberToFloat(cRatio) * 100).toString(),
          bigNumberToFloat(synthDebt).toString()
        )
      );
      dispatch(setStatus('success'));
    }

    const requestId = setTimeout(() => {
      fetchData();
      dispatch(setStatus('success'));
    }, 3000);

    return () => {
      clearTimeout(requestId);
    };
  }, [account, gdaiValue, dispatch, minterContract]);

  return (
    <FormBox
      titleButton="Burn your gDai"
      onClick={handleBurn}
      disableButton={btnDisabled || gdaiValue === ''}
    >
      <InputContainer>
        <GdaiIcon />
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
    </FormBox>
  );
};

export default BurnPage;
