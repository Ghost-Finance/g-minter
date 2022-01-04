import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import useStyle from './style';
import ButtonForm from '../../components/Button/ButtonForm';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DoneIcon from '@material-ui/icons/Done';
import { useSelector } from '../../redux/hooks';

const AlertPage = () => {
  const classes = useStyle();
  const [confirmed, setConfirmed] = useState(false);

  const app = useSelector(state => state.app);
  const { txSuccess } = app;

  return (
    <div className="modal">
      <Grid container direction="column" className={classes.root}>
        <Grid className={classes.paperContent} item>
          <div className={classes.cardForm}>
            {!txSuccess ? (
              <div>
                <div
                  className={classes.icon}
                  onClick={() => setConfirmed(!confirmed)}
                >
                  <ArrowForwardIcon style={{ fontSize: '2.8rem' }} />
                </div>

                <h1 className={classes.title}>
                  Please <br />
                  confirm your <br />
                  transaction
                </h1>

                <p className={classes.subTitle}>
                  You need to confirm this in your <br />
                  wallet. If it doens't work, &nbsp;
                  <Link to="/" className={classes.help}>
                    ask here <br /> for help.
                  </Link>
                </p>

                <Link to="/" className={classes.link}>
                  <ButtonForm text="Cancel" className={classes.buttonCancel} />
                </Link>
              </div>
            ) : (
              <div>
                <div
                  className={classes.icon}
                  onClick={() => setConfirmed(!confirmed)}
                >
                  <DoneIcon style={{ fontSize: '2.8rem', color: '#EEFF00' }} />
                </div>

                <h1 className={classes.title}>
                  Your transaction <br />
                  is right on the way <br />
                  <span className={classes.textYellow}>to be confirmed</span>
                </h1>

                <p className={classes.subTitle}>
                  Now you just need to <br />
                  wait a few more minutes...
                </p>

                <Link to="/" className={classes.link}>
                  <ButtonForm
                    text=""
                    children={
                      <>
                        Back to home
                        <ArrowForwardIcon
                          style={{ fontSize: '1.5rem', marginLeft: 10 }}
                        />
                      </>
                    }
                    className={classes.buttonCancel}
                  />
                </Link>
              </div>
            )}
            {/* <div className={classes.bottomBox}>
              <div className={classes.topBox}>&nbsp;</div>
            </div> */}
            {confirmed ? (
              <div className={classes.bottomBoxYellow}>&nbsp;</div>
            ) : null}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AlertPage;
