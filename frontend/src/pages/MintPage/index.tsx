import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import useStyle from './style';
import ButtonForm from '../../components/Button/ButtonForm';
import InputContainer from '../../components/InputContainer';
import { GhostIcon } from '../../components/Icons';

const MintPage = () => {
  const classes = useStyle();

  return (
    <div className="modal">
      <Grid container direction="column" className={classes.root}>
        <Grid item>
          <Link to="/" className={classes.link}>
            <ButtonForm text="Cancel" className={classes.buttonCancel} />
          </Link>
        </Grid>
        <Grid className={classes.paperContent} item>
          <div className={classes.cardForm}>
            <div className={classes.topBox}>&nbsp;</div>

            <Box className={classes.contentCard}>
              <div className={classes.container}>
                <h1 className={classes.title}>
                  Mint <br /> your gDAI
                </h1>

                <InputContainer>
                  <GhostIcon />
                  <span className={classes.labelInput}>gDAI</span>

                  <input
                    className={classes.input}
                    type="text"
                    value="100,000"
                  />

                  <ButtonForm text="MAX" className={classes.buttonMax} />
                </InputContainer>

                <InputContainer>
                  <GhostIcon />
                  <span className={classes.labelInput}>GHO</span>

                  <input
                    className={classes.input}
                    type="text"
                    value="22,522.53"
                  />

                  <ButtonForm text="MAX" className={classes.buttonMax} />
                </InputContainer>

                <span className={classes.labelGas}>Gas Fee $0.00/0 GWEI</span>

                <ButtonForm text="Mint gDAI" className={classes.buttonMint} />
              </div>
            </Box>
            <div className={classes.bottomBox}>&nbsp;</div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MintPage;
