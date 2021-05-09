import React from 'react'
import { makeStyles, Theme, Typography, Grid } from '@material-ui/core'

interface Props {
  label: string
  children: JSX.Element
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexRow: 'column',
    padding: '25px',
    marginBottom: '10px'
  },
  label: {
    color: theme.palette.secondary.dark,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: '15px'
  }
}))

const List = ({ label, children }: Props) => {
  const classes = useStyles()
  return (
    <Grid className={classes.root}>
      <Typography className={classes.label}>{label}</Typography>
      {children}
    </Grid>
  )
}

export default List
