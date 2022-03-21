import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import useStyle from './index.style';
import { useSelector } from '../../redux/hooks';

import useOnlyDigitField from '../../hooks/useOnlyDigitField';
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
  const { account } = useSelector(state => state.wallet);
  const [redirectHome, setRedirectHome] = useState(false);
  const [chosenStake, setChosenStake] = useState<any>();
  const classes = useStyle();

  useEffect(() => {
    setRedirectHome(account === null);
  }, [account, chosenStake]);

  const stakeAction = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
  };

  const { onChange: onChangeSynph } = useOnlyDigitField('tel');
  const { onChange: onChangeGDai } = useOnlyDigitField('tel');

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
          <div className={classes.content}>
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
          <form className={classes.formWrapper} onSubmit={stakeAction}>
            <p className={classes.formTitle}>{chosenStake.title}</p>
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
                  placeholder="0.0"
                  className={classes.formInput}
                  onChange={onChangeSynph}
                />

                <div>
                  <ButtonForm text="MAX" className={classes.formInfoMax} />
                </div>
              </InputContainer>
              <Checkbox image={yellowArrow} label="Long" yellow={true} />
            </div>

            <InputContainer>
              <GdaiIcon />
              <span className={classes.formInfoText}>gDAI</span>

              <NumericalInput
                placeholder="0.0"
                className={classes.formInput}
                onChange={onChangeGDai}
              />

              <div>
                <ButtonForm text="MAX" className={classes.formInfoMax} />
              </div>
            </InputContainer>

            <p className={classes.formText}>Gas Fee $0.00/0 GWEI</p>

            <ButtonForm
              className={classes.formSubmit}
              text={`Stake in ${chosenStake.subtitle}`}
            />
            <div className={classes.formIcon}>
              <svg>
                <circle
                  cx="34"
                  cy="34"
                  r="32"
                  fill="#171717"
                  stroke="#EEFF00"
                  stroke-width="4"
                />
                <path
                  d="M27.6082 25.0316H19.0009L18.6005 25.906L27.9418 32.7669L33.7468 29.6728L27.6082 25.0316Z"
                  fill="#EEFF00"
                />
                <path
                  d="M39.8854 34.2467L35.0813 38.0135L43.2883 44H51.8289L52.2293 43.3274L39.8854 34.2467Z"
                  fill="#EEFF00"
                />
                <path
                  d="M18.6005 44L18 42.991C42.6077 19.6908 80.2532 13.9554 96 14.0003C59.382 16.8523 34.2583 35.1884 26.2737 44H18.6005Z"
                  fill="#EEFF00"
                />
              </svg>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default StakePage;
