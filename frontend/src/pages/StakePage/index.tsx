import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import useStyle from './index.style';
import {
  gDaiAddress,
  gSpotAddress,
  feedGdaiAddress,
  feedGhoAddress,
} from '../../utils/constants';
import { useDispatch, useSelector } from '../../redux/hooks';
import {
  useERC20,
  useFeed,
  useMinter,
  useGSpot,
} from '../../hooks/useContract';
import { bigNumberToFloat, formatBalance } from '../../utils/StringUtils';
import {
  balanceOf,
  getSynthAmount,
  feedPrice,
  simulateBurn,
} from '../../utils/calls';
import { setStatus, setCRatioSimulateMint } from '../../redux/app/actions';
import useOnlyDigitField from '../../hooks/useOnlyDigitField';
import FormBox from '../../components/FormBox';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import { NumericalInput } from '../../components/InputMask';
import PopUp from '../../components/PopUp';
import greyArrow from '../../assets/arrow.png';
import yellowArrow from '../../assets/arrow-up-yellow.png';
import { GdaiIcon } from '../../components/Icons';
import ConnectWallet from '../../components/Button/ConnectWallet';
import Checkbox from '../../components/Checkbox';

const StakePage = () => {
  const minterContract = useMinter();
  const gDaiContract = useERC20(gDaiAddress);
  const gSpotContract = useGSpot(gSpotAddress as string);
  const feedGhoContract = useFeed(feedGhoAddress);
  const feedGdaiContract = useFeed(feedGdaiAddress);
  const { account } = useSelector((state) => state.wallet);
  const { balanceOfGdai } = useSelector((state) => state.app);
  const [redirectHome, setRedirectHome] = useState(false);
  const [chosenStake, setChosenStake] = useState<any>();
  const [btnDisabled, setBtnDisabled] = useState(true);

  const classes = useStyle();

  const {
    reset: resetGdaiField,
    valid: gdaiFieldValid,
    value: gdaiValue,
    setValue: setGdaiValue,
    ...gdaiField
  } = useOnlyDigitField('tel');
  const dispatch = useDispatch();
  const {
    reset: resetSynthField,
    valid: synthFieldValid,
    value: synthValue,
    setValue: setSynthValue,
    ...synthField
  } = useOnlyDigitField('tel');

  function dispatchLoading(key: string) {
    dispatch(setStatus(key));
  }

  async function handleMaxAmounts(e: any) {
    e.preventDefault();
    let balanceOfGdai = bigNumberToFloat(
      await balanceOf(gDaiContract, account as string)
    );

    if (balanceOfGdai <= 0) return;

    let synthTokenAmount = bigNumberToFloat(
      await getSynthAmount(gSpotContract, chosenStake.key, account as string)
    );

    setGdaiValue(formatBalance(balanceOfGdai).toString());
    setSynthValue(formatBalance(balanceOfGdai / synthTokenAmount).toString());
  }

  async function changeMaxGdai() {
    if (Number(gdaiValue) === 0 || Number(synthValue) !== 0) return;
    let synthTokenAmount = bigNumberToFloat(
      await getSynthAmount(gSpotContract, chosenStake.key, account as string)
    );
    setSynthValue(
      formatBalance(Number(gdaiValue) / synthTokenAmount).toString()
    );
  }

  async function changeMaxSynth() {
    if (Number(synthValue) === 0 || Number(gdaiValue) !== 0) return;
    let synthTokenAmount = bigNumberToFloat(
      await getSynthAmount(gSpotContract, chosenStake.key, account as string)
    );
    setGdaiValue(
      formatBalance(Number(synthValue) * synthTokenAmount).toString()
    );
  }

  useEffect(() => {
    setRedirectHome(account === null);
    dispatchLoading('pending');
    setBtnDisabled(true);

    async function fetchData() {
      try {
        const feedPriceGho = await feedPrice(feedGhoContract);
        const feedPriceGdai = await feedPrice(feedGdaiContract);
        const [cRatio, collateralBalance, synthDebt] = await simulateBurn(
          minterContract,
          gDaiAddress,
          account as string,
          gdaiValue ? gdaiValue : '0',
          feedPriceGho,
          feedPriceGdai
        );

        let ratio = bigNumberToFloat(cRatio) * 100;
        setBtnDisabled(
          ratio < 900 ||
            parseInt(balanceOfGdai || '0') <= 0 ||
            parseInt(gdaiValue || '0') <= 0 ||
            parseInt(gdaiValue || '0') > parseInt(balanceOfGdai || '0')
        );

        dispatch(
          setCRatioSimulateMint(
            ratio.toString(),
            collateralBalance.toString(),
            synthDebt.toString()
          )
        );
        dispatchLoading('success');
      } catch (error) {
        setBtnDisabled(true);
        dispatchLoading('error');
      }
    }

    const requestId = setTimeout(() => {
      setBtnDisabled(!(parseInt(gdaiValue) > 0));

      changeMaxGdai();
      changeMaxSynth();
      fetchData();
      dispatchLoading('idle');
    }, 2000);

    return () => {
      clearTimeout(requestId);
    };
  }, [account, chosenStake, gdaiValue, synthValue, dispatch, minterContract]);

  const stakeAction = () => {};

  return (
    <>
      {redirectHome ? (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      ) : null}

      <PopUp changeStake={setChosenStake} />

      {chosenStake && (
        <>
          <div>
            <img
              alt={chosenStake.title}
              src={chosenStake.background}
              className={classes.coverImage}
            />
            <div className={classes.headerStake}>
              <div className={classes.cancelButton}>
                <Link to="/" className={classes.link}>
                  Cancel
                </Link>
              </div>
              <div className={classes.walletGrid}>
                <ConnectWallet />
              </div>
            </div>
          </div>
          <div className={classes.formWrapper}>
            <FormBox
              title={chosenStake.title}
              titleButton={`Stake in ${chosenStake.subtitle}`}
              onClick={stakeAction}
              disableButton={btnDisabled}
            >
              <p className={classes.formSubtitle}>{chosenStake.subtitle}</p>
              <div className={classes.formLine}>
                <Checkbox image={greyArrow} label="Short" rotate={true} />
                <InputContainer>
                  <img
                    alt={chosenStake.title}
                    src={chosenStake.logo}
                    className={classes.formInfoImage}
                  />
                  <span className={classes.formInfoText}>
                    {chosenStake.subtitle}
                  </span>

                  <NumericalInput
                    id="synth"
                    placeholder="0.0 gDai"
                    value={synthValue}
                    className={classes.formInput}
                    {...synthField}
                  />

                  <div>
                    <ButtonForm
                      text="MAX"
                      className={classes.formInfoMax}
                      onClick={handleMaxAmounts}
                    />
                  </div>
                </InputContainer>
                <Checkbox image={yellowArrow} label="Long" yellow={true} />
              </div>

              <div className={classes.formLine}>
                <InputContainer>
                  <GdaiIcon />
                  <span className={classes.formInfoText}>gDAI</span>

                  <NumericalInput
                    id="gdai"
                    placeholder="0.0"
                    value={gdaiValue}
                    className={classes.formInput}
                    {...gdaiField}
                  />

                  <div>
                    <ButtonForm
                      text="MAX"
                      className={classes.formInfoMax}
                      onClick={handleMaxAmounts}
                    />
                  </div>
                </InputContainer>
              </div>

              <p className={classes.formText}>Gas Fee $0.00/0 GWEI</p>
            </FormBox>
          </div>
        </>
      )}
    </>
  );
};

export default StakePage;
