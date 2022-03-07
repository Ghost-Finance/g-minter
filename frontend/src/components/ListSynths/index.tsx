import React from 'react';
import { makeStyles, Theme, Typography, List } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';
interface Props {
  label: string;
  isSubtitle?: boolean;
  children?: JSX.Element | JSX.Element[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: '10px',
  },
  title: {
    color: theme.palette.secondary.dark,
    letterSpacing: '0.08em',
    textTransform: 'capitalize',
    lineHeight: '15px',
  },
  subtitle: {
    fontSize: '13px',
    marginLeft: '20px',
  },
}));

const ListSynths = ({ label, isSubtitle, children }: Props) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      <Typography
        className={`${classes.title} ${(isSubtitle && classes.subtitle) || ''}`}
      >
        {label}
      </Typography>
      {children}
    </List>
  );
};

export default ListSynths;
