import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { LogoIcon } from '../../../components/Icons';
import ButtonForm from '../../../components/Button/ButtonForm';
import infoImage from '../../../assets/arrow-icon-yellow.png';
import useStyle from '../index.style';

interface SuccessTransactionMessageProps {
  isFirstTransaction: boolean;
  currentAction: string;
}

const MINT: string = 'mint';
const BURN: string = 'burn';
const STAKE: string = 'stake';

const SuccessTransactionMessage = ({
  isFirstTransaction,
  currentAction,
}: SuccessTransactionMessageProps) => {
  const classes = useStyle();

  const messages = {
    [MINT]: () => (
      <>
        <div className={classes.boxMessage}>
          <h1 className={classes.title}>
            {isFirstTransaction ? (
              <>
                Welcome, <br />
                <span className={classes.textYellow}>ghost friend</span>
              </>
            ) : (
              <>
                Now you <br />
                have more
                <span className={classes.textYellow}> gDAI</span>
              </>
            )}
          </h1>

          <p className={classes.subTitle}>
            {isFirstTransaction ? (
              <>
                Now that you have collateral. <br />
                <span className={classes.textBold}>
                  Let’s start the game ✨
                </span>
              </>
            ) : (
              <>
                Go
                <span className={`${classes.textBold} ${classes.textYellow}`}>
                  {' '}
                  even more ghost{' '}
                </span>
                back to home and
                <br />
                see your new C-Ratio and position
              </>
            )}
          </p>
        </div>

        <div className={classes.containerRow}>
          {isFirstTransaction && (
            <div className={classes.contentButton}>
              <img alt="complex" src={infoImage} />
              <h3>
                Provide liquidity and <br />
                <span className={classes.textYellow}>earn rewards</span>
              </h3>
              <Link
                to={process.env.LIQUIDITY_PROGRAM || '#'}
                className={classes.link}
              >
                <ButtonForm
                  text="Liquidity program ->"
                  className={`${classes.button} ${classes.buttonCancel}`}
                />
              </Link>
            </div>
          )}

          <Link to="/" className={classes.link}>
            <Button className={classes.buttonDefault}>
              Back to home {`->`}
            </Button>
          </Link>
        </div>
      </>
    ),
    [BURN]: () => (
      <>
        <div className={classes.boxMessage}>
          <h1 className={classes.title}>
            Well done, <br />
            Your gDAI is burned!
          </h1>

          <p className={classes.subTitle}>
            Go back to home and see your
            <br />
            new C-Ratio and position
          </p>
        </div>

        <div className={classes.containerRow}>
          <Link to="/" className={classes.link}>
            <Button className={classes.buttonDefault}>
              Back to home {`->`}
            </Button>
          </Link>
        </div>
      </>
    ),
    [STAKE]: () => <></>,
  };
  debugger;
  return (
    <div>
      <div className={classes.icon}>
        <LogoIcon />
      </div>
      {currentAction && messages[currentAction as string]()}
    </div>
  );
};

export default SuccessTransactionMessage;
