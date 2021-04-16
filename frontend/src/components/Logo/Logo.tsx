import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    lineHeight: '36px',
    color: '#fff'
  }
}))

const Logo = () => {
  const classes = useStyles()

  return (
    <Typography variant="h6" className={classes.root}>
      GHOST
    </Typography>
  )
}

export default Logo
