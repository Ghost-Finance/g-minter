import React from 'react'
import {
  AppBar,
  IconButton,
  makeStyles,
  Theme,
  Toolbar
} from '@material-ui/core'
import Logo from '../Logo'
import ConnectButton from '../Button/ConnectButton'
import Account from '../Account'

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      flexGrow: 1,
      borderBottom: '1px solid rgba(136, 136, 136, 0.4)'
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    flex: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between'
    }
  }
})
interface Props {
  account: string
  networkName: string
}

const TopBar = ({ account, networkName }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.flex}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Logo />
          </IconButton>
          {account ? (
            <Account address={account} networkName={networkName} />
          ) : (
            <ConnectButton />
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default TopBar
