import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'
import CircularProgressBar from './CircularProgressBar'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '28px'
  },
  box: {
    display: 'flex',
    width: '288px',
    border: '1px solid #BDBDBD',
    boxSizing: 'border-box',
    borderRadius: '200px 200px 0px 0px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
      float: 'none'
    }
  },
  content: {
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
    padding: '25px'
  }
}))

const GhostRatio = () => {
  const classes = useStyles()
  return (
    <Box component="div" m={1} className={classes.root}>
      <div className={classes.box}>
        <div className={classes.content}>
          <CircularProgressBar
            size={200}
            progress={850}
            strokeWidth={2}
            circleOneStroke="#333333"
            circleTwoStroke="#4BE29A"
            errorColorStroke="#F44336"
          />
        </div>
      </div>
    </Box>
  )
}

export default GhostRatio
