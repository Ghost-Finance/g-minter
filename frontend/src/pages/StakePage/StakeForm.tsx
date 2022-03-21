import React, { useState, useEffect, useContext } from 'react';
import useStyle from './index.style';
import {
  gDaiAddress,
  gSpotAddress,
  feedGdaiAddress,
  feedGhoAddress,
  updateHouseAddress,
  vaultAddress,
} from '../../utils/constants';
import { useDispatch, useSelector } from '../../redux/hooks';
import {
  useERC20,
  useFeed,
  useMinter,
  useGSpot,
  useUpdateHouse,
} from '../../hooks/useContract';
import { bigNumberToFloat, formatBalance } from '../../utils/StringUtils';
import {
  balanceOf,
  getSynthAmount,
  feedPrice,
  simulateBurn,
  createPosition,
  approve,
} from '../../utils/calls';
import { setStatus, setCRatioSimulateMint } from '../../redux/app/actions';
import useOnlyDigitField from '../../hooks/useOnlyDigitField';
import { ContextPage } from '../ContentPage';
import FormBox from '../../components/FormBox';
import RadioGroup from '@material-ui/core/RadioGroup';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import { NumericalInput } from '../../components/InputMask';
import { GdaiIcon } from '../../components/Icons';
import { ArrowUp, ArrowDown } from '../../components/Icons/CoreIcons';
import Checkbox from '../../components/Checkbox';
import theme from '../../theme.style';

interface Props {
  synth: any;
}

const SHORT: string = 'Short';
const LONG: string = 'Long';

const StakeForm = ({ synth }: Props) => {
  const minterContract = useMinter();
  const gDaiContract = useERC20(gDaiAddress);
  const gSpotContract = useGSpot(gSpotAddress as string);
  const feedGhoContract = useFeed(feedGhoAddress);
  const feedGdaiContract = useFeed(feedGdaiAddress);
  const updateHouseContract = useUpdateHouse(updateHouseAddress);
  const { account } = useSelector(state => state.wallet);
  const { balanceOfGdai } = useSelector(state => state.app);
  const { setRedirectHome, setRedirect, setCurrentAction } = useContext(
    ContextPage
  );
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [direction, setDirection] = useState(LONG);
  const classes = useStyle();

  const DIRECTION = {
    [SHORT]: 1,
    [LONG]: 2,
  };

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

  async function handleStake() {
    if (btnDisabled || parseInt(gdaiValue) <= 0 || !DIRECTION[direction])
      return;

    setRedirect(true);
    setCurrentAction('stake');
    try {
      await approve(
        gDaiContract,
        account as string,
        vaultAddress,
        gdaiValue
      )(dispatchLoading);

      await createPosition(
        updateHouseContract,
        synth.key,
        gdaiValue,
        DIRECTION[direction],
        account as string
      )(dispatchLoading);

      resetSynthField();
      resetGdaiField();
    } catch (error) {
      dispatchLoading('error');
    }
  }

  async function handleMaxAmounts(e: any) {
    e.preventDefault();
    let balanceOfGdai = bigNumberToFloat(
      await balanceOf(gDaiContract, account as string)
    );

    if (balanceOfGdai <= 0) return;

    let synthTokenAmount = bigNumberToFloat(
      await getSynthAmount(gSpotContract, synth.key, account as string)
    );

    setGdaiValue(formatBalance(balanceOfGdai).toString());
    setSynthValue(formatBalance(balanceOfGdai / synthTokenAmount).toString());
  }

  async function changeMaxGdai() {
    if (Number(gdaiValue) === 0 || Number(synthValue) !== 0) return;
    let synthTokenAmount = bigNumberToFloat(
      await getSynthAmount(gSpotContract, synth.key, account as string)
    );
    setSynthValue(
      formatBalance(Number(gdaiValue) / synthTokenAmount).toString()
    );
  }

  async function changeMaxSynth() {
    if (Number(synthValue) === 0 || Number(gdaiValue) !== 0) return;
    let synthTokenAmount = bigNumberToFloat(
      await getSynthAmount(gSpotContract, synth.key, account as string)
    );
    setGdaiValue(
      formatBalance(Number(synthValue) * synthTokenAmount).toString()
    );
  }

  const handleDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirection((event.target as HTMLInputElement).value);
  };

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
  }, [account, synth, gdaiValue, synthValue, minterContract]);

  return (
    <FormBox
      title={synth.title}
      titleButton={`Stake in ${synth.subtitle}`}
      onClick={handleStake}
      disableButton={btnDisabled}
    >
      <p className={classes.formSubtitle}>{synth.subtitle}</p>
      <RadioGroup
        row
        className={classes.groupInputs}
        value={direction}
        onChange={handleDirection}
      >
        <Checkbox
          label={
            <>
              <ArrowDown
                color={
                  direction === 'Short'
                    ? theme.brand.main
                    : theme.palette.secondary.light
                }
              />
              &nbsp;<span>Short</span>
            </>
          }
          value={SHORT}
          checked={direction === SHORT}
        />
        <InputContainer>
          <img
            alt={synth.title}
            src={synth.logo}
            className={classes.formInfoImage}
          />
          <span className={classes.formInfoText}>{synth.subtitle}</span>

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
        <Checkbox
          label={
            <>
              <ArrowUp
                color={
                  direction === LONG
                    ? theme.brand.main
                    : theme.palette.secondary.light
                }
              />
              &nbsp;<span>Long</span>
            </>
          }
          value={LONG}
          checked={direction === LONG}
        />
      </RadioGroup>

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
  );
};

export default StakeForm;
