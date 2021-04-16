import React from 'react'
import {
  makeStyles,
  Theme,
  AppBar,
  Toolbar,
  Button,
  IconButton
} from '@material-ui/core'
import Logo from '../Logo/Logo'

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      flexGrow: 1,
      borderBottom: '1px solid #eee'
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  }
})

export default function TopBar() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="regular">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <div className={classes.title}>
              <Logo />
            </div>
          </IconButton>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
