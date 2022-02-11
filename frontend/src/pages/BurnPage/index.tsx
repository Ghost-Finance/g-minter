import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { ContextPage } from '../ContentPage';
import FormBox from '../../components/FormBox';
import InputContainer from '../../components/InputContainer';
import ButtonForm from '../../components/Button/ButtonForm';
import GdaiIcon from '../../components/Icons/GDaiIcon';
import { NumericalInput } from '../../components/InputMask';
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
  const [btnDisabled, setBtnDisabled] = useState(true);
  const {
    reset: resetGdaiField,
    valid: gdaiFieldValid,
    value: gdaiValue,
    setValue: setGdaiValue,
    ...gdaiField
  } = useOnlyDigitField('tel');

  const { account } = useSelector((state) => state.wallet);
  const { balanceOfGdai } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const { setRedirectHome, setRedirect } = useContext(ContextPage);

  function dispatchLoading(key: string) {
    dispatch(setStatus(key));
  }

  async function handleBurn() {
    debugger;
    if (btnDisabled || gdaiValue === '') return;
    debugger;
    setRedirect(true);
    dispatchLoading('idle');
    try {
      await approve(
        gDaiContract,
        account as string,
        minterAddress,
        gdaiValue
      )(dispatchLoading);

      await burn(
        minterContract,
        gDaiAddress,
        gdaiValue,
        account as string
      )(dispatchLoading);

      resetGdaiField();
    } catch (error) {
      debugger;
      dispatchLoading('error');
    }
  }

  async function handleMaxDAI(e: any) {
    e.preventDefault();
    let balanceOfGdai = bigNumberToFloat(
      await balanceOf(gDaiContract, account as string)
    );

    if (balanceOfGdai <= 0) {
      alert('Gdai amount insufficient!');
      return;
    }

    setGdaiValue(balanceOfGdai.toString());
  }

  useEffect(() => {
    setRedirectHome(account === null);
    dispatchLoading('pending');
    dispatch(setCRatioSimulateBurn('0', '0'));
    setBtnDisabled(true);

    async function fetchData() {
      if (gdaiValue === '') return;

      try {
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
        dispatchLoading('success');
      } catch (error) {
        setBtnDisabled(true);
        dispatchLoading('error');
        dispatch(setCRatioSimulateBurn('0', '0'));
      }
    }

    const requestId = setTimeout(() => {
      if (parseInt(gdaiValue) > 0) setBtnDisabled(false);

      fetchData();
    }, 3000);

    return () => {
      clearTimeout(requestId);
    };
  }, [account, gdaiValue, dispatch, minterContract]);

  return (
    <FormBox
      titleButton="Burn your gDai"
      onClick={handleBurn}
      disableButton={btnDisabled || parseInt(gdaiValue) < 0}
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

      <span className={classes.labelGas}>Gas Fee $0.00/0 GWEI</span>
    </FormBox>
  );
};

export default BurnPage;
