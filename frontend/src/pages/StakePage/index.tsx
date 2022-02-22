import React, { useState, useEffect } from 'react';

import { Redirect } from 'react-router-dom';

import useStyle from './index.style';
import { useSelector } from '../../redux/hooks';

import useOnlyDigitField from '../../hooks/useOnlyDigitField';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import { NumericalInput } from '../../components/InputMask';

import PopUp from '../../components/PopUp';

import greyArrow from '../../assets/arrow.png';
import yellowArrow from '../../assets/arrow-up-yellow.png';
import gDaiIcon from '../../assets/dai-border.svg';
import { GdaiIcon } from '../../components/Icons';

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
          <div>
            <img
              alt={chosenStake.title}
              src={chosenStake.background}
              className={classes.coverImage}
            />
          </div>
          <form className={classes.formWrapper} onSubmit={stakeAction}>
            <p className={classes.formTitle}>{chosenStake.title}</p>
            <p className={classes.formSubtitle}>{chosenStake.subtitle}</p>

            <div className={classes.formLine}>
              <ButtonForm
                className={`${classes.formOption} ${classes.formOptionShort}`}
              >
                <>
                  <img
                    className={`${classes.formOptionImage} ${classes.formOptionImageShort}`}
                    alt="Arrow down"
                    src={greyArrow}
                  />
                  Short
                </>
              </ButtonForm>
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
              <ButtonForm
                className={`${classes.formOption} ${classes.formOptionLong}`}
              >
                <>
                  <img
                    className={classes.formOptionImage}
                    alt="Arrow up"
                    src={yellowArrow}
                  />
                  Long
                </>
              </ButtonForm>
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
          </form>
        </>
      )}
    </>
  );
};

export default StakePage;
