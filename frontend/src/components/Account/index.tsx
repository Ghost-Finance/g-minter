import React from 'react'
import { Box, Chip, IconButton, makeStyles } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface Props {
  address: string
  networkName: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '14px'
    }
  },
  label: {
    background: '#fff',
    color: '#000',
    [theme.breakpoints.down('md')]: {
      fontSize: '12px'
    }
  }
}))

const Account = ({ address, networkName }: Props) => {
  const classes = useStyles()
  return (
    <Box component="div" m={1} className={classes.root}>
      <span>{[address.slice(0, 5), address.slice(-5)].join('...')}</span>&nbsp;
      <Chip size="small" label={networkName} className={classes.label} />
      <IconButton edge="end" color="inherit">
        <ExpandMoreIcon />
      </IconButton>
    </Box>
  )
}

export default Account
