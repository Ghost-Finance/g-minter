import React from 'react';
import useStyle from './style';
import { Grid } from '@material-ui/core';

type Props = {
  typeCard?: string;
  children?: React.ReactNode;
};

let MintLabel: string = 'mint';
let BurnLabel: string = 'burn';
let StakeLabel: string = 'stake';

const CardContent = ({ typeCard, children }: Props) => {
  const classes = useStyle();

  const topClassName = {
    [MintLabel]: classes.mint,
    [BurnLabel]: classes.burn,
    [StakeLabel]: classes.stake,
  };

  return (
    <Grid className={classes.root} item>
      <div className={classes.cardForm}>
        <div className={topClassName[typeCard || 'mint']}>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </div>
        {children}
      </div>
    </Grid>
  );
};

export default CardContent;
