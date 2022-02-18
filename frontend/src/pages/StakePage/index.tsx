import React, { useState, useEffect } from 'react';

import { Redirect } from 'react-router-dom';

//import { Grid } from '@material-ui/core';
import useStyle from './index.style';
import { useSelector } from '../../redux/hooks';
import PopUp from '../../components/PopUp';

import SpaceXBg from '../../assets/images/space-x.jpeg';
import SpaceXIcon from '../../assets/SPX.svg';
import greyArrow from '../../assets/arrow.png';
import yellowArrow from '../../assets/arrow-up-yellow.png';
import gDaiIcon from '../../assets/dai-border.svg';

const StakePage = () => {
  const { account } = useSelector(state => state.wallet);
  const [redirectHome, setRedirectHome] = useState(false);
  const classes = useStyle();

  useEffect(() => {
    setRedirectHome(account === null);
  }, [account]);
  return (
    <>
      {redirectHome ? (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      ) : null}

      <PopUp />
      <div>
        <img alt="Space X" src={SpaceXBg} className={classes.coverImage} />
      </div>
      <form className={classes.formWrapper}>
        <p className={classes.formTitle}>SpaceX</p>
        <p className={classes.formSubtitle}>gSPX</p>

        <div className={classes.formLine}>
          <button
            className={`${classes.formOption} ${classes.formOptionShort}`}
          >
            <img
              className={`${classes.formOptionImage} ${classes.formOptionImageShort}`}
              alt="Arrow down"
              src={greyArrow}
            />
            Short
          </button>
          <div className={`${classes.formLine} ${classes.formInfo}`}>
            <img
              alt="SpaceX"
              src={SpaceXIcon}
              className={classes.formInfoImage}
            />
            <p className={classes.formInfoText}>gSPX</p>
            <p>10</p>
            <p className={classes.formInfoMax}>Max</p>
          </div>
          <button className={`${classes.formOption} ${classes.formOptionLong}`}>
            <img
              className={classes.formOptionImage}
              alt="Arrow up"
              src={yellowArrow}
            />
            Long
          </button>
        </div>

        <div>
          <div className={`${classes.formLine} ${classes.formInfo}`}>
            <img alt="gDai" src={gDaiIcon} className={classes.formInfoImage} />
            <p className={classes.formInfoText}>gSPX</p>
            <p>10</p>
            <p className={classes.formInfoMax}>Max</p>
          </div>
        </div>

        <p className={classes.formText}>Gas Fee $0.00/0 GWEI</p>

        <button className={classes.formSubmit}>Stake in gSPX</button>
      </form>
    </>
  );
};

export default StakePage;
