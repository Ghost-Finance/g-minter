import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import useStyle from './style';
import arrowIconError from '../../assets/arrow-icon-red.png';
import arrowIconSuccess from '../../assets/arrow-icon-red.png';

interface Props {
  title: string;
  subTitle: string;
  link: string | null;
  type?: string;
}

const InfoCard = ({ title, type, subTitle, link }: Props) => {
  const classes = useStyle();
  const imageProps =
    type === 'error' ? { src: arrowIconError } : { src: arrowIconSuccess };

  return (
    <div className={classes.root}>
      <a
        href={link || ''}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.link}
      >
        <Paper
          className={
            type === 'error' ? classes.contentError : classes.contentSuccess
          }
        >
          <div>
            <div className={classes.image}>
              <img className={classes.img} alt="complex" {...imageProps} />
            </div>

            <Grid item xs>
              <Typography component="h4" variant="h4" className={classes.title}>
                {title}
              </Typography>
              <Typography
                component="h4"
                variant="h4"
                className={classes.subTitle}
              >
                {subTitle}
              </Typography>
            </Grid>
          </div>
        </Paper>
      </a>
    </div>
  );
};

export default InfoCard;
