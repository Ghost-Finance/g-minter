import React from 'react'
import {
  makeStyles,
  Theme,
  AppBar,
  Toolbar,
  IconButton
} from '@material-ui/core'
import Logo from '../Logo'
import ConnectButton from '../Button/ConnectButton'

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      flexGrow: 1,
      borderBottom: '1px solid rgba(136, 136, 136, 0.4)'
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    grid: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between'
    }
  }
})

export default function TopBar() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.grid}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Logo />
          </IconButton>
          <ConnectButton />
        </Toolbar>
      </AppBar>
    </div>
  )
}
