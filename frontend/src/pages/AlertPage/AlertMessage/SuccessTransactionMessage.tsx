import React from 'react';
import { Link } from 'react-router-dom';
import DoneIcon from '@material-ui/icons/Done';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Button } from '@material-ui/core';
import ButtonForm from '../../../components/Button/ButtonForm';
import infoImage from '../../../assets/arrow-icon-yellow.png';
import useStyle from '../index.style';

const SuccessTransactionMessage = () => {
  const classes = useStyle();

  return (
    <div>
      <div
        className={classes.icon}
        // onClick={() => setConfirmed(!confirmed)}
      >
        <DoneIcon style={{ fontSize: '2.8rem', color: '#EEFF00' }} />
      </div>

      <div className={classes.boxMessage}>
        <h1 className={classes.title}>
          Welcome, <br />
          <span className={classes.textYellow}>ghost friend</span>
        </h1>

        <p className={classes.subTitle}>
          Now that you have collateral. <br />
          Let’s start the game ✨
        </p>
      </div>

      <div className={classes.containerRow}>
        <div className={classes.contentButton}>
          <img alt="complex" src={infoImage} />
          <h3>
            Provide liquidity and <br />
            <span className={classes.textYellow}>earn rewards</span>
          </h3>
          <Link to="/earn" className={classes.link}>
            <ButtonForm
              text="Liquidity program ->"
              className={classes.button}
            />
          </Link>
        </div>

        <Link to="/" className={classes.link}>
          <Button className={classes.buttonCancel}>
            Back to home
            <ArrowForwardIcon style={{ fontSize: '1.5rem', marginLeft: 10 }} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessTransactionMessage;
